/**
 * Created by hhy on 2017/10/17.
 */
var VideoSearch = new Vue({
    el: '#id_search_form',
    data:{
      search_word:''
    },
    methods:{
        onSubmit:function () {
            load_search_result();
        }
    }
});