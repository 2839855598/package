
//原生时间版运动（jq也是用tween方法）
function startMove(obj, json, time, fx, fn){
  //time: 运动时间 fx: 运动形式,fn 回调函数
 //模仿jq写法
  var iCur = {}; //json的各个初始值
  var startTime = now();

  for(var attr in json){
    iCur[attr] = 0; 

    if(attr == 'opacity'){
      iCur[attr] = Math.round(getStyle(obj, attr)*100);
    } else {
      iCur[attr] = parseInt(getStyle(obj, attr));
    }
  }

  clearInterval(obj.timer);
  obj.timer = setInterval(function(){
    var changeTime = now();
                    // Math里面是time-0，time-Math就等于0-time
                    // (time-time=0,time-0=time)
                    // startTime - changeTime + time等于time一直减小
    var t = time - Math.max(0, startTime - changeTime + time) //范围：0到time

    for(var attr in json){
      var value = Tween[fx](t, iCur[attr], json[attr] - iCur[attr], time);
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
      if(fn){
        fn.call(obj);
      }
    }

  }, 13);
   
  // 获取样式
  function getStyle(obj, attr){
    if(obj.currentStyle){
      return obj.currentStyle[attr];
    } else {
      return getComputedStyle(obj, false)[attr];
    }
  }
   
   // 获取当前时间
  function now(){
    return (new Date()).getTime();
  }

}
/**
 * Tween.js
 * t: current time(当前时间)
 * b:beginning value(初始值)
 * c:change in value(变化量)
 * d:duration (持续时间)
 */
var Tween = {
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
