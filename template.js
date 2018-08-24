(function(win) {
     
    // 获得对象 key的集合 ，兼容所有浏览器
    // support {} or []
    var keys=function(obj) {
      if(typeof obj !=='object') return [];

      if(Object.keys) return Object.keys(obj);

      // IE<9 
      var allKeys=[],
          attr;
      for( attr in obj) {
        if(hasOwnProperty.call(obj,attr)) {
          allKeys.push(attr);
        }
      }  
      return allKeys;  
    }

    // 用defaults对象填充ob中的undefined属性
    // 第二个为true，代表只给obj中undefined的添加属性，已存在的不会覆盖
    // 第二个为false，代表不仅给obj中unde的添加属性， 还会将已存在的给覆盖掉
    var createAssigner=function(keysFn,isUndefined) {
         return function(obj) {
           var length=arguments.length;

           if(length<2 || obj == null ) return null;
           // 从第二个参数开始
           for(var i=1;i<length;i++) {
             // source是 对象
              var source=arguments[i];

              var keys=keysFn(source);

              var  len=keys.length;

              for(var index=0;index<len;index++) {

                 var key=keys[index];

                 // 第二个参数为true，表示不覆盖 obj中原有属性
                 // 第二个参数为false，表示覆盖 obj中原有属性
                 if(!isUndefined || obj[key] === void 0) obj[key]=source[key];
              }
           }
          return obj;
         }
    }
    
    
    var defaults=createAssigner(keys,true);

    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
        };

    var createEscaper=function(map) {
        // 在正则里面是 匹配到的值
        var escaper=function(match) {
            return map[match];
        }

        var source='(?:'+keys(map).join('|')+')';
        var testReg=RegExp(source);
        var replaceReg=RegExp(source,"g");
        return function(str) {
           str= str == null ? '' : ''+str;
           // 
           return testReg.test(str) ? str.replace(replaceReg,escaper) : string;
        }
    };   
    
    // 转义HTML字符串，替换&, <, >, ", ', 和 / 字符     
    var escape = createEscaper(escapeMap);
    
    // 可以给tool传入一些方法供 模板引擎使用
    var tool={};
    tool.escape=escape;

    // 设置默认参数, 惰性模式 ，匹配最少
    var templateSettings={
        // 插入js代码
       evaluate : /<%([\s\S]+?)%>/g,
        // 求值
       interpolate : /<%=([\s\S]+?)%>/g, 
     
        // 插值并转义
       escape : /<%-([\s\S]+?)%>/g
    };


    // 防止没有默认参数，谢不谢无所谓
    var noMatch=/(.)^/;

    // 字符转义序列  
    var escapes= {
      "'": "'",
      "\\": "\\",
      "\r": "r",
      "\n": 'n',
      "\u2028": "u2028",
      "\u2029": "u2029"
    };

    // 正则
    var escaperReg=/\\|'|\r|\n|\u2028|\u2029/g;
    
    // 匹配到的项 \n => n 
    var escapeChar=function(match) {
        return '\\' + escapes[match];
      // 避免冲突
    }


    // 模板引擎
    var module=function(text,settings) {
 
      // 如果有settings，把新的设置+ _temp设置拷贝给{}，
      // 否则，只拷贝_.temp给{}
      settings=defaults({},settings,templateSettings);
      
      // settings.evalute.source => <%([\s\S]+?)%>
      // /<%([\s\S]+?)%>|<%=([\s\s]+?)%>|<%-([\s\s]+?)%>|$/g
      // 一定要有个 $,因为如果匹配完之后，就无法匹配到 非正则 部分，所以保证匹配到最后
      var matcher=RegExp([(settings.escape||noMatch).source,
        (settings.interpolate||noMatch).source,
        (settings.evaluate||noMatch).source].join("|")+"|$","g");
      
      // 初始匹配位置为0
      var index=0;
      var source="p+='";
     
      // 几个括号就是几个子字符串 参数，offset是匹配到正则的index
      text.replace(matcher,function(match, escape, interpolate, evaluate, offset) {
        // 匹配到非正则部分，把html里面 字符 => 转义序列
        // 所以为了匹配到最后，所以加了 $,不加的话，匹配到最后一次正则后，
        // 后面的无法匹配到 \n => \\n
         source+=text.slice(index,offset).replace(escaperReg,escapeChar);
        
         // 设置下一次开始搜索的位置
         index=offset+match.length;
      
         
         // 需要求值并转义，存在的话就 转义_.escape(t)
         // ==null 防止数据不存在 报错
         if (escape) {
            source += "'+((t=" + escape + ")==null?'':tool.escape(t))+'";

         // 求值   <%=xxx%> 替换成 '+ xxx +'，
         // 相当于
         // var result = (t = interpolate) == null ? '' : __t;
         //
         // 如:  _.template("hello:<%=name%>")
         // p是以 ''相加的
         // 第一步： p+='
         // 第二步： p+='hello:
         // 第三步： p+='hello:'+((t=name)==null?'':t)+'
         // 第四步:  p+='hello:'+((t=name)==null?'':t)+'';
         // 最终：   p='hello:wanglihong';
          } else if (interpolate) {

            source += "'+((t=" + interpolate + ")==null?'':t)+'";
             console.log(source)
         // evaluate是js代码   
         // <%xxx%> 替换成 '; xxx p+='
          } else if (evaluate) {
            source += "';\n" + evaluate + "\np+='";
          }
        
         return match;  
      });
       source+="';\n";
       
      // 没设置对象作用域的话，默认作用域是数据对象
      // source 主体部分
      if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
    
      // 完整source部分，如果模板里面有 print("hello"+value),
      // 将会直接在 with(obj||{}) 里面直接执行函数
      source = "var t,p='',j=Array.prototype.join," +
             "print=function(){p+=j.call(arguments,'');};\n" +
              source + "return p;\n";
      
      // 防止 出错
      try {
        // 前两个是参数，最后一个是函数主体，都得是字符串
        var render=new Function(settings.variable||'obj','tool',source);
      } catch(e) {
         e.source=source;
         throw e;
      }
      
      // 每次传入数据直接调用这个方法，省的每次都要创建 new Function
      var template=function(data) {
         return render.call(this,data,tool);
      }
      
      // 方便查看 source内容
      var argument=settings.variable|| 'obj';
      template.source='function('+argument+'){\n'+source+'}';

      // 第一次调用返回模板，第二次调用传入数据
      return template;
     }

  win.module=module;
})(window||{});