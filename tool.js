//常用工具
(function(win) {
  var tool=(function() {
    // 判断对象类型需要的变量
    var typeArray=["Boolean","Number","String","Function","Array","Date",
                   "RegExp","Object","Error"];
    var classType=[];
     typeArray.forEach(function(cur,index) {
        classType["[object "+cur+"]"]=cur.toLowerCase();
     });
   
    
    /**
     * @desc 判断是否是window
     * @DateTime 2018-07-10
     * @param    {}   obj 
     * @return   {Boolean}     
     */
    function isWindow(obj) {
       // 除了undefined或者null 之外的类型才能通过第一个判断
       return obj!=null &&obj===obj.window;
    }

    /**
     * @desc 判断什么类型的包括所有类型的
     * @desc 基本类型和object都可以
     * @DateTime 2018-07-10
     * @param    {obj}   obj 
     * @return   {String}       统一返回字符串类型
     */
    function type(obj) {
        // if is  undefined or null
        if(obj==null) {
            return String(obj);
        }
        // if is object 返回相应小写的类型，否则基本类型用typeof,
        // function 也用typeof
        
        // 更简便方法{}.toString.call(obj).slice(7,-1).toLowerCase()
        return typeof obj==="object"?classType[{}.toString.call(obj)]:
               typeof obj;
    }
    
    /**
     * @desc 判断是否是{}或者new Object这样的对象
     * @DateTime 2018-07-10
     * @param    {[type]}   obj [description]
     * @return   {Boolean}      [description]
     */
    function isPlainObj(obj) {
       // 基本类型 或者dom节点或者window
      if(type(obj)!=='object'||obj.nodeType||isWindow(obj)) {
        return false;
      }
      
      // window.location或者 [1,23]这种
      // 只有Object.prototype有isPrototypeOf属性，其他的原型没有
      if(obj.constructor&&!{}.hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf")) {
        return false;
      }
      // {} or new Object() 这种对象
      return true;
    }

    /**
     * @desc 是否是空对象
     * @DateTime 2018-07-10
     * @param    {[type]}   obj [description]
     * @return   {Boolean}      [description]
     */
    function isEmptyObj(obj) {
     for(var attr in obj) { // 对象原型默认的属性方法遍历不到，除非
                            // 自己在对象原型上 添加属性或方法
        return false;
     }
     return true;
   }  
    // 暴露接口
    return {
      isWindow:isWindow,
      type:type,
      isPlainObj:isPlainObj,
      isEmptyObj:isEmptyObj
    };
  })();

  
  
  win.tool=tool;
})(window||{});
