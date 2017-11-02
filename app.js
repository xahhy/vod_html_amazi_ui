/**
 * Created by hhy on 2017/10/14.
 */
'use strict';
/* 全局变量 开始*/
const URL_PREFIX = 'http://localhost:8888';
const CATEGORY_URL = URL_PREFIX + '/vod/api/category';
const YEAR_URL = URL_PREFIX + '/vod/api/year';
const REGION_URL = URL_PREFIX + '/vod/api/region';
const VIDEO_LIST_URL = URL_PREFIX + '/vod/api';
const VIDEO_DETAIL_URL = URL_PREFIX + '/vod/api/';
const ADMIN_SITE = URL_PREFIX + '/admin';
var CategoryListData;
var myPlayer;
/* Vue对象 */

var Category = new Vue({
    el: '#id_category_list',
    data: {
        categories: [
            {name: '全部'}
        ],
        active_name: ''
    },
    methods: {
        select: function (name) {
            this.active_name = name;
            load_search_result();
        }
    }
});
var CategoryMain = new Vue({
    el: '#id_category_main',
    data: {
        categories: [],
        active_name: ''
    },
    methods: {
        select: function (name) {
            this.active_name = name;
            load_category_region(name);
            load_category_time(name);
            load_category_list();
            load_search_result();
        },
        gen_hash: function (name) {
            return '#' + name;
        }
    }
});
var CategoryYear = new Vue({
    el: '#id_category_time',
    data: {
        categories: [
            {name: '全部'}
        ],
        active_name: ''
    },
    methods: {
        select: function (name) {
            this.active_name = name;
            load_search_result();
        }
    }
});
var CategoryRegion = new Vue({
    el: '#id_category_region',
    data: {
        categories: [
            {name: '全部'}
        ],
        active_name: ''
    },
    methods: {
        select: function (name) {
            this.active_name = name;
            load_search_result();

        }
    }
});
var VideoItem = Vue.component('video-item', {
    name:'video_item',
    template: '#id_video_item_tpl',
    props: ['video'],
    computed: {
        full_image_url: function () {
            return URL_PREFIX + this.video.image;
        }
    },
    methods:{
        select: function (id) {
            load_video_detail(id);
        }
    }

});
var VideoGallery = new Vue({
    el: '#id_video_gallery',
    data: {
        videos: [],
        cur_page: 1,
        num_pages: 0
    },
    methods: {
        infiniteHandler: function ($state) {
            //$state.complete();$state.loaded();
            var vue = this;
            if(vue.num_pages === 0)return null;
            var context = {
                'page': vue.cur_page,
                'main_category': CategoryMain.active_name,
                'category': Category.active_name,
                'year': CategoryYear.active_name,
                'region': CategoryRegion.active_name,
                'search': VideoSearch.search_word
            };
            console.log(context);
            $.get(VIDEO_LIST_URL, context, function (data, status) {
                VideoGalleryHeader.count = data['count'];
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
        }
    }
});
var VideoGalleryHeader = new Vue({
    el: '#id_video_gallery_header',
    data:{
        count:0
    }
});

/* 全局变量 结束*/

/* 加载函数 开始 */
function load_search_result() {
    show_list_view();
    VideoGallery.videos = [];
    VideoGallery.cur_page = 1;
    VideoGallery.num_pages = 1;
    VideoGallery.$nextTick(() => {
        console.log('Reset Video Gallery');
        VideoGallery.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
    });
}
function load_category_list() {
    Category.categories = [
        {name: '全部'}
    ];
    $.each(CategoryListData[CategoryMain.active_name], function (index, item) {
        Category.categories.push(item);
    });
    Category.active_name = '全部';
}
function load_category_main() {
    var first_index = 0;
    $.each(CategoryListData, function (key, value) {
        CategoryMain.categories.push({name: key});
        if (first_index === 0) {
            first_index++;
            CategoryMain.active_name = key;
        }
    });
}
function load_category_time(name) {
    var context = {'category': name};
    $.get(YEAR_URL, context, function (data, status) {
        CategoryYear.categories = [
            {name: '全部'}
        ];
        $.each(data, function (index, value) {
            CategoryYear.categories.push({name: value});
        });
        CategoryYear.active_name = '全部';
    })
}
function load_category_region(name) {
    var context = {'category': name};
    $.get(REGION_URL, context, function (data, status) {
        CategoryRegion.categories = [
            {name: '全部'}
        ];
        $.each(data, function (index, value) {
            CategoryRegion.categories.push(value);
        });
        CategoryRegion.active_name = '全部';
    })
}

/*
 {
 "count": 25,
 "next": "http://127.0.0.1:8000/api/?page=2",
 "previous": null,
 "cur_page": 1,
 "num_pages": 3,
 "page_range": [
 1,
 2,
 3
 ],
 "year": null,
 "results": [
 {
 "id": 36,
 "title": "Django-vod批量上传",
 "image": "/media/hhy/browser-icon-chrome.png.200x300_q85_crop.png",
 "category": "言情片  (level 2)",
 "definition": "SD",
 "duration": null,
 "slug": "django-vodpi-liang-shang-chuan-24"
 },
 {
 "id": 35,
 "title": "Django-vod批量上传",
 "image": "/media/hhy/browser-icon-chrome.png.200x300_q85_crop.png",
 "category": "言情片  (level 2)",
 "definition": "SD",
 "duration": null,
 "slug": "django-vodpi-liang-shang-chuan-23"
 }
 ]
 }
 */
function load_video_list() {
    $.get(VIDEO_LIST_URL, function (data, status) {
        $.each(data['results'], function (index, value) {
            VideoGallery.videos.push(value);
        })
    })
}
/* 加载函数 结束 */
/* 额外方法 开始 */
function show_list_view() {
    // myPlayer.pause();
    // myPlayer.dispose();
    if (myPlayer) {
        myPlayer.pause();
        setTimeout(function() {
            myPlayer.dispose();
            myPlayer = null;
        }, 0);
    }
    $('#id_list').show();
    $('#id_detail').hide();

}
function show_detail_view() {
    $('#id_list').hide();
    $('#id_detail').show();

}
/* 额外方法 结束 */

//获得当前分类按钮上的文字
function get_current_category_btn() {
    $('.m-category-list button .am-btn-primary').text()
}
//获得当前时间按钮上的文字
function get_current_time_btn() {
    $('.m-category-list button .am-btn-primary').text()
}
//获得当前地区按钮上的文字
function get_current_region_btn() {
    $('.m-category-list button .am-btn-primary').text()
}

/* 按钮点击事件 开始 */

/* 按钮点击事件 结束 */

/* 初始化页面，获取初始数据 开始 */

function InitPage() {
    var hash = window.location.hash;
    $.get(CATEGORY_URL, {}, function (data, status) {
        CategoryListData = data;
        load_category_main();
        hash = hash.substring(1);
        if($.isNumeric(hash)){
            load_video_detail(hash);
        }
        else if (hash !== ''){
            CategoryMain.active_name = hash;
            CategoryMain.select(CategoryMain.active_name);
        }
        else{
            CategoryMain.select(CategoryMain.active_name);
        }
        // $('#id_category_list').find(':first-child').click();
    })
}


/* 初始化页面，获取初始数据 结束 */


$(function () {
    $('#id_admin_btn').click(function(){
        window.location.href = ADMIN_SITE;
    })
    InitPage();


});
