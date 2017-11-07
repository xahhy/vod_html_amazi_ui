/**
 * Created by hhy on 2017/10/14.
 */
'use strict';
/* 全局变量 开始*/
const URL_PREFIX = 'http://192.168.0.145:8000';
const CATEGORY_URL = URL_PREFIX + '/vod/api/category';
const YEAR_URL = URL_PREFIX + '/vod/api/year';
const REGION_URL = URL_PREFIX + '/vod/api/region';
const VIDEO_LIST_URL = URL_PREFIX + '/vod/api';
const VIDEO_DETAIL_URL = URL_PREFIX + '/vod/api/';
const ADMIN_SITE = URL_PREFIX + '/admin';
const TV_LIST_URL = URL_PREFIX + '/vod/api/record';
const TV_DETAIL_URL = URL_PREFIX + '/vod/api/record/';

const DEFAULT_SELECT_DATA = {
    category: '全部',
    year: '全部',
    region: '全部'
};
var CategoryListData;
var IScroll = $.AMUI.iScroll;
var myPlayer;
var curData = DEFAULT_SELECT_DATA;
/* Vue对象 */
Vue.component('v-select', VueSelect.VueSelect);
var HomeView = {
    name: 'Home',
    template: '<div>Home</div>'
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
    beforeRouteEnter:function (to, from, next) {
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
    mounted:function () {
    },
    beforeRouteEnter:function (to, from, next) {
        console.log('category advanced before route enter');
        next(function () {
            load_category_year(to.params.main_category);
            load_category_region(to.params.main_category);
        });
    }
};
var VideoItem = {
    template: '#id_video_item',
    props: ['video'],
    computed: {
        full_image_url: function () {
            return URL_PREFIX + this.video.image;
        }
    },
    methods:{
        selectVideo:function (id) {
            router.push({path: `/vod/${id}`});
            console.log('select video '+id)
        }
    }
};
var VideoListData = {
    videos:[],
    cur_page: 1,
    num_pages: 0,
    count:0
};
var VideoList = {
    template: '#id_video_list',
    props: [],
    components:{
        'video-item':VideoItem
    },
    data:function () {
        return VideoListData;
    },
    mounted:function () {
        console.log('Video List Created');
        var _video_list = this;
        Bus.$on('resetInfinite', function () {
            _video_list.resetInfinite(_video_list);
        })
    },
    beforeDestroy:function () {
      console.log('video list before destroy')
    },
    methods:{
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
                'search': App.search_word
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
            _video_list.$nextTick(function(){
                console.log('Reset Video Gallery');
                _video_list.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            });
        }
    },
    beforeRouteUpdate:function (to, from, next) {
        console.log('video list reused!');
        load_category_info(to.params.main_category);
        load_search_result();
        next();
    }
};
var VideoContainer = {
    template: '#id_detail',
    props : ['video'],
    data:function () {
        return {
            active_name:''
        }
    },
    computed:{
    },
    methods:{
        load_video: function (video_url) {
            create_video(video_url);
        },
        select: function (name) {
            this.active_name = name;
        },
        change_description: function(video) {
            this.video.description = video.description;
        }
    },
    mounted:function () {
        console.log('video detail mounted');
        if(router.currentRoute.name === 'video_detail'){
            load_video_detail(router.currentRoute.params.id);
        }else if (router.currentRoute.name ==='tv_detail') {
            load_tv_detail(router.currentRoute.params.id);
        }
    },
    updated:function () {
      console.log('video detail updated');
    }
};
// -------------------------------TV---------------------------------------
var TVCategory = {
    template: '#id_tv',
    methods:{
        select_channel: function (data) {
            console.log(data.channel_id);
        }
    },
    data:function () {
        return {
            options:[{channel_id:null,channel_name:'全部'}],
            selected:{channel_id:null,channel_name:'全部'}
        }
    },
    mounted:function () {
        console.log('TV Category mounted');
        var _tv_category = this;
        $.get(URL_PREFIX+'/tv/api/channels',function(data, status){
            _tv_category.options=[{channel_id:'全部', channel_name:'全部'}];
            _tv_category.options = _tv_category.options.concat(data);
        });
    }
};
var TVItem = {
    template: '#id_tv_item',
    props: ['video'],
    computed: {
    },
    methods:{
        selectVideo:function (id) {
            router.push({path: `/tv/${id}`});
            console.log('select tv '+id)
        }
    }
};
var TVListData = {
    videos:[],
    cur_page: 1,
    num_pages: 0,
    count:0
};
var TVList = {
    template: '#id_tv_list',
    props: [],
    components:{
        'tv-item':TVItem
    },
    data:function () {
        return TVListData;
    },
    mounted:function () {
        console.log('TV List Created');
        var _video_list = this;
        Bus.$on('resetInfiniteTV', function () {
            _video_list.resetInfiniteTV(_video_list);
        })
    },
    beforeDestroy:function () {
      console.log('video list before destroy')
    },
    methods:{
        infiniteHandler: function ($state) {
            var vue = this;
            var context = {
                'page': vue.cur_page,
                'search': App.search_word
            };
            console.log(context);
            $.get(TV_LIST_URL, context, function (data, status) {
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
        resetInfiniteTV: function (object) {
            var _video_list = object;
            _video_list.videos = [];
            _video_list.cur_page = 1;
            _video_list.num_pages = 1;
            _video_list.$nextTick(function(){
                console.log('Reset TV Gallery');
                _video_list.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            });
        }
    }
};
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
            path:'/vod/:id',
            name:'video_detail',
            components:{
                video_detail: VideoContainer
            },
            props:{
                video_detail:true
            }
        },
        {
            path: '/list/:main_category',
            components: {
                default: CategoryList,
                category_advanced: CategoryAdvanced,
                video_list: VideoList
            },
            props: {
                default: true,
                category_advanced: true,
                video_list: true
            },
            beforeEnter: function (to, from, next) {
                console.log('router beforeEnter');
                next();
            }
        },
        {
            path: '/tv',
            components:{
                tv_category: TVCategory,
                tv_list: TVList
            },
            props:{
                tv_category: true,
                tv_list: true
            }
        },
        {
            path:'/tv/:id',
            name:'tv_detail',
            components:{
                video_detail: VideoContainer
            },
            props:{
                video_detail:true
            }
        },

    ]
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
        search_word: '',
        video:{}
    },
    methods:{
        onSubmit:function () {

            load_search_result();
        }
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
    if(!CategoryListData)return;
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
function load_search_result(){
    Bus.$emit('resetInfinite');
}
function load_video_detail(id) {
    var url = VIDEO_DETAIL_URL + id;
    $.get(url, function (data, status) {
        App.video = data;
        create_video(App.video.video);
    });
}
function load_tv_detail(id) {
    var url = TV_DETAIL_URL + id;
    $.get(url, function (data, status) {
        App.video = data;
        create_video(App.video.url);
    });
}
function create_video_detail_html() {
    return '<video id="id_video_js" class="video-js vjs-default-skin">' +
        '<p>该软件不支持播放视频,请使用Chrome或其他浏览器,谢谢</p>' +
        '</video>'
}
function create_video(video_url) {
    // myPlayer = videojs('id_video_js',{},function () {
    //     alert('setup videojs');
    // });

    // if (myPlayer) {
    //     myPlayer.pause();
    //     setTimeout(function() {
    //         myPlayer.dispose();
    //         myPlayer = null;
    //     }, 0);
    // }
    $('#id_video_container').html(create_video_detail_html());
    myPlayer = videojs(document.getElementById('id_video_js'), {
        controls: true,
        autoplay: false,
        preload: 'auto',
        fluid: true,
        techOrder:['html5', 'flash']
        // flash: {
        //     hls: {
        //         withCredentials: false
        //     }
        // }
    }, function () {
        console.log('setup videojs');
    });
    myPlayer.pause();
    var src = {
        src: video_url,
        type: 'video/mp4',
        withCredentials: false
    };
    if (video_url.endsWith('m3u8')) {
      src.type = 'application/x-mpegURL';
      src.src = URL_PREFIX + '/media/record/' + src.src;
      console.log('m3u8 url is:'+src.src);
    }
    myPlayer.src(src);
    myPlayer.play();
}
(function () {
    $('#my-modal-loading').modal();
    $('#id_admin_btn').click(function(){
        window.location.href = ADMIN_SITE;
    });
    $.get(CATEGORY_URL, {}, function (data, status) {
        CategoryListData = data;
        // load_category_year();
        $('#my-modal-loading').modal('close');
        load_category_main();
    });
})();