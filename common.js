// 常用的一些方法

(function(win) {
  var common={
   // 常用的一些方法
   
   
   // 随机数方面
   // 
   // 
   // 
   /**
    * @desc   随机排序
    * @DateTime 2018-04-21
    * @param    {Array}   arr  array
    * @return   {Array}       array
    */
   randomSort:function(arr) {
    return arr.sort(function() {
        return Math.random()-0.5;
     });
     
   },
   
   /**
    * @desc  从小到大排序
    * @DateTime 2018-04-21
    * @param    {Array}   arr 
    * @return   {Array}       
    */
   sortToBig:function(arr) {
     return arr.sort(function(a,b) {
        return a-b;
     });
   },
   

   /**
    * @desc  从大到小排序
    * @DateTime 2018-04-21
    * @param    {Array}   arr 
    * @return   {Array}       
    */
   sortToSmall:function(arr) {
      return arr.sort(function(a,b) {
        return b-a;
      });
   },
   /**
    * @desc  随机数
    * @DateTime 2018-04-21
    * @param    {Number}   min 
    * @param    {Number}   max 
    * @return   {Number}      min-max 之间的值
    */
   random:function(min,max) {
      return Math.floor(Math.random()*(max-min+1)+min);
   },
  
   /**
    * @desc  随机颜色
    * @DateTime 2018-04-21
    * @return   {String}   #faeeab 这样
    */
   randomColor:function() {
     // substring 截取index 为2后面的所有，substr从0开始截取6个
     return '#'+Math.random().toString(16).substring(2).substr(0,6);
   },
   
   /**
    * @desc  随机一种颜色的深浅
    * @DateTime 2018-04-21
    * @param    {String}   str  范围[0-9a-f] 'a'
    * @return   {String}       如：#a1aeab
    */
   randomOneColor:function(str) {
    var str1=str+(Math.random()+'').slice(-1);
    var str2=str+(Math.random()+'').slice(-1);
    var str3=str+(Math.random()+'').slice(-1);

    return '#'+[str1,str2,str3].join('');
   },

   // 时间方面
   // 
   // 
   // 
   
   
   /**
    * @desc  获取当前时间 年-月-日-星期几-时-分-秒
    * @DateTime 2018-04-21
    * @param    {HTML Element}   curEle 
    */
   currentTime:function(curEle) {
        // 开之前先关掉
        clearInterval(curEle.timer);
       // 先执行一次不要等1s后在显示
       getTime();
       curEle.timer=setInterval(getTime,1000);
       function getTime() {
 
          var time=new Date(),
              year=time.getFullYear(),
              month=time.getMonth()+1,
              date=time.getDate(),
              week=time.getDay(),
              hours=time.getHours(),
              minute=time.getMinutes(),
              second=time.getSeconds(),
              str='';
            
          str=year+"年"+month+"月"+date+"日  "+toWeek(week)+"  "+toTwo(hours)+":"+ 
              toTwo(minute)+":"+toTwo(second);

          curEle.innerHTML=str;

     }
       function toTwo(n) {
          return n<10?"0"+n:""+n;
       }
       function toWeek(type) {

               switch(type)
               {
                  case 0:
                         type='星期日';
                         break;
                  case 1:
                         type='星期一';
                         break; 
                  case 2:
                         type='星期二';
                         break;
                  case 3:
                         type='星期三';
                         break;
                  case 4:
                         type='星期四';
                         break;
                  case 5:
                         type='星期五';
                         break;
                  case 6:
                         type='星期六';
                         break;       
                   default:
                        return type;                                        
               }
               return type;
       }

   },
   /**
    * @desc 倒计时  天-时-分-秒
    * @DateTime 2018-04-21
    * @param    {HTML Element}   dom元素
    * @param    {String}   endTime '2018-04-28'
    */
   countDown:function(curEle,endTime) {
      var end=new Date(endTime);
      clearInterval(curEle.timer);
      curEle.timer=setInterval(function(){
          var now=new Date(),
              str='',
          
       // 转为秒
          t=(end-now)/1000,
          d=0,
          h=0,
          m=0,
          s=0;
      
      // 时间没过期
      if(t>0) {
         d=Math.floor(t/3600/24);
         h=Math.floor(t/3600%24);
         m=Math.floor(t/60%60);
         s=Math.floor(t%60);
      }
       str='剩余时间:'+d+'天'+h+'小时 '+m+'分钟 '+s+'秒';
       curEle.innerHTML=str;
      
      },1000);

   },


   // 范围限定及其最短线
   // 
   // 
   // 
   
   /**
    * @desc  obj1与obj2是否碰撞
    * @desc  obj2在obj1的四周就是不碰撞
    * @DateTime 2018-04-22
    * @param    {HTML Element}   obj1 
    * @param    {HTML Element}   obj2 
    * @return   {Boolean}        
    */
   collision:function(obj1,obj2) {
            var l1=obj1.offsetLeft;
            var t1=obj1.offsetTop;
            var r1=obj1.offsetWidth+obj1.offsetLeft;
            var b1=obj1.offsetHeight+obj1.offsetTop;

            var l2=obj2.offsetLeft;
            var t2=obj2.offsetTop;
            var r2=obj2.offsetWidth+obj2.offsetLeft;
            var b2=obj2.offsetHeight+obj2.offsetTop;

            // 没有碰撞
            if(l2>r1||r2<l1||t2>b1||b2<t1) {
              return false;   //不执行，取消默认
          
            } else {
          
              return true;//碰撞，返回正确值
            }
   },
   

   /**
    * @desc  勾股定理获取 两个元素 左上角的之间的距离(最短距离)
    * @DateTime 2018-04-22
    * @param    {[type]}   obj1 [description]
    * @param    {[type]}   obj2 [description]
    * @return   {[type]}        [description]
    */
   nearLinear:function(obj1,obj2) {
        var a=obj1.offsetLeft-obj2.offsetLeft;
        var b=obj1.offsetTop-obj2.offsetTop;
        return Math.sqrt(a*a+b*b);
   },
   
   /**
    * @desc  获取最小值和索引
    * @desc  同理，可以获取 最短，最长，最大，最小
    * @DateTime 2018-04-22
    * @param    {Array}   arr 
    * @return   {Number}      索引
    */
   minimum:function(arr) {
      var index=0,
          value=arr[0];

      for(var i=0,len=arr.length;i<len;i++) {
         if(arr[i]<value) {
            value=arr[i];
            index=i;
         }
      }   
      return index; 
   },

   
   // 算法系列
   // 
   // 
   // 
  

   /**
    * @desc  从小到大排序(不用sort方法) 冒泡排序
    * @desc  也可以从大到小
    * @DateTime 2018-04-22
    * @param    {Array}   arr 
    * @return   {Array}     排序后的数组
    */
   sort1:function(arr) {
      for(var i=0;i<arr.length;i++)
         {
               var temp=0;
               var isTrue=0;
               // 每一次内循环如果有一个数大于后一个数，就temp=1，也就是没完全排序
               // 号，temp为1
               for(var j=0;j<arr.length;j++)
               {
                    // 从大到小排序，改为<
                    if(arr[j]>arr[j+1])
                    {
                       temp=arr[j+1];
                       arr[j+1]=arr[j];
                       arr[j]=temp;
                       temp=1;
                    }
               }
             // 循环到某一次如果都从小到大排序，结束
             if(temp==0)break;  
         }
       return arr;  
   },
  
   /**
    * @desc  快速排序方式来从小到大
    * @DateTime 2018-04-22
    * @param    {Array}   arr 
    * @return   {Array}      
    */
    quickSort:function(arr) {

       if(arr.length<=1) return arr;

       var array=[],
           left=[],
           right=[],
           num=Math.floor(arr.length/2),
           //获取中间那个值
           middle=arr.splice(num,1);

       // 从小到大排
       for(var i=0,len=arr.length;i<len;i++)
       {
          // 左边是小的，右边是大的
         if(arr[i]<middle)
         {
           left.push(arr[i]);
         }
         else
         {
          right.push(arr[i]);
         }
       } 
      // 数组拼接
       return arguments.callee(left).concat([middle],arguments.callee(right));
   },
   
   /**
    * @desc  移除重复元素(不改变原来数组)
    * @DateTime 2018-04-22
    * @param    {Array}   arr 
    * @return   {Array}       
    */
   removeRepeat:function(arr) {
      var newArr=[];
      for(var i=0,len=arr.length;i<len;i++) {
          // 找不到的话添加
          if(newArr.indexOf(arr[i])===-1) {
            newArr.push(arr[i]);
          }
      }
      return newArr;
   },
   
   /**
    * @desc  利用对象属性唯一性来移除重复元素(不改变原来数组)
    * @DateTime 2018-04-22
    * @param    {Array}   arr 
    * @return   {Array}       
    */
   removeRepeat2:function(arr) {
       var arr2=[];
       var obj2={};
       for(var i=0,len=arr.length;i<len;i++)
       {
         if(!obj2[arr[i]])
         {
           obj2[arr[i]]=true;
           arr2.push(arr[i]);
         }
       }
       return arr2;
   },
   
   /**
    * @desc 某个子字符串出现的次数
    * @DateTime 2018-04-22
    * @param    {String}   str      
    * @param    {String}   strSplit  如 '|'
    * @return   {Number}         
    */
   occurNum:function(str,strSplit) {
     return str.split(strSplit).length-1;
   },
   

   /**
    * @desc  查找字符串中出现次数最多的字符
    * @DateTime 2018-04-22
    * @param    {String}   str 
    * @return   {String}       出现次数最多
    */
   mostStr:function(str) {
      if(str.length===1) {
        return str;

      }
      //记录每个字母出现的次数
      var charObj={};
      for(var i=0,len=str.length;i<len;i++)
      {
        //没有就记为1
         if(!charObj[str.charAt(i)])
         {
          charObj[str.charAt(i)]=1;
         }
         else 
         {
          charObj[str.charAt(i)]+=1;//再次出现就 +1
         }
      }
       
      //找出次数最多的字符串
      var maxValue=1;
      var maxChar="";
      for(var k in charObj)
      {
        if(charObj.hasOwnProperty(k))
        {
           if(charObj[k]>maxValue)
           {
            maxValue=charObj[k];
            maxChar=k;
           }
        }
      }
      return maxChar;
   },

   // 字符串系列方法
   // 
   // 
   // 
   
   /**
    * @desc 去除字符串空格
    * @desc type-1 所有空格，2 前后空格 3 前空格 4 后空格
    * @DateTime 2018-04-22
    * @param    {String}   str  
    * @param    {Number}   type 
    * @return   {String}        
    */
   trime:function(str,type) {
       switch(type) {
        case 1:return str.replace(/\s+/g,"");
        case 2:return str.replace(/(^\s*)|(\s*$)/g,"");
        case 3:return str.replace(/^\s*/g,"");
        case 4:return str.replace(/\s*$/g,"");
        default:return str;
       }
   },
   
   /**
    * @desc  字符串循环复制
    * @DateTime 2018-04-22
    * @param    {String}   str   
    * @param    {Number}   count 
    * @return   {String}        
    */
   repeatStr:function(str,count) {
       var string='';
       if(count!==undefined) {
           for(var i=0;i<count;i++) {
            string+=str;
           }
       }
       return string;
   },
   
   /**
    * @desc  替换字符串
    * @DateTime 2018-04-22
    * @param    {String}   str     
    * @param    {String}   findTxt 被替换的
    * @param    {String}   repTxt  替换的
    * @return   {String}          
    */
   replaceAll:function(str,findTxt,repTxt) {
       var reg=new RegExp(findTxt,'g');
       return str.replace(reg,repTxt);
   },
   
   /**
    * @desc  固定部分替换成*
    * @desc  用法：common.replaceStr('18012176504',[3,5,3],0);
    * @desc  常用于 隐藏号码 或其他东西
    * @DateTime 2018-04-22
    * @param    {String}   str    整个字符串
    * @param    {Array}   regArr  [3,5,3]类似这种
    * @param    {Number}   type   0-表示中间替换成*,1-表示前后
    * @param    {String}   Txt    替换的
    * @return   {[type]}          [description]
    */
   replaceStr:function(str,regArr,type,Txt) {
       var regtxt="",
           Reg=null,
           replaceTxt=Txt||"*";
       var _self=this;
       //replaceStr("18819322663",[3,5,3],0)
       //188*****663
       if(regArr.length===3&&type===0)
       {
        // 前面任意字符 至少3次，中间的至少5次，后面的至少3次
        regtxt='(\\w{'+regArr[0]+'})\\w{'+regArr[1]+'}(\\w{'+regArr[2]+'})';
        Reg=new RegExp(regtxt);
        var replaceCount=_self.repeatStr(replaceTxt,regArr[1]);
        return str.replace(Reg,'$1'+replaceCount+'$2');
       }
       else if(regArr.length===3&&type===1)
       {
         //replaceStr("18819322663",[3,5,3],0)
           //***19322***
           regtxt='\\w{'+regArr[0]+'}(\\w{'+regArr[1]+'})\\w{'+regArr[2]+'}';
           Reg=new RegExp(regtxt);
           var replaceCount1=_self.repeatStr(replaceTxt,regArr[0]);
           var replaceCount2=_self.repeatStr(replaceTxt,regArr[2]);
           return str.replace(Reg,replaceCount1+'$1'+replaceCount2);
       }
       //replaceStr("1asd88465adef",[5],0)
       //*****8465adef
      else if(regArr.length===1&&type==0)
      {
        regtxt='(^\\w{'+regArr[0]+'})';
        Reg=new RegExp(tegtxt);
        var replaceCount=_self.repeatStr(replaceTxt,regArr[0]);
        return str.replace(Reg,replaceCount);
      }
      //replaceStr("12432addfswer",[5],'+')
      //12432add+++++
      else if(regArr.length===1&&type===1)
      {
         regtxt='(\\w{'+regArr[0]+'}$)';
         Reg=new RegExp(regtxt);
         var replaceCount=_self.repeatStr(replaceTxt,regArr[0]);
         return str.replace(Reg,replaceCount);
      }
   },
   

   /**
    * @desc  大小写切换等
    * @desc               type   
    *                      1     首字母大写
    *                      2     首字母小写
    *                      3     大小写转换
    *                      4     全部大写
    *                      5     全部小写
    * @DateTime 2018-04-22
    * @param    {String}   str  
    * @param    {Number}   type  切换类型
    * @return   {String}        
    */
   changeCase:function(str,type) {
        function ToggleCase(str) {
           var itemTxt="";
           str.split("").forEach(
               function (item)
               {
                 if(/^[a-z]+/.test(item))
                 {
                  itemTxt+=item.toUpperCase();
                 }
                 else if(/^([A-Z]+)/.test(item))
                 {
                  itemTxt+=item.toLowerCase();
                 }
                 else {
                  itemTxt+=item;
                 }
               }
           );
           return itemTxt;
        }
      switch(type)
        {
           case 1:
                return str.replace(/^(\w)(\w+)/,function(v,v1,v2){
                   return v1.toUpperCase()+v2.toLowerCase();
                });
           case 2:
                return str.replace(/^(\w)(\w+)/,function(v,v1,v2){
                   return v1.toLowerCase()+v2.toUpperCase();
                });     
           case 3:
             return ToggleCase(str);
           case 4:
             return str.toUpperCase();
           case 5:
             return str.toLowerCase();
           default:
             return str;     
        }  
   },
   

   /**
    * @desc  检测字符串是否满足某种类型
    * @DateTime 2018-04-22
    * @param    {String}   str  
    * @param    {Number}   type  类型 'number' | 'email'
    * @return   {Boolean}       
    */
   checkType:function(str,type) {
        switch(type)
        {
          case "emali":
          return /^[-\w]+(\.[-\w]+)*@[-\w]+(\.[-\w]+)+$/.test(str);
          case "phone":
          return /^1[3|4|5|7|8][0-9]{9}$/.test(str);
          case "tel":
          return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
          case "number":
          return /^[0-9]$/.test(str);
          case "english":
          return /^[a-zA-Z]+$/;
          case "chinese":
          return /^[\u4E00-\u9FA5]+$/.test(str);
          case "lower":
          return /^[a-z]+$/.test(str);
          case "upper":
          return /^[A-Z]+$/.test(str);
          default:
          return true;
        }
   },


   /**
    * @desc  检测密码强度
    * @DateTime 2018-04-22
    * @param    {String}   str 
    * @return   {Number}       level
    */
   paswdLevel:function(str) {
        var nowLev=0;
        if(str.length<6)
        {
          return nowLev;
        }
         if(/[0-9]/.test(str))
        {
          nowLev++;
        }
        if(/[a-z]/.test(str))
        {
          nowLev++;
        }
        if(/[A-Z]/.test(str))
        {
          nowLev++;
        }
        if(/[\.|\-|\_]/.test(str))
        {
          nowLev++;
        }
        return nowLev;
   },
   
   /**
    * @desc  json形式字符串转为对象
    * @DateTime 2018-04-22
    * @param    {String}   str 
    * @return   {Object}       一般为Array
    */
   strToObject:function(str) {
      // "代替'
      return JSON.parse(str.replace(/'/g,'"'));
   },

   // 数组系列方法
   // 
   // 
   // 
  
  /**
   * @desc 获取数组最大值
   * @DateTime 2018-04-22
   * @param    {Array}   arr 
   * @return   {Number}       
   */
  getMax:function(arr) {
     return Math.max.apply(null,arr);
  },

  /**
   * @desc 获取数组最小值
   * @DateTime 2018-04-22
   * @param    {Array}   arr 
   * @return   {Number}      
   */
  getMin:function(arr) {
     return Math.min.apply(null,arr);
  },
  

  /**
   * @desc  获取数组随机一个元素
   * @DateTime 2018-04-22
   * @param    {[type]}   arr [description]
   * @return   {[type]}       [description]
   */
  getRandomOne:function(arr) {
      return  arr[Math.floor(Math.random()*arr.length)];
  },
  
  /**
   * @desc  数组中某个元素出现的次数
   * @DateTime 2018-04-22
   * @param    {Array}   arr   
   * @param    {Number||String}   value 2 or '2' 
   * @return   {Number}      count次数
   */
  getEleCount:function(arr,value) {
     var num=0;
     // 去除带字符串的数字 '2'-> 2
     value=parseInt(value);
     for(var i=0,len=arr.length;i<len;i++)
     {
       if(arr[i]==value)
       {
        num++;
       }
     }
     return num;
  },

  
   /**
    * @desc 搜索某个元素在数组中多次出现的索引的集合
    * @DateTime 2018-04-22
    * @param    {Array}   arr   
    * @param    {Number}   value 
    * @return   {Array}         索引的集合
    */
   searchIndex:function(arr,value) {
           var result=[],
               len=arr.length,
               pos=0;//位置
           while(pos<len)
           {
             pos=arr.indexOf(value,pos);//搜索到目标的索引
             if(pos===-1) break;
             result.push(pos);
             pos+=1;
           }
           return result;
   },
   
   /**
    * @desc   判断是否是数组
    * @DateTime 2018-04-22
    * @param    {Array}   arr 
    * @return   {Boolean}     
    */
   isArray:function(arr) {
     return typeof arr==="object"&&Object.prototype.toString.call(arr)==="[object Array]";
   },

   /**
    * @desc  伪数组转为真数组
    * @DateTime 2018-04-22
    * @param    {伪Array}   obj 
    * @return   {Array}      
    */
   toTrueArr:function(obj) {
      var flag='getComputedStyle' in window;

      // IE9+浏览器
      if(flag) {
         return Array.prototype.slice.call(obj);

      // IE8及其以下  
      } else {
         return Array.prototype.concat.apply([],obj);
      }
   },
   

   /**
    * @desc  获取所有元素 包括document
    * @DateTime 2018-04-22
    * @return   {Array}   
    */
   getAllEles:function() {
     var eles=this.toTrueArr(document.getElementsByTagName('*'));

     eles.push(document);
     return eles;
   },
   
   /**
    * @desc  过滤掉某个元素
    * @DateTime 2018-04-22
    * @param    {Array}   arr   
    * @param    {Number||String}   value '2' or 2
    * @return   {Array}        过滤掉后的数组
    */
   filterArr:function(arr,value) {
     // '2' or 2 都可以
     value=parseInt(value);
     for(var i=0,len=arr.length;i<len;i++) {
            if(arr[i]===value) {
               arr.splice(i,1);
            }
     }
     return arr;
   },
   
   /**
    * @desc  增加css3前缀
    * @DateTime 2018-04-22
    * @param    {HTML Element}   ele   
    * @param    {String}   value  值
    * @param    {String}   属性
    */
   addPrefix:function(ele,value,key) {
          key=key||'Transform'; //key也可能是animation等
          // 最后一个不加前缀
          ['Moz','O','Ms','Webkit',''].forEach(function(prefix) {
            //第一个参数值，第二个索引
            ele.style[prefix+key]=value;
          });
          return ele;
    },   


    // 函数及其对象系列
    // 
    //    
    //       
    
    /**
     * @desc    判断对象类型
     * @desc   用法： common.objType().isArray();
     * @DateTime 2018-04-22
     * @return   {object}   里面含有判断类型方法
     */
    objType:function() {
           var Type={};
           for(var i=0,type;type=["String","Boolean","Object","Number","Array","Function","Date","RegExp"][i++];) {
            (function(type){
              
                Type['is'+type]=function(obj) {
                return Object.prototype.toString.call(obj)===
                       '[object '+type+']'; 
                }

            })(type);
            
          }
          return Type;
    },
    
    /**
     * @desc 对象的浅拷贝
     * @DateTime 2018-04-22
     * @param    {object}   target 被拷贝的对象
     * @return   {object}       new object
     */
    simpleClone:function(target) {
        var newObj={};
        for(var attr in target) {
            if(target.hasOwnProperty(attr)) {
               newObj[attr]=target[attr];
            }
        }
        return newObj;
    },
    

     /**
     * @desc 对象的深拷贝之JSON方法 IE6,7不支持
     *       如果只是单纯复制同个对象的话，这种深拷贝最简单
     *       下面的extend方法功能多
     *       
     *       而且返回的对象 不等于 原来target对象
     *       
     * @DateTime 2018-04-22
     * @param    {object}   target 被拷贝的对象
     * @return   {object}       new object
     */
    deepClone:function(target) {
         // 先转为字符串
         var a=JSON.stringify(target);
         // 字符串转为对象
         var b=JSON.parse(a);
         return a;
    },
   /**
    * @desc  对象的浅拷贝和深拷贝
    * @desc  extend 拷贝(浅拷贝和深拷贝) 深拷贝是里面有嵌套的数组或者对象
    * @desc  同属性的后来者居上，目标对象没有的属性则添上
    * @       也就是有就覆盖，没有就增加
    * @DateTime 2018-04-22
    * @return   {obj}  
    */
   extend:function() {
            var src,copy,option,key,copyIsArray,
                target=arguments[0]||{},
                len=arguments.length,
                objType=this.objType(),
                deep=false,
                i=1;
            
            //如果是布尔值，就是extend(true,obj1,obj2);
            //target就等于arguments[1],copy的就是
            //arguments[2],所以i=2；
            if(typeof target==='boolean') {
               deep=target;
               target=arguments[1]||{};
               i=2;
            } 
            //处理这种情况extend('hellow',{});
            if(typeof target!=="object" && !objType.isFunction(target)) {
               target={};
            }  

             //处理这种情况 extend(obj1); 为this扩展方法和属性
             //也就是jq里面的插件扩展方式
            if(len===i) {
               target=this;
               --i;//确保下面for循环能运行
            }

            for(;i<len;i++) {
              //比如obj1,obj2,obj3。option就等于obj2
               if((option=arguments[i])!==null) {
                 for(key in option) {
                    src=target[key];
                    copy=option[key];
  
                    /*防止自引用，比如a:{},$.extend(a,{name:a})*/ 
                    if(src===copy) {
                     continue;
                    }
                   
                    //如果是深拷贝,被拷贝的属性可能是对象
                    //或者数组
              if(deep&&copy&&(objType.isObject(copy)||
                (copyIsArray=objType.isArray(copy)))) {
                       //是数组
                       if(copyIsArray) {
                          copyIsArray=false;
                          clone=src && objType.isArray(src)?src:[];
                       }
                       //是对象
                       else {
                          clone=src && objType.isObject(src) ? src:{};
                       }
                        
                       //递归
                       target[key]=extend(deep,clone,copy);
                    } else if(copy!==undefined) {
                      //浅拷贝
       
                      target[key]=copy;
                    }
                 }
               }
            }
            //返回target
            return target;
   },
    

    // css3相关
    // 
    //
    //
    
    /**
     * @desc 给元素绑定transitionend完成事件
     * @desc 当元素transition完成执行fn回调函数
     * @DateTime 2018-04-29
     * @param    {HTML Element}   obj dom元素
     * @param    {Function} fn  回调函数
     */
    addEnd:function(obj,fn) {
				obj.addEventListener('WebkitTransitionEnd',fn,false);
				obj.addEventListener('transitionend',fn,false);
	},
     /**
     * @desc 给元素 解除 transitionend完成事件
     * @DateTime 2018-04-29
     * @param    {HTML Element}   obj dom元素
     * @param    {Function} fn  回调函数
     */			
	removeEnd:function(obj,fn) {
				obj.removeEventListener('WebkitTransitionEnd',fn,false);
				obj.removeEventListener('transitionend',fn,false);
	}


  };
  win.common=common;
})(window||{});