// 事件封装

(function(win) {
  var ev={
      // 事件兼容系列
      // 分为 IE8及其以下 和其他浏览器
      /**
       * @Author   xjc
       * @desc  获取事件
       * @DateTime 2018-04-20
       * @param    {object}   event 
       * @return   {object}      
       */
      getEvent:function(event) {
           // ie8及其以下是window.event
          event=event||window.event;
          return event;
      },

      /**
       * @desc  获取事件源目标
       * @DateTime 2018-04-20
       * @param    {object}   event 
       * @return   {HTML Element}     dom元素
       */
      getTarget:function(event) {
         var ev=this.getEvent(event);
         // ev.srcElement是IE 下的
         return ev.target||ev.srcElement;
      },
      
      /**
       * @desc  阻止默认事件
       * @DateTime 2018-04-20
       * @param    {object}   event 

       */
      preDefault:function(event) {
         var ev=this.getEvent(event);
          ev.preventDefault?ev.preventDefault():ev.returnValue=true;
      },

      /**
       * @desc  阻止冒泡
       * @DateTime 2018-04-20
       * @param    {[type]}   event [description]
       * @return   {[type]}         [description]
       */
      stopBubble:function(event) {
          var ev=this.getEvent(event);
         
          ev.stopPropagation?ev.stopPropagation():ev.cancelBubble=true;
      },
      
      /**
       * @Author   xjc
       * @desc   阻止冒泡+默认事件
       * @DateTime 2018-04-20
       * @return   {Boolean}   
       */
      preventAll:function() {
          return false;
      },
      
      /**
       * @desc   绑定事件
       * @DateTime 2018-04-20
       * @param    {HTML Element}   ele     
       * @param    {String}   type    'click'
       * @param    {Function}   handler function
       */
      addHandler:function(ele,type,handler) {
           // 其他浏览器
          if(ele.addEventListener) {

              addHandler=function(ele,type,handler) {
                 ele.addEventListener(type,handler,false);
              }
             // IE系列 
          } else if(ele.attachEvent) {
              addHandler=function(ele,type,handler) {
                 ele.attachEvent('on'+type,handler);
              }
          } else {
            addHandler=function(ele,type,handler) {
                 ele['on'+type]=handler;
              }
            
          }
         return addHandler(ele,type,handler);
      },
      
      /**
       * @desc   移除事件
       * @DateTime 2018-04-20 
       * @param    {HTML Element}   ele     
       * @param    {String}   type    'click'
       * @param    {Function}   handler function
       */
      removeHandler:function(ele,type,handler) {
          // 其他浏览器
          if(ele.removeEventListener) {

              addHandler=function(ele,type,handler) {
                 ele.removeEventListener(type,handler,false);
              }
             // IE系列 
          } else if(ele.detachEvent) {
              addHandler=function(ele,type,handler) {
                 ele.detachEvent('on'+type,handler);
              }
          } else {
            addHandler=function(ele,type,handler) {
                 ele['on'+type]=null;
              }
            
          }
         return addHandler(ele,type,handler);
      },
      

      /**
       * @desc  自定义事件绑定(需要主动触发)
       * @DateTime 2018-04-20
       * @param    {HTML Element||object}   obj    dom元素或者其他对象
       * @param    {String}   events 如'click','hide'
       * @param    {Function} fn    
       */
      bindEvent:function(obj,events,fn) {

            // obj相当于楼层，events相当于书架，fn相当于书
            // 所有对象都能绑定，需要主动触发（自定义事件）1
             obj.json=obj.json||{};
             obj.json[events]=obj.json[events]||[];

             obj.json[events].push(fn);
          

            // obj是dom对象的话,防止对象不是dom节点没有addEvent方法报错
            // 当obj是dom对象且拥有事件如'click','mousedown'等时候才进行绑定
            if(obj.nodeType===1 && obj['on'+events]!==undefined) {
                    if(obj.addEventListener) {
                            console.log('show')
                            //dom节点才能绑定事件(dom事件) 
                                obj.addEventListener(events,fn,false);
              
                     } else if (obj.attachEvent) {

                                obj.attachEvent('on'+events,fn);
    
                     } else {                                              
                                obj['on'+events]=fn;
                     }   
            }

      },
      

      /**
       * @desc  主动触发存在 obj.json[events]里的事件
       * @desc 用法：ev.bindEvent(oBox,'hide',function(){alert(2)})
       *             ev.fineEvent(oBox,'hide')
       * @DateTime 2018-04-20
       * @param    {HTML Element||object}   obj    dom元素或者其他对象
       * @param    {String}   events  如'click','hide'
       */
      fireEvent:function(obj,events) {
           if(obj.json&&obj.json[events]) {
              for(var i=0,fn;fn=obj.json[events][i++];) {
                fn.apply(null,arguments);
              }
           }
      },
       

      /**
       * @desc  事件委托
       * @desc 用法： ev.proxy(oParent,'click',dog);
       * @DateTime 2018-04-20
       * @param    {HTML Element}   oParent 委托的元素
       * @param    {String}   oParent 委托的事件
       * @param    {HTML Element}   target  目标元素
       */
       proxy:function(oParent,type,target) {
         var _self=this;
          _self.addHandler(oParent,type,function(event) {
               var ev=_self.getEvent(event);
               var curTarget=_self.getTarget(ev);
               if(curTarget.nodeName.toLowerCase()==target.nodeName.toLowerCase()) {
                   // 操作一些事情。。。不固定
                   target.style.background='red';
               }
          })
       },

       
       /**
        * @Author   xjc
        * @desc   拖拽封装
        * @DateTime 2018-04-20
        * @param    {HTML Element}   curEle 拖拽元素
        */
       drag:function(curEle) {
          var _self=this;
           curEle.onmousedown=function(event) {
               var ev=_self.getEvent(event),
                   disX=0,
                   disY=0;

               disX=ev.clientX-curEle.offsetLeft;  
               disY=ev.clientY-curEle.offsetTop;
               document.onmousemove=function(event) {
                 var ev=_self.getEvent(event),
                     oParent=curEle.parentNode,
                     oParentW=0,
                     oParentH=0,
                     left=0,
                     top=0,
                     maxL=0,
                     maxT=0;
                 
                 // 容器是body元素
                 if(oParent.nodeName.toLowerCase()==='body') {
                    oParentW=document.documentElement.clientWidth||
                             document.body.clientWidth;
                    oParentH=document.documentElement.clientHeight||
                             document.body.clientHeight;

                 // 容器是当前元素父级          
                 } else {
                    oParentW=oParent.offsetWidth;
                    oParentH=oParent.offsetHeight;  
                 }

                 // 可拖拽最大距离
                 maxL=oParentW-curEle.offsetWidth;
                 maxT=oParentH-curEle.offsetHeight;

                 // left,top
                 left=ev.clientX-disX;
                 top=ev.clientY-disY;

                 // 可拖拽的范围
                 left=Math.max(0,Math.min(left,maxL));
                 top=Math.max(0,Math.min(top,maxT));

                 // 移动
                 curEle.style.left=left+'px';
                 curEle.style.top=top+'px';
               }  
               document.onmouseup=function() {
                document.onmousemove=null;
                document.onmouseup=null;
               }
               // 解决火狐问题
               return false;
           }
       },
      
       /**
        * @desc  当前元素距离页面左侧距离
        * @desc offsetParent针对的是定位元素,
        * @DateTime 2018-04-20
        * @param    {HTML Element}   curEle 
        * @return   {Number}       offsetLeft之和
        */
       offLeft:function(curEle) {
          var left=0;
          while(curEle!==null) {
             left+=curEle.offsetLeft;
             curEle=curEle.offsetParent;
          }
          
          return left;
       },

       /**
        * @desc 当前元素距离页面顶部距离
        * @desc offsetParent针对的是定位元素
        * @DateTime 2018-04-20
        * @param    {HTML Element}   curEle 
        * @return   {Number}       offsetTop之和 
        */
       offTop:function(curEle) {
          var top=0;
          while(curEle!==null) {
             top+=curEle.offsetTop;
             curEle=curEle.offsetParent;
          }
          
          return top;
       }
      
  }
  win.ev=ev;
})(window||{})