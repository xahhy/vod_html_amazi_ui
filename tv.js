/**
 * Created by hhy on 2017/10/17.
 */
var TVSelect = Vue.component('v-select', VueSelect.VueSelect);
// TVSelect.options.props.value.default = '全部';
var TVChannel = new Vue({
    el: '#id_channel_select',
    data:{
        options:[],
        selected:'全部'
    },
    methods:{
        select_channel: function (data) {
            alert(data);
        }
    }
});
var TVCategory = new Vue({
    el: '#id_category_select',
    data:{
        options:[],
        selected:'全部'
    },
    methods:{
        select_category: function (data) {
            alert(data);
        }
    }
});
$.get(URL_PREFIX+'/tv/api/channels',function(data, status){
    TVChannel.options.push({channel_id:'全部', channel_name:'全部'});
    TVChannel.options = TVChannel.options.concat(data);
});
$.get(URL_PREFIX+'/tv/api/channels',function(data, status){
    TVCategory.options.push({channel_id:'全部', channel_name:'全部'});
    TVCategory.options = TVCategory.options.concat(data);
});