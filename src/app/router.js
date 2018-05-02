/**
 * Created by hhy on 2017/10/14.
 */
'use strict';
/* 全局变量 开始*/
var URL_PREFIX = '';
var HOME_LIST_URL = URL_PREFIX + '/vod/api/home';
var HOME_OVERVIEW_URL = URL_PREFIX + '/vod/api/home/overview';
var CATEGORY_URL = URL_PREFIX + '/vod/api/category';
var YEAR_URL = URL_PREFIX + '/vod/api/year';
var REGION_URL = URL_PREFIX + '/vod/api/region';
var VIDEO_LIST_URL = URL_PREFIX + '/vod/api';
var VIDEO_DETAIL_URL = URL_PREFIX + '/vod/api/';
var ADMIN_SITE = URL_PREFIX + '/admin';


var DEFAULT_SELECT_DATA = {
    category: '全部',
    year: '全部',
    region: '全部'
};
var CategoryListData;
var IScroll = $.AMUI.iScroll;
var myPlayer;
var curData = DEFAULT_SELECT_DATA;
/* IE兼容性函数 */
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    }
}

/* Vue对象 */
/* 视频缩略图组件 */
var VideoItem = {
    template: '#id_video_item',
    props: ['video'],
    computed: {
        full_image_url: function () {
            return URL_PREFIX + this.video.image;
        }
    },
    methods: {
        selectVideo: function (id) {
            router.push({path: '/vod/' + id});
            console.log('select video ' + id)
        }
    }
};
/* 主页分类视频概览 */
var HomeCategoryVideo = {
    name: 'HomeCategory',
    template: '#id_home_category',
    props: ['category'],
    components: {
        'video-item': VideoItem
    },
    data: function () {
        return {
            videos: []
        };
    },
    mounted: function () {
        var vue = this;
        var context = {
            category: this.category.name
        };
        $.get(HOME_OVERVIEW_URL, context, function (data, status) {
            if (!data['error']) {
                vue.videos = data
            } else {
                //alert(data['error'])
            }
        })
    },
    methods: {}
};
Vue.component('v-select', VueSelect.VueSelect);
var HomeView = {
    name: 'Home',
    template: '#id_home',
    props: ['main_categories'],
    components: {
        'category-item': HomeCategoryVideo
    },
    data: function () {
        return {
            count: 0,
            videos: []
        }
    },
    computed: {},
    mounted: function () {
        var vue = this;
        $('.ml6 .letters').each(function () {
            $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
        });
        anime.timeline({loop: true})
            .add({
                targets: '.ml6 .letter',
                translateY: ["1.1em", 0],
                translateZ: 0,
                duration: 750,
                delay: function (el, i) {
                    return 50 * i;
                }
            }).add({
            targets: '.ml6',
            opacity: 0,
            duration: 1000,
            easing: "easeOutExpo",
            delay: 1000
        });
        $.get(HOME_LIST_URL, function (data, status) {
            vue.count = data['count'];
            vue.videos = data['videos'];
            setTimeout(function () {
                $('#id_home_slider').flexslider();
            }, 100);
        })
    },
    methods: {
        select_video: function (id) {
            router.push({name: 'video_detail', params: {id: id}})
        },
        full_image_url: function (url) {
            return URL_PREFIX + url;
        }
    }
};
var CategoryList = {
    template: '#id_category_list',
    props: ['category_list'],
    data: function () {
        return {
            active_name: '全部'
        }
    },
    methods: {
        select: function (name) {
            this.active_name = name;
            App.active_list = name;
            load_search_result();
        }
    },
    beforeRouteEnter: function (to, from, next) {
        console.log('category before route enter');
        next(function () {
            load_category_list(to.params.main_category);
        });
    }
};
var CategoryAdvanced = {
    template: '#id_category_advanced',
    props: ['category_year', 'category_region'],
    data: function () {
        return {
            active_year: '全部',
            active_region: '全部'
        }
    },
    methods: {
        select_year: function (name) {
            this.active_year = name;
            App.active_year = name;
            load_search_result();
        },
        select_region: function (name) {
            this.active_region = name;
            App.active_region = name;
            load_search_result();
        }
    },
    mounted: function () {
    },
    beforeRouteEnter: function (to, from, next) {
        console.log('category advanced before route enter');
        next(function () {
            load_category_year(to.params.main_category);
            load_category_region(to.params.main_category);
        });
    }
};

