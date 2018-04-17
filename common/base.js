
require('./base.less');

module.exports = {
    ajaxPost:function(obj, callback){
        $.ajax({
            url: obj.url,
            type: 'post',
            data : JSON.stringify(obj.data),
            cache : false,  // 防止浏览器缓存
            contentType:'application/json; charset=utf-8',
            success:function(result){
                callback && callback(result)
            },
            error:function(result){
                callback && callback(result)
            }
        })
    },
    ajaxGet:function(obj, callback){
        $.ajax({
            url: obj.url,
            type: 'get',
            data : obj.data || data,
            cache : false,  // 防止浏览器缓存
            success:function(result){
                callback && callback(result)
            },
            error:function(result){
                callback && callback(result)
            }
        })
    }
}