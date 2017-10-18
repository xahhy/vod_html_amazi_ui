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
const DEFAULT_SELECT_DATA = {
    category: '全部',
    year: '全部',
    region: '全部'
};
var CategoryListData;
var myPlayer;
var curData = DEFAULT_SELECT_DATA;
/* Vue对象 */
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
        }
    }
};
var CategoryAdvanced = {
    template: '#id_category_advanced',
    props: ['category_year', 'category_region'],
    data: function () {
        return {
            active_name: '全部'
        }
    },
    methods: {
        select: function (name) {
            this.active_name = name;
            App.active_year = name;
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
            path: '/:main_category',
            components: {
                default: CategoryList,
                category_advanced: CategoryAdvanced
            },
            props: {
                default: true,
                category_advanced: true
            }
        }
    ]
});
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
        search_word: ''
    }
});
router.beforeEach(function (to, from, next) {
    // console.log('router change');
    // load_category_list(to.params.main_category);
    next();
});

function load_category_main() {
    var first = true;
    $.each(CategoryListData, function (key, value) {
        if (first) {
            App.active_name = key;
            first = false;
        }
        App.main_categories.push({name: key});
    });
    load_category_list(router.currentRoute.params.main_category)
}
function load_category_list(active_name) {
    App.category_list = [
        {name: '全部'}
    ];
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
// function load_category_region(name) {
//     var context = {'category': name};
//     $.get(REGION_URL, context, function (data, status) {
//         CategoryRegion.categories = [
//             {name: '全部'}
//         ];
//         $.each(data, function (index, value) {
//             CategoryRegion.categories.push(value);
//         });
//         CategoryRegion.active_name = '全部';
//     })
// }
$(function () {
    //InitPage();
    $.get(CATEGORY_URL, {}, function (data, status) {
        CategoryListData = data;
        // load_category_year();
        load_category_main();
    });
});