var VideoListData = {
    videos: [],
    cur_page: 1,
    num_pages: 0,
    count: 0,
    search_word: ''
};
var VideoList = {
    template: '#id_video_list',
    props: [],
    components: {
        'video-item': VideoItem
    },
    data: function () {
        return VideoListData;
    },
    mounted: function () {
        console.log('Video List Created');
        var _video_list = this;
        Bus.$on('resetInfinite', function (search_word) {
            _video_list.search_word = search_word;
            _video_list.resetInfinite(_video_list);
        })
    },
    beforeDestroy: function () {
        console.log('video list before destroy')
    },
    methods: {
        infiniteHandler: function ($state) {
            var vue = this;
            // if(vue.num_pages === 0){
            //     $state.complete();
            //     return null;
            // }
            var context = {
                'page': vue.cur_page,
                'main_category': router.currentRoute.params.main_category,
                'category': App.active_list,
                'year': App.active_year,
                'region': App.active_region,
                'search': vue.search_word
            };
            console.log(context);
            $.get(VIDEO_LIST_URL, context, function (data, status) {
                vue.count = data['count'];
                vue.cur_page = data['cur_page'];
                vue.num_pages = data['num_pages'];
                $.each(data['results'], function (index, value) {
                    vue.videos.push(value);
                });
                if (vue.cur_page === vue.num_pages) {
                    $state.complete();
                } else {
                    console.log('cur_page=' + vue.cur_page);
                    $state.loaded();
                    vue.cur_page++;
                }
            });
        },
        resetInfinite: function (object) {
            var _video_list = object;
            _video_list.videos = [];
            _video_list.cur_page = 1;
            _video_list.num_pages = 1;
            _video_list.$nextTick(function () {
                console.log('Reset Video Gallery');
                _video_list.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            });
        }
    },
    beforeRouteUpdate: function (to, from, next) {
        console.log('video list reused!');
        load_category_info(to.params.main_category);
        load_search_result();
        next();
    }
};
var VideoContainer = {
    template: '#id_detail',
    props: ['video'],
    data: function () {
        return {
            active_name: '-1'
        }
    },
    computed: {},
    methods: {
        load_video: function (video_url) {
            create_video(video_url);
        },
        select: function (name) {
            this.active_name = name;
        },
        change_description: function (video) {
            this.video.description = video.description;
        }
    },
    mounted: function () {
        console.log('video detail mounted');
        if (router.currentRoute.name === 'video_detail') {
            load_video_detail(router.currentRoute.params.id);
        }
    },
    updated: function () {
        console.log('video detail updated');
    }
};
/* 搜索框 */
var SearchForm = {
    template: '#id_search_form',
    props: [],
    data: function () {
        return {
            search_word: ''
        }
    },
    methods: {
        onSubmit: function () {
            Bus.$emit('resetInfinite', this.search_word);
        }
    }
};

/* 路由 */
var router = new VueRouter({
    mode: 'hash',
    base: window.location.href,
    linkActiveClass: 'am-active',
    routes: [
        {
            path: '/',
            components: {
                default: HomeView
            },
            props: {
                default: true
            }
        },
        {
            path: '/vod/:id',
            name: 'video_detail',
            components: {
                video_detail: VideoContainer
            },
            props: {
                video_detail: true
            }
        },
        {
            path: '/list/:main_category',
            components: {
                search_form: SearchForm,
                category_list: CategoryList,
                category_advanced: CategoryAdvanced,
                video_list: VideoList
            },
            props: {
                category_list: true,
                category_advanced: true,
                video_list: true
            },
            beforeEnter: function (to, from, next) {
                console.log('router beforeEnter');
                next();
            }
        }
    ]
});
router.afterEach(function (to) {
    destroy_video();
});
var Bus = new Vue();
var App = new Vue({
    el: '#id_app',
    router: router,
    data: {
        main_categories: [],
        active_name: '',
        active_list: '全部',
        active_year: '全部',
        active_region: '全部',
        category_list: [],
        category_year: [],
        category_region: [],
        video: {}
    }
});
// router.beforeEach(function (to, from, next) {
//     // load_category_info(to.params.main_category);
//     // load_search_result();
//     // next();
//     load_category_info(to.params.main_category);
//     // load_search_result();
//     console.log('success');
//     next();
// });

function load_category_main() {
    var first = true;
    $.each(CategoryListData, function (key, value) {
        if (first) {
            App.active_name = key;
            first = false;
        }
        App.main_categories.push({name: key});
    });
    load_category_info(router.currentRoute.params.main_category);
}

function load_category_info(main_category) {
    load_category_list(main_category);
    load_category_year(main_category);
    load_category_region(main_category);
}

function load_category_list(active_name) {
    App.category_list = [
        {name: '全部'}
    ];
    if (!CategoryListData) return;
    $.each(CategoryListData[active_name], function (index, item) {
        App.category_list.push(item);
    });
}

function load_category_year(name) {
    var context = {'category': name};
    $.get(YEAR_URL, context, function (data, status) {
        App.category_year = [
            {name: '全部'}
        ];
        $.each(data, function (index, value) {
            App.category_year.push({name: value});
        });
    })
}

function load_category_region(name) {
    var context = {'category': name};
    $.get(REGION_URL, context, function (data, status) {
        App.category_region = [
            {name: '全部'}
        ];
        $.each(data, function (index, value) {
            App.category_region.push(value);
        });
        App.active_region = '全部';
    })
}

function load_search_result() {
    Bus.$emit('resetInfinite');
}

function load_video_detail(id) {
    var url = VIDEO_DETAIL_URL + id;
    $.get(url, function (data, status) {
        App.video = data;
        create_video(App.video.video);
    });
}

function destroy_video() {
    if (myPlayer) {
        myPlayer.video.src = '';
        // myPlayer.destroy();
        myPlayer = null;
    }
}

function create_video(video_url) {
    destroy_video();
    myPlayer = new DPlayer({
        container: document.getElementById('id_video_container'),
        screenshot: true,
        video: {
            url: video_url
        }
    });
}

function load_category() {
// $.get(CATEGORY_URL, {format: 'json'}, function (data, status) {
//     // alert('Get Data Done!'+data);
//     CategoryListData = data;
//     // load_category_year();
//     $('#my-modal-loading').modal('close');
//     load_category_main();
// });
    $.ajax({
        url: CATEGORY_URL,
        data: {format: 'json'},
        timeout: 5000,
        success: function (data, status) {
            // alert('Get Data Done!'+data);
            CategoryListData = data;
            // load_category_year();
            $('#my-modal-loading').modal('close');
            load_category_main();
        },
        error: function () {
            load_category();
        }
    });
}

(function () {
    $('#my-modal-loading').modal();
    $('#id_admin_btn').click(function () {
        window.location.href = ADMIN_SITE;
    });
    load_category();
})();
