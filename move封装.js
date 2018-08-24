// 运动封装
(function(win){
  var move={

      /**
       * @desc  获取样式值
       * @DateTime 2018-04-20
       * @param    {HTML Element}   curEle dom元素
       * @param    {String}   attr 属性
       * @return   {String}       如 '150px'
       */
      getStyle:function(curEle,attr) {
        return curEle.currentStyle?curEle.currentStyle[attr]:
               getComputedStyle(curEle,false)[attr];
      },
      
      /**
       * @desc    完美运动
       * @desc   使用：startMove(obj,{'width':300,'height':300,'opacity':50})
       * @desc   加了回调也会有一点点问题，alert()会在没完全完成时候弹出
       * @DateTime 2018-04-20
       * @param    {HTML Element}   obj  dom元素
       * @param    {object}   json  {'width':50px,'height':'100px'}
       * @param    {Function} fn   回调函数
       */
      startMove:function(obj,json,fn) {
          var _self=this;
          clearInterval(obj.timer);
          obj.timer=setInterval(function(){
           var cur=0,
               target=null,
           // 假设所有目标都完成了
               flag=true;
           for(var attr in json) {
               
               //目标值
               target=json[attr];

                if(attr=="opacity") {
 
                  cur=Math.round(parseFloat(_self.getStyle(obj,attr))*100);//parseFloat保存所有数值，Math.round 四舍五入取整。

                } else {

                  cur=parseInt(_self.getStyle(obj,attr));
                }
              
             // 如果存在带有单位的属性，格式化成纯数字，没单位
             // 传入参数"width":"300px"或者"width":"300" "width":300 都可以 
             //  "width":300px 是不行的，没法识别，因为有px 应该是字符串类型
             if(/^\d+[a-zA-Z]+/.test(target)) {
                target=parseInt(target);
             }
           
             //目标减去当前值    
             var speed=(target-cur)/6; 
             //为什么用[]不用. 因为 for循环中，attr是变量，变量必须用[],
             speed=speed>0?Math.ceil(speed):Math.floor(speed);
             //至少有一样没达到目标值,就一直继续，直到全部完成
             if(cur!=target) {
                  flag=false;
                 if(attr=="opacity") {

                    obj.style.filter="alpha(opacity:"+(cur+speed)+")";
                    obj.style.opacity=(cur+speed)/100;
                  } else {

                    obj.style[attr]=cur+speed+"px";
                   }
             }
             
           }
           //当所有都实现了，关闭定时器，如果有一样没实现，不关闭定时器
           if(flag) {

            clearInterval(obj.timer);
            fn&&fn(); //函数存在就执行。
           }
          },30);
      },
      
      
      /**
       * @desc  匀速运动
       * @desc   使用：startMove(obj,'width',7,'300px',function(){})
       * @desc  加了回调也会有一点问题，alert()会在没完全完成时候弹出，sped越大
       *         影响越大
       * @DateTime 2018-04-21
       * @param    {HTML Element}   obj   dom元素
       * @param    {String}   attr   属性
       * @param    {Number}   sped   数值
       * @param    {Number}   target 数值
       * @param    {Function} fn     回调函数

       */
      linear:function(obj,attr,sped,target,fn) {
           clearInterval(obj.timer);
           var _self=this;
           // "50px" 这种情况
           target=parseInt(target);
           obj.timer=setInterval(function(){
           
            // sped=parseInt(getStyle(obj,attr))<target?sped:-sped;
           // 这样容易出问题，sped有时会出错，不会变成-sped
            // 所以重新定义个speed
           var speed=parseInt(_self.getStyle(obj,attr))<target?sped:-sped;
           //parseInt去掉px
            var cur=parseInt(_self.getStyle(obj,attr))+speed;

            // 大于目标速度大于0 或者 小于目标速度小于0
            if(cur>target&&speed>0||cur<target&&speed<0) {
              console.log(speed)
              cur=target;
            }

             obj.style[attr]=cur+"px";
            
            if(cur===target) {
              clearInterval(obj.timer);
              fn&&fn.call(null,cur);
            }

           },50);

      },
     
     /**
      * @desc  物体抖动
      * @desc  用法：shake(obj,'top')
      * @DateTime 2018-04-21
      * @param    {HTML Element}   obj  
      * @param    {String}   attr 'top'等
      * @param    {Function} fn   回调函数

      */
     shake:function(obj,attr,fn) {
          
            //没完成过程中继续点击无效。因为没完成过程中一直为true
            if(obj.off) return; 

            obj.off=true;
            var arr=[],
                _self=this,
                num=0;

            for(var i=20;i>0;i-=2)
            {
               arr.push(i,-i);
            }

            // [20,-20,18,-18...0]
            arr.push(0);

            //不能放在  if(obj.off) return;前面，因为可能过程中就关闭定时器了。
            clearInterval(obj.timer);
            

            //中心点 不变，不要放在定时器里面，有隐患，一直点击会移动位置
            //所以加个开关，过程中点击无效。
            var cur=parseInt(_self.getStyle(obj,attr));

            obj.timer=setInterval(function(){
                 
                 obj.style[attr]=cur+arr[num]+"px";
                 num++;
                 if(num==arr.length) {

                  clearInterval(obj.timer);

                  obj.off=false;
                  fn&&fn.call(obj);
                 }
            },50);
     },
     
     /**
      * @desc  链式运动
      * @desc 用法：move.chainMove(oDiv,'width','300px',function() {
                      move.chainMove(oDiv,'height',300,function() {
                        move.chainMove(oDiv,'opacity',50);
                      });
                   });
      * @DateTime 2018-04-21
      * @param    {HTML Element}   obj    
      * @param    {String}   attr   
      * @param    {Number||String}   target 30 '30px' '30'
      * @param    {Function} fn     回调函数

      */
     chainMove:function(obj,attr,target,fn) {
          clearInterval(obj.timer); 
          var cur=0,
              _self=this;
          
          // 去掉px
          target=parseInt(target);    
          obj.timer=setInterval(function(){
         
          if(attr=='opacity') {

             cur=Math.round(parseFloat(_self.getStyle(obj,attr))*100);
           } else {
  
              cur=parseInt(_self.getStyle(obj,attr));
           }

           // 缓冲运动，速度在变小
          var iSpeed=(target-cur)/8;
          iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);
          // 到达目标值
          if(cur==target) {

            clearInterval(obj.timer);
           //链式运动,有这个函数参数，就执行
             fn&&fn.call(obj);
           } else {    
             if(attr==='opacity') {
               console.log('22')
               obj.style.filter='alpha(opacity:'+(cur+iSpeed)+')';
               obj.style.opacity=(cur+iSpeed)/100;
             } else {
              obj.style[attr]=cur+iSpeed+'px';
             }
           } 
            
          },30);
     },

     /**
      * @desc    四处碰撞广告
      * @desc    用法：move.collision(oDiv);
      * @param    {HTML Element}   obj  
      * @DateTime 2018-04-21
      * @return   {[type]}   [description]
      */
     collision:function(obj) {
          var iSpeedX=10,
              iSpeedY=10;

          // 关闭定时器    
          clearInterval(obj.timer);
          obj.timer=setInterval(function(){
              var L = obj.offsetLeft + iSpeedX;
              var T = obj.offsetTop + iSpeedY;
              
              if(T>document.documentElement.clientHeight - obj.offsetHeight){
                T = document.documentElement.clientHeight - obj.offsetHeight;
                
                iSpeedY *= -1;//由下到右上角，只要y轴速度方向改变
              }
              else if(T<0){
                T = 0;
                iSpeedY *= -1;
              }
              
              if(L>document.documentElement.clientWidth - obj.offsetWidth){
                L = document.documentElement.clientWidth - obj.offsetWidth;
                
                iSpeedX *= -1;//由右边到左上角，x轴速度方向改变即可
              }
              else if(L<0){
                L = 0;
                iSpeedX *= -1;
              }
              
              obj.style.left = L + 'px';
              obj.style.top = T + 'px';
              
              },30);
     },

     /**
      * @desc     抛物线运动
      * @desc     用法：move.parabola(oDiv);
      * @DateTime 2018-04-21
      * @param    {HTML Element}   obj 
      */
     parabola:function(obj) {
           var spedY=-30,
               spedX=10;
           clearInterval(obj.timer);
           obj.timer=setInterval(function(){
            spedY+=3;
            var T=obj.offsetTop+spedY;//速度减少到负数之后开始增加
                                      //先由高到低 ->由低到高
            if(T>document.documentElement.clientHeight-obj.offsetHeight){

              T=document.documentElement.clientHeight-obj.offsetHeight;
              spedY*=-1;
              spedY*=0.75;//摩擦力
              spedX*=0.75;
            }
            obj.style.top=T+'px';
            obj.style.left=obj.offsetLeft+spedX+'px';
           },30);
     },
     

     /**
      * @desc  自由落体运动
      * @desc  用法：move.fall(oDiv)
      * @DateTime 2018-04-21
      * @param    {HTML Element}   obj
      */
     fall:function(obj) {
         // 关闭定时器
         clearInterval(obj.timer);

         var iSpeedY=0;
         obj.timer=setInterval(function(){
          iSpeedY+=3;
          var maxH=document.documentElement.clientHeight-obj.offsetHeight;

          var t=obj.offsetTop+iSpeedY;

          if(t>maxH) {
            t=maxH;
            //改变方向
            iSpeedY*=-1;
            //摩擦力，使其减小到停下
            iSpeedY*=0.75;
          }
          obj.style.top=t+'px';
        },30);
     },
     

   /**
    * @desc   弹性运动之高度菜单 
    * @desc   用法：move.flexHeight(oDiv,'400px');
    * @DateTime 2018-04-21
    * @param    {HTML Element}   obj   
    * @param    {Number||String}   target 300 or'300px'
    */
   flexHeight:function(obj,target) {
      var _self=this;
      clearInterval(obj.timer);
      // 去掉px
      target=parseInt(target);
      obj.speed=0;
      obj.cur=0;
      obj.timer=setInterval(function(){
              obj.cur=parseInt(_self.getStyle(obj,'height'));
              obj.speed+=(target-obj.cur)/5;
              obj.speed*=0.7;
              //不需要在增加变量
              if(Math.abs(obj.speed)<=1&&Math.abs(target-obj.cur)<=1)
              {
                 clearInterval(obj.timer);
                 obj.style.height=target+'px';
              }
              else 
              {
                obj.style.height=obj.cur+obj.speed+'px';
              }

      },30);
   },
   

   /**
    * @desc  弹性运动之刚性菜单（改版 弹性菜单）
    * @desc  用法：move.inflexHeight(oDiv,'400px');
    * @DateTime 2018-04-21
    * @param    {HTML Element}   obj    
    * @param    {Number||String}   target 300 or '300px'
    */
   inflexHeight:function(obj,target) {
        clearInterval(obj.timer);
        var _self=this;
        var cur=0;

        // 去掉px
        target=parseInt(target);
        obj.speed=30;
        obj.timer=setInterval(function(){
                // 去掉px
                cur=parseInt(_self.getStyle(obj,'height'));
                obj.speed+=10;//速度增加
                var H=cur+obj.speed;

                //肯定超过 然后等于目标，然后负值 到目标还有一段距离，开始慢慢减速到终点。
                if(H>target)
                {
                   H=target;
                   obj.speed*=-1;//摩擦力向后，拉开与目标距离
                }
                obj.speed*=0.85;//摩擦 使停下来
                if(Math.abs(obj.speed)<=1&&Math.abs(target-cur)<=1)
                {
                   clearInterval(obj.timer);
                   obj.speed=30;//恢复初始速度
                   obj.style.height=target+'px';
                }
                else 
                {
                  obj.style.height=H+'px';
                }

        },30);
   },
    
   /**
    * @desc   原生时间版运动(jq也用这种方法)
    * @desc   用法：move.timeMove(oDiv, {'width':300}, 1500,'linear');
    * @DateTime 2018-04-21
    * @param    {HTML Element}   obj  
    * @param    {object}   json {'width':300,'height':300}
    * @param    {Number}   time 运动时间 毫秒  1500 
    * @param    {String}   fx   Tween里面的函数名
    * @param    {Function} fn   回调函数
    */
   timeMove:function(obj, json, time, fx, fn) {
       //time: 运动时间 fx: 运动形式
       //模仿jq写法
       
       var _self=this;
        // 获取时间
        function now(){
           return (new Date()).getTime();
        }

        var iCur = {}; //json的各个初始值
        var startTime = now();
       
        for(var attr in json){
          iCur[attr] = 0; 

          if(attr == 'opacity'){
            iCur[attr] = Math.round(_self.getStyle(obj, attr)*100);
          } else {
            iCur[attr] = parseInt(_self.getStyle(obj, attr));
          }
        }

        clearInterval(obj.timer)
        obj.timer = setInterval(function(){
          var changeTime = now();
                          //Math里面是time-0，time-Math就等于0-time
                          //startTime - changeTime + time等于time一直减小
          var t = time - Math.max(0, startTime - changeTime + time) //范围：0到time

          for(var attr in json){
            // 调用Tween对象里面方法
            var value = _self.Tween[fx](t, iCur[attr], json[attr] - iCur[attr], time);
                           //t当前时间，b初始值，c变化值，d 需要时间

            if(attr == 'opacity'){
              obj.style.oapcity = value / 100;
              obj.style.filter = 'alpha(opacity=' + value + ')';
            } else {
              obj.style[attr] = value + 'px';
            }
          }

          if(t == time){
            clearInterval(obj.timer);
            fn&&fn.call(obj);
          }

        }, 13);
   },
   
   /**
    * 动画对象
    */
   Tween:{
          //t: 当前时间 b: 初始值 c: 变化量 d: 持续时间
          //return: 返回的是运动到的目标点
          linear: function (t, b, c, d){  //匀速
            return c*t/d + b;
          },
          easeIn: function(t, b, c, d){  //加速曲线
            return c*(t/=d)*t + b;
          },
          easeOut: function(t, b, c, d){  //减速曲线
            return -c *(t/=d)*(t-2) + b;
          },
          easeBoth: function(t, b, c, d){  //加速减速曲线
            if ((t/=d/2) < 1) {
              return c/2*t*t + b;
            }
            return -c/2 * ((--t)*(t-2) - 1) + b;
          },
          easeInStrong: function(t, b, c, d){  //加加速曲线
            return c*(t/=d)*t*t*t + b;
          },
          easeOutStrong: function(t, b, c, d){  //减减速曲线
            return -c * ((t=t/d-1)*t*t*t - 1) + b;
          },
          easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
            if ((t/=d/2) < 1) {
              return c/2*t*t*t*t + b;
            }
            return -c/2 * ((t-=2)*t*t*t - 2) + b;
          },
          elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
            if (t === 0) { 
              return b; 
            }
            if ( (t /= d) == 1 ) {
              return b+c; 
            }
            if (!p) {
              p=d*0.3; 
            }
            if (!a || a < Math.abs(c)) {
              a = c; 
              var s = p/4;
            } else {
              var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
          },
          elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
            if (t === 0) {
              return b;
            }
            if ( (t /= d) == 1 ) {
              return b+c;
            }
            if (!p) {
              p=d*0.3;
            }
            if (!a || a < Math.abs(c)) {
              a = c;
              var s = p / 4;
            } else {
              var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
          },    
          elasticBoth: function(t, b, c, d, a, p){
            if (t === 0) {
              return b;
            }
            if ( (t /= d/2) == 2 ) {
              return b+c;
            }
            if (!p) {
              p = d*(0.3*1.5);
            }
            if ( !a || a < Math.abs(c) ) {
              a = c; 
              var s = p/4;
            }
            else {
              var s = p/(2*Math.PI) * Math.asin (c/a);
            }
            if (t < 1) {
              return - 0.5*(a*Math.pow(2,10*(t-=1)) * 
                  Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
            }
            return a*Math.pow(2,-10*(t-=1)) * 
                Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
          },
          backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
            if (typeof s == 'undefined') {
               s = 1.70158;
            }
            return c*(t/=d)*t*((s+1)*t - s) + b;
          },
          backOut: function(t, b, c, d, s){
            if (typeof s == 'undefined') {
              s = 3.70158;  //回缩的距离
            }
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
          }, 
          backBoth: function(t, b, c, d, s){
            if (typeof s == 'undefined') {
              s = 1.70158; 
            }
            if ((t /= d/2 ) < 1) {
              return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
            }
            return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
          },
          bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
            return c - Tween['bounceOut'](d-t, 0, c, d) + b;
          },       
          bounceOut: function(t, b, c, d){
            if ((t/=d) < (1/2.75)) {
              return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
              return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
            } else if (t < (2.5/2.75)) {
              return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
            }
            return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
          },      
          bounceBoth: function(t, b, c, d){
            if (t < d/2) {
              return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
            }
            return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
          }
        }
         

  };
  win.move=move;
})(window||{});