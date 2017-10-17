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
        video: {},
        active_name:''
    },
    methods:{
        load_video:function (video_url) {
            create_video(video_url);
        },
        select: function (name) {
            this.active_name = name;
        }
    }
});
function create_video_detail_html() {
    return "<video id='id_video_js' class='video-js'></video>"
}
function create_video(video_url) {
    // myPlayer = videojs('id_video_js',{},function () {
    //     alert('setup videojs');
    // });

    if (myPlayer) {
        myPlayer.pause();
        setTimeout(function() {
            myPlayer.dispose();
            myPlayer = null;
        }, 0);
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
        src: video_url,
        type: 'video/mp4',
        withCredentials: false
    });
}

/* 视频数据加载函数 */
/*
{
    "title": "2",
    "image": "http://localhost:8000/media/hhy/Gift-Box.png",
    "video": "http://localhost:8000/media/hhy/Try%20AngularJS%201.5%20-%202%20of%2033%20-%20Front%20End%20vs%20Backend.mp4",
    "category": "动作片",
    "description": "sdfsf",
    "definition": "SD",
    "video_list": [
    {
        "title": "Try AngularJS 1.5 - 6 of 33 -  Setup Project Folder",
        "description": "sfgsa",
        "video": "http://localhost:8000/media/hhy/Try%20AngularJS%201.5%20-%206%20of%2033%20-%20%20Setup%20Project%20Folder.mp4"
    },
    {
        "title": "2",
        "description": "sdfsf",
        "video": "http://localhost:8000/media/hhy/Try%20AngularJS%201.5%20-%202%20of%2033%20-%20Front%20End%20vs%20Backend.mp4"
    }
]
}
*/
function load_video_detail(id) {
    window.location.hash = id;
    show_detail_view();
    var url = VIDEO_DETAIL_URL + id;
    $.get(url, function (data, status) {
        VideoDetail.video = data;
        create_video(VideoDetail.video.video);
    });
}