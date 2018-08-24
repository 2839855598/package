//dom常用事件
(function(win) {
  var dom=(function() {
  	//addClass,removeClass,toggleClass,hasClass,都只能检测一个类名
  	//String中'first dom'这样是不行的，只能'first'这种的
  	
  	// true表示标准浏览器（IE9及其以上） false表示IE6-8
	var flag="getComputedStyle" in win;
  	

	
    
    
    // 类名的增删改查
  
    
    /**
     * @desc  支持单个或者多个类名
     * @DateTime 2018-04-15
     * @param    {HTML Element}   dom元素
     * @param    {String}  className
     * @return   {Boolean}   
     */
    function hasClass(ele,cls) {

      // 这种 var re=new RegExp('(^|\\s+)'+cls+'($|\\s+)'); 也可以
      var re=new RegExp('\\b'+cls+'\\b');
      return re.test(ele.className);
    }

    /**
     * @desc  只添加不存在的类名 支持单个或多个类名的增加
     * @DateTime 2018-04-15
     * @param    {HTML Element}   dom元素
     * @param    {String}  className
     */
    function addClass(ele,cls) {
      // 先去除首尾空格
      var arr=cls.replace(/^\s+|\s+$/g,"").split(/\s+/g);// 以单个或多个空格分割，加不加g无所谓

      for(var i=0,len=arr.length;i<len;i++) {
          var curCls=arr[i];
          if(!this.hasClass(ele,curCls)) {
             ele.className+=' '+cls;
          }
          
      }
    }

    /**
     * @desc 只删除存在的类名 支持单个或多个类名的删减
     * @DateTime 2018-04-15
     * @param    {HTML Element}   dom元素
     * @param    {String}  className
     */
    function removeClass(ele,cls) {
      // 先去除首尾空格
      var arr=cls.replace(/^\s+|\s+$/g,"").split(/\s+/g);// 以单个或多个空格分割，加不加g无所谓

      for(var i=0,len=arr.length;i<len;i++) {
          var re=new RegExp('\\b'+arr[i]+'\\b');
          var curCls=arr[i];
         if(this.hasClass(ele,curCls)) {
              // 去除单词
              ele.className=ele.className.replace(re,'');
               // 去除删掉开头或者结尾单词留下的 开头结尾空格
              ele.className=ele.className.replace(/^\s+|\s+$/g,'');
              // 去除中间的空格，把多个空格换成一个空格
              ele.className=ele.className.replace(/\b\s+\b/g,' ');
          }
      }
    }

    /**
     * @desc 把存在的删除，不存在的添加
     * @DateTime 2018-04-15
     * @param    {HTML Element}   dom元素
     * @param    {String}  className
     */
    function toggleClass(ele,cls) {
       // 先去除首尾空格
      var arr=cls.replace(/^\s+|\s+$/g,"").split(/\s+/g);// 以单个或多个空格分割，加不加g无所谓

       for(var i=0,len=arr.length;i<len;i++) {
          var re=new RegExp('\\b'+arr[i]+'\\b');
          var curCls=arr[i];
           // 下面这种太麻烦，不管类名在开头,中间还是结尾都是单词
           // 所以直接用上面的
           // var re=new RegExp('(^|\\s+)'+arr[i]+'($|\\s+)');
         
           // 不存在就添加，存在就删除
          if(!this.hasClass(ele,curCls)) {
             ele.className+=' '+curCls;
          } else {    
              // 用空格替换 re
              ele.className=ele.className.replace(re,' ');
              // 去除删掉开头或者结尾单词留下的 开头结尾空格
              ele.className=ele.className.replace(/^\s+|\s+$/g,'');
              // 去除中间的空格, 中间空格两边是边界\b
              ele.className=ele.className.replace(/\b\s+\b/g,' ');
                                          
          } 
       }
    }
    /**
     * @desc   获取某个dom对象下的含有1个或者多个className的dom对象
     *         惰性模式 不需要每次调用时候都要判断 浏览器类型
     * @DateTime 2018-04-17
     * @param    {String}   className
     * @param    {HTML Element}   dom 元素 
     * @return   {HTML Element}         dom对象
     */
    function getClassName(strClass,context) {
        var arrClass=strClass.split(' '),
            context=context||document,
           
            arr=[];
        
        //IE9+以及现代浏览器 ByClassName可以接受'one two '这样类名
        if(flag) {
           
             getClassName=function(strClass,context) {
     
                 // 把伪数组转为 真数组    
                return [].slice.call(context.getElementsByClassName(strClass));
             }
            
        } else {
            // IE6-8
           getClassName=function(strClass,context) {
 
                  var nodes=context.getElementsByTagName('*');

                  for(var i=0,len=nodes.length;i<len;i++) {
                      // 当前dom节点
                      var  curEle=nodes[i],
                          //  假设当前dom节点都含有多个className
                           flag=true;
                      for(var j=0,length=arrClass.length;j<length;j++) {
                          var re=new RegExp('\\b'+arrClass[i]+'\\b');

                          //下面这种太麻烦，不管类名在开头,中间还是结尾都是单词
                          //所以直接用上面的
                          //var re=new RegExp('(^|\\s+)'+arrClass[j]+'($|\\s+)');
                          if(!re.test(curEle.className)) {
                                flag=false;
                                // 只要有一个className不存在就跳出for循环 
                                // 开始下一个dom节点
                                break;
                          }
                      }
                      // 如果当前dom元素的className满足strClass的话
                      if(flag) {
                         arr.push(curEle);
                      }
                  }

                  return arr;
            }
     
        }
        return getClassName(strClass,context);
    }
    /**
     * @desc  伪数组转为真数组 (兼容IE6-8)
     * @DateTime 2018-04-18  
     * @param    {NodeList}   伪数组
     * @return   {Array}       数组
     */
    function toArray(arr) {
         arr=arr||[];
         
         // IE9+和其他浏览器
         if(flag) {
            return Array.prototype.slice.call(arr);
         } else {
           // IE6-8 不支持slice方法
            return Array.prototype.concat.apply([],arr);
         }
    }

    // dom节点的增删
    
    
    /**
     * @desc    获取某个元素的子元素，第二个参数可选，过滤特定元素
     * @desc    兼容所有浏览器
     * @desc    平常都用 oparent.getElementsByTagName('p') 这种方法，
     * @desc    getChildren2方法就是为了练习用的，没必要用
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle  dom元素
     * @param    {String}   tagName  标签名
     * @return   {Array}           包含dom元素的真数组
     */

    function getChildren(curEle,tag) {
         var arr=[];
         //IE9+和其他浏览器
         if(flag) {
           arr=[].slice.call(curEle.children);            
           
         } else {
         	var nodeList=curEle.childNodes;           
            for(var i=0,len=nodeList.length;i<len;i++) {
                 var curNode=nodeList[i];

                 curNode.nodeType===1?arr.push(curNode):null;
            }    
            // 回收
            nodeList=null;
         }

         // 如果有第二个参数的话
         if(typeof tag==='string') {
                    
                // 不能写成len=arr.length，因为arr.length是减少的
                // 这是个大坑，注意下
                for(var i=0;i<arr.length;i++) {
                     var ele=arr[i];
                 
                    if(ele.nodeName.toLowerCase() !==tag.toLowerCase()){

                          // 不是想要的标签，删掉，并重新从这个位置开始检测
                          arr.splice(i,1); 
                          i--;
                     }
                }
         }
         return arr;
    }   
    /**
     * @desc 获取上一个兄弟节点
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle dom元素
     * @return   {HTML Element}    dom元素
     */
    function getPreEle(curEle) {
           //IE9+和其他浏览器
          if(flag) {
                return curEle.previousElementSibling;
           } 
          // IE6-8
          var pre=curEle.previousSibling;
          while(pre && pre.nodeType!==1) {
              pre=pre.previousSibling;
          }
          return pre;
           
    }

    /**
     * @desc 获取下一个dom元素节点
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle dom元素
     * @return   {HTML Element}       dom元素
     */
    function getNextEle(curEle) {
           //IE9+和其他浏览器
           if(flag) {
               return curEle.nextElementSibling;
           } 
          // IE6-8 
           var next=curEle.nextSibling;
           while(next && next.nodeType!==1) {
              next=next.nextSibling;
           }
           return next;
           
    }

    /**
     * @desc  获取前面所有节点
     * @DateTime 2018-04-18
     * @param    {[type]}   curEle [description]
     * @return   {[type]}          [description]
     */
    function getPrevAll(curEle) {
        var arr=[];
        var prev=this.getPreEle(curEle);

        // 前面节点可能没有为null
        while(prev) {
           arr.unshift(prev);
           prev=this.getPreEle(prev);
        }
        return arr;
    }

    /**
     * @desc  获取当前元素后面所有元素
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle 
     * @return   {HTML Element}      
     */
    function getNextAll(curEle) {
         var arr=[];
         var next=this.getNextEle(curEle);

         //后面节点可能没有为null
         while(next) {
           arr.push(next);
           next=this.getNextEle(next);
         }
         return arr;
    }

    /**
     * @desc 获取当前元素的相邻的两个元素节点
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle 
     * @return   {HTML Element}          
     */
    function getSibling(curEle) {
          var pre=this.getPreEle(curEle);
          var next=this.getNextEle(curEle);
          var arr=[];
          pre?arr.push(pre):null;
          next?arr.push(next):null;
          return arr;
    }

    /**
     * @desc  获取所有的兄弟元素节点
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle 
     * @return   {NodeList}          dom元素集合
     */
    function getSiblings(curEle) {
      return this.getPrevAll(curEle).concat(this.getNextAll(curEle));
    }

    /**
     * @desc  获取当前元素的索引
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle 
     * @return   {Number}          index
     */
    function index(curEle) {
        return this.getPrevAll(curEle).length;
    }

    /**
     * @desc 获取当前元素第一个子元素
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle 
     * @return   {HTML Element}         
     */
    function getFirstChild(curEle) {
         var child=this.getChildren(curEle);
         return child.length>0? child[0]:null;
    }

    /**
     * @desc 获取当前元素最后一个子元素
     * @DateTime 2018-04-18
     * @param    {HTML Element}   curEle 
     * @return   {HTML Element}          
     */
    function getLastChild(curEle) {
         var child=this.getChildren(curEle);
         return child.length>0? child[child.length-1]:null;
    }

    /**
     * @desc  向指定容器的末尾添加元素
     * @DateTime 2018-04-18
     * @param    {HTML Element}   newEle    [description]
     * @param    {HTML Element}   container [description]
     */
    function append(newEle,container) {
        container.appendChild(newEle);
    }
    
    /**
     * @Author   xjc
     * @desc  向指定容器的开头添加元素
     * @DateTime 2018-04-18
     * @param    {HTML Element}   newEle    [description]
     * @param    {HTML Element}   container [description]
     */
    function prepend(newEle,container) {
      var first=this.getFirstChild(container);
      
      // 容器里面存在元素的话就向他后面添加，否则就在末尾添加
      if(first) {
         container.insertBefore(newEle,first);
         return;
      }
      container.appendChild(newEle);
    }
    
    /**
     * @desc 把新元素(newEle) 追加到指定元素(oldEle) 前面
     * @DateTime 2018-04-18
     * @param    {HTML Element}   newEle [description]
     * @param    {HTML Element}   oldEle [description]
     */
    function insertBefore(newEle,oldEle) {
        oldEle.parentNode.insertBefore(newEle,oldEle);
    }
    
    /**
     * @desc 把新元素(newEle) 追加到指定元素(oldEle) 后面
     * @DateTime 2018-04-18
     * @param    {HTML Element}   newEle [description]
     * @param    {HTML Element}   oldEle [description]
     */
    function insertAfter(newEle,oldEle) {
        var next=this.getNextEle(oldEle);
        //如果后面存在元素，就在后面元素的前面插入新元素
        //否则没有子元素的话就在后面添加
        if(next) {
          oldEle.parentNode.insertBefore(newEle,next);
          return;
        }
        oldEle.parentNode.appendChild(newEle);
    }


    // 属性的读取和设置
    /**
     * @desc 属性的读取和设置（可含多个属性设置）
     * @desc getAttribute是获取和设置dom元素对象的值和属性，js对象用property来设置
     *       js对象(如：{})没getAttribute方法
     * @desc property和getAttribute在IE9+上不共享，在IE9下属性值共享
     * @desc 分开处理property和Attribute问题
     * @DateTime 2018-04-18
     * @param    {HTML Element}   ele   
     * @param    {object||String}   name  对象或属性名
     * @param    {String}   value 属性值
     */
    function attr(ele,name,value) {
          // 如果给多个属性设置 类似 {width:'22px',value:'hao'}
          if(typeof name==='object') {
             for(var attr in name) {
                attr(ele,attr,name[attr]);
             }
             // name不是对象走下面的
             // 设置值的时候 且值不等于undefined
          } else if( value!==undefined) {
                //元素存在setAttribute 就用这个
                
               if(typeof ele.setAttribute!=='undefined') {
                    if(value===false) {
                      // 移除这个属性
                       ele.removeAttribute(name);
                    } else {
                       // value is true
                       // 处理boolean
                       ele.setAttribute(name,value===true?name:value)
                    }
                 // 不存在setAttribute方法时候用property
               } else {
                  ele[name]=value;
               } 
             // 获取值 且当getAttribute方法存在，值不是布尔值类型
             // 因为如果是布尔值类型，getAttribute获取的不是最新的
             // propertye获取才是最新的
          } else if(typeof ele.getAttribute!=='undefined' && typeof ele[name]!=='boolean') {
             console.log('getAttribute');
             return ele.getAttribute(name);

             //获取值 且getAttribute方法不存在，用property方法获取值
          } else {
             return ele[name];
          }

    }
    
    /**
     * 低版本
     * 
     * @desc  获取css样式 (兼容IE)
     * @DateTime 2018-04-19
     * @param    {HTML Element}   ele  [description]
     * @param    {String}   attr 属性
     * @return   {String}        value
     */
    /*function getStyle(ele,attr) {
       // IE系列 
       // 不能用 ele.getComputedStyle来判断，因为ele里面没getComputedStyle
      if(ele.currentStyle) {
        
         getStyle=function(ele,attr) {

           return ele.currentStyle[attr];
         }
       
       
      //FF,chrome,opera
      } else {
        
         getStyle=function(ele,attr) {

          return getComputedStyle(ele,false)[attr];
        }
      }
      return getStyle(ele,attr);
    }*/

    /**
     * @desc  兼容所有浏览器
     * @desc  加强版上面的，获取去掉带单位的数字 属性值 如:width:20px
     * @DateTime 2018-06-23
     * @param    {HTML Ele}   curEle [description]
     * @param    {String}   attr   [description]
     * @return   {String}          
     */
     function getStyle(curEle,attr) {
         var val=null;
         var reg=null;
         // 数字+单位的 width:300px这样
         reg=/^(-?\d+(?:\.\d+)?)(px|pt|rem|em)$/;
         // IE9及其以上现代浏览器
         if("getComputedStyle" in window) {
           val=window.getComputedStyle(curEle,null)[attr];
           
         } else {   
              val=curEle.currentStyle[attr];          
         }
         // 是数字类型的属性 去除单位，非数字类型正常返回
         return reg.test(val)?parseFloat(val):val;
       }
    /**
     * @desc  相当于pageX，pageY，跟jq中的offset对应，元素相对于页面的top和left
     * @DateTime 2018-06-17
     * @param    {HTML Element}   ele 
     * @return   {object}      
     */
    function offset(ele) {
         var left=0,
             top=0;
         while(ele) {
         	left+=ele.offsetLeft;
         	top+=ele.offsetTop;
         	ele=ele.offsetParent;
         }    
         return {
         	left:left,
         	top:top
         };
    }
     
    /**
     * @desc 获取距离 含有定位父级的 距离
     * @desc 也就是一次的offsetLeft和offsetTop
     * @DateTime 2018-06-17
     * @param    {HTML Element}   ele 
     * @return   {object}      
     */
    function position(ele) {
    	if(ele) {
    		return {left:ele.offsetLeft,top:ele.offsetTop};
    	}
    }
    
    /**

     * @desc this是指当前元素，获取元素样式
     * @DateTime 2018-06-17
     * @param    {string}   attr 
     * @return   {Number}        
     */
    function getClass(attr) {
       return window.getComputedStyle?getComputedStyle(this,false)[attr]:
       this.currentStyle[attr];
    }
    /**
     * @desc 里面的this是指当前元素，设置元素单个样式
     * @DateTime 2018-06-17
     * @param    {String}   attr  属性
     * @param    {Number|String}  属性值
     */
    function setClass(attr,value) {
      // float情况
         if(attr==="float") {
           this["style"]["cssFloat"]=value;
           this["style"]["styleFloat"]=value;
           return;
         }
         // opacity情况
         if(attr==="opacity") {
            this["style"]["opacity"]=value;
            this["style"]["filter"]="alpha(opacity="+value*100+")";
            return;
         }
         var reg=null;
         // 对于要加px的单位的，如果没加单位就给它补上
            reg=/^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/;
         // 首先是这些属性中的某个
         if(reg.test(attr)) {
              // 是纯数字
              if(!isNaN(value)) {
                  value+="px";
              }
         }
         this["style"][attr]=value;
    }
    /**
     * @desc this为当前元素 批量设置元素样式
     * @DateTime 2018-06-17
     * @param    {object}   样式参数
     */
    function setGroupClass(option) {
      // 如果为undefined-> 0
       option=option||0;
       if(option.toString()!=="[object Object]") {
         throw new TypeError("it is not object");
       }
       for(var key in option) {
         if(option.hasOwnProperty(key)) {
            setClass.call(this,key,option[key]);
         }
       }
    }
    
    /**
     * @desc 类似jq的css，实现了获取，单独设置，批量设置元素的样式
     * @DateTime 2018-06-17
     * @param    {HTML Element}   
     * @return   {Number}         
     */
    function css(curEle) {
       var argTwo=arguments[1];
       var ary=[].slice.call(arguments,1);
       // 含2个参数且是字符串类型
       if(typeof argTwo==="string") {
           var argThree=arguments[2];
           // 不存在第三个值，表示获取属性
           if(typeof argThree==="undefined") {
             return getClass.apply(curEle,ary);
           }

           // 存在第三个值，表示设置属性
           setClass.apply(curEle,ary);
       }
       // 防止undefined.toString报错，把undefined转为0
       argTwo=argTwo||0;

       // 如果第二个参数是对象，批量设置元素属性
       if(argTwo.toString()==="[object Object]") {
           setGroupClass.apply(curEle,ary);
       }
    }

    /**
     * @desc 兼容JSON.parse方法（IE8及其以下不支持）
     * @DateTime 2018-06-19
     * @param    {String}   str 
     * @return   {Object}      json处理后的对象
     */
    function jsonParse(str) {
      var obj=null;
      try{
         obj=JSON.parse(str);
      } catch(e) {
         obj=eval("("+str+")");
      }
      return obj;
    }
    // 暴露接口
    return {
         css:css,
         attr:attr,
         getStyle:getStyle,
         hasClass:hasClass,
         addClass:addClass,
         removeClass:removeClass,
         toggleClass:toggleClass,
         getClassName:getClassName,
         toArray:toArray,
         getChildren:getChildren,
         getPreEle:getPreEle,
         getNextEle:getNextEle,
         getPrevAll:getPrevAll,
         getNextAll:getNextAll,
         getSibling:getSibling,
         getSiblings:getSiblings,
         index:index,
         getFirstChild:getFirstChild,
         getLastChild:getLastChild,
         append:append,
         prepend:prepend,
         insertBefore:insertBefore,
         insertAfter:insertAfter,
         offset:offset,
         position:position,
         css:css,
         jsonParse:jsonParse
    };
  })();

  
  
  win.dom=dom;
})(window||{});