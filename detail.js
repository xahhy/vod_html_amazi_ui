/**
 * Created by hhy on 2017/10/16.
 */

/*
 {
 "title": "Django-vod批量上传",
 "image": "http://127.0.0.1:8000/media/hhy/browser-icon-chrome.png",
 "video": "http://127.0.0.1:8000/media/hhy/Django-vod%E6%89%B9%E9%87%8F%E4%B8%8A%E4%BC%A0.flv",
 "category": "言情片",
 "description": "The Django-vod批量上传 description",
 "definition": "SD"
 }
 */
var VideoDetail = new Vue({
    el: '#id_detail',
    data: {
        video: {}
    }
});
function create_video_detail_html() {
    return "<video id='id_video_js' class='video-js'></video>"
}
function create_video() {
    // myPlayer = videojs('id_video_js',{},function () {
    //     alert('setup videojs');
    // });

    if (myPlayer) {
        myPlayer.dispose();
        myPlayer = null;
    }
    $('#id_video_container').html(create_video_detail_html());
    myPlayer = videojs(document.getElementById('id_video_js'), {
        controls: true,
        autoplay: false,
        preload: 'auto',
        width: '100%',
        height: '100%'
    }, function () {
        console.log('setup videojs');
    });
    myPlayer.pause();
    myPlayer.src({
        src: VideoDetail.video.video,
        type: 'video/mp4',
        withCredentials: false
    });
    //myPlayer.load();
    // myPlayer.play();
}
function load_video_detail(id) {
    window.location.hash = id;
    show_detail_view();
    var url = VIDEO_DETAIL_URL + id;
    $.get(url, function (data, status) {
        VideoDetail.video = data;
        create_video();
    });

}