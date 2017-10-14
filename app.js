/**
 * Created by hhy on 2017/10/14.
 */
'use strict';
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
function click_category_btn() {
    $(this).addClass('am-btn-primary').siblings().removeClass('am-btn-primary');
}

function click_time_btn() {
    $(this).addClass('am-btn-primary').siblings().removeClass('am-btn-primary');
}

function click_region_btn() {
    $(this).addClass('am-btn-primary').siblings().removeClass('am-btn-primary');
}

/* 按钮点击事件 结束 */
$(function () {
    $(".m-category-list button").click(click_category_btn);
    $(".m-time-list button").click(click_time_btn);
    $(".m-region-list button").click(click_region_btn);
});
