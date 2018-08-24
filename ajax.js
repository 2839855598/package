(function() {
    var defaultOptions={
        url:'',
        type:'get',
        dataType:'json',
        data:null,
        success:false,
        fail:false
    };
    var getPara=function(data) {
       var result='';
       for(var attr in data) {
        result+=attr+'='+data[attr]+'&';
       }
       // 把最后多余的&截取掉 
       return result.slice(0,-1);
       // name=jac&age=20
    }

    var ajax=function(options){
        // undefined or null or not object
        if(options == null || typeof options!=='object') {
            return false;
        }
        // 参数修改
        for(var attr in defaultOptions) {
            options[attr]=options[attr]||defaultOptions[attr];
        }

        // http对象
        var xhr;
        if(window.XMLHttpRequest) {
            xhr=new XMLHttpRequest();
        } else {
            xhr=new ActiveXObject();
        }
        
        // url,type,data处理
        var url=options.url;
        options.data=getPara(options.data);

        if(options.type.toLowerCase() === 'get') {
            url+='?'+options.data;
            options.data=null;
        }
       
        xhr.open(options.type,url);

        // 监听
        xhr.onreadystatechange=function() {
            // 响应主体内容返回客户端，即后台处理完了数据
            if(xhr.readyState===4) {
               if(/^2\d{2}$/.test(xhr.status)) {

                 var result=null;
                 // 获取响应头Content-type  字符串类型
                 var grh=xhr.getResponseHeader('Content-Type');

                 // 根据类型解析
                 // json类型
                 if(grh.indexOf('json') !== -1) {
                    // 转为js对象
                    result=toJson(xhr.responseText);
                 } else if(grh.indexOf('xml') !== -1) {

                    result=xhr.responseXML;

                 } else {
                    result=xhr.responseText;
                 }
                 // success回调函数
                 ajaxSuccess(result);
                 // 失败
               } else {
                 ajaxFail(result); 
               }
            }
        }
        // post
        if(options.type.toLowerCase()==='post') {
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencode');

        }    
        // 发送请求
        xhr.send(options.data);
        
        function toJson(obj) {
            return window.JSON?JSON.parse(obj):eval('('+obj+')');
        }
        function ajaxSuccess(data) {
            var status='success';
            options.success&&options.success(data,options,status,xhr);
        }
        function ajaxFail(data) {
            var status='fail';
            options.fail&&options.fail(data,options,status,xhr);
        }
    }
    window.ajax=ajax;
})();