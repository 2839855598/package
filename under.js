(function(){
    
    "use strict";
	 // 在浏览器下是window, 在Node里面是global
	  var root=typeof self == 'object' && self.self === self && self ||
             typeof global == 'object' && global.global === global && global ||
             this;
    
    // 保存之前的全局作用域下的_,如果不存在为undefined
    var prevUnder=root._;     

    var ArrayProto=Array.prototype,
        FuncProto = Function.prototype,
        ObjProto=Object.prototype,
        SymbolProto=typeof Symbol!=='undefined' ? Symbol.prototype:null;


    var push=ArrayProto.push,
        slice=ArrayProto.slice,
        toString=ObjProto.toString,
        forEach=ArrayProto.forEach,
        hasOwnProperty=ObjProto.hasOwnProperty;

    // ECMA5 函数    函数下的属性
    var isArray=Array.isArray,
        keys=Object.keys,
        bind=FuncProto.bind,
        create=Object.create;
         
  	var _=function(obj) {
  		// if obj is 实例对象
  		if(obj instanceof _) return obj;

  		// if is not new _(obj), 不是实例对象的话(_([1,3,4]))
  		if(!(this instanceof _)) return new _(obj);

  		// 实例对象的wrapped=obj
  	    this._wrapped=obj;
  	};
  	_.VERSION=1.0;

    
    // Node环境下
    if (typeof exports != 'undefined' && !exports.nodeType) {

	    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
	      exports = module.exports = _;
	    }

	    exports._ = _;

  	// 浏览器环境下    
  	} else {
  	    root._ = _;
    }
    
    
  
    // 根据参数的类型返回不同的回调函数
    var cb=function(value,context) {
        // 参数为undefined或null   _.identity返回自身的函数
    	if(value==null) return _.identity;
         
        // 函数的话
    	if(_.isFunction(value)) {
    		 return function() {
    		 	return  value.apply(context,arguments);
    		 }
    	}
        
        // {}这种类型
    	if(_.isPlainObj(value)) return _.matcher(value);
        
        // 'name'这种 基本类型的
    	return _.property(value);
    }
    
    // 迭代器，通过cb返回回调函数
    _.iteratee=function(value,context) {
    	 return cb(value,context);
    }  
    

    // 集合部分
    // 
    // 
    // 
    // 
    // 
    
    // 遍历
    _.each=_.forEach=function(obj,callback) {
         var length,
              keys,
              i=0;
         // 伪数组都可以遍历     
         if(_.isArrayLike(obj)) {
            length=obj.length;
            for(;i<length;i++) {
                if(callback.call(obj[i],i,obj[i])===false) {
                  
                    break;
                }
            }

         // 如果是{}这种类型   
         } else {
         	keys=_.keys(obj);
         	for(var i=0,len=keys.length;i<len;i++) {
         		if(callback.call(obj[keys[i]],keys[i],obj[keys[i]])===false) {
                    break;
                }
         	}    
         }
         // 返回原来数组或对象
         return obj;     
    }

    // obj是 [{},{}] or {"name":"li","age":23}
    // iteratee是回调函数
    // 用法：除了标准的map之外
    //      .map([1,3,5]) =>[1,3,5]
    //      .map([{"name":"wang"},{"name":"zhang"}],"name") => ["wang","zhang"]
    //      .map([{"name":{"small":"hei"}}], ["name","small"]) => ["hei"]
    //      .map([{"name":"wang","age":23}],{"age":23}) => [true] 
    _.map=function(obj,iteratee,context) {
        iteratee=cb(iteratee,context);
       
        var keys=!_.isArrayLike(obj)&&_.keys(obj),
            // 对象 or 数组
            length=(keys||obj).length,
            result=Array(length);
      
        for(var i=0;i<length;i++ ) {
          var curKey= keys? keys[i]:i;
          result[i]=iteratee(obj[curKey],curKey,obj);
        }    

        return result;

    }
    
    // 迭代顺序
    function createReduce(dir) {
    	// 闭包 迭代器
    	function iterator(obj,iteratee,memo,keys,index,length) {
    		// 两个方向所以需要>=0和<length
    		for(;index>=0&&index<length;index+=dir) {
    			var curKey=keys? keys[index]: index;
    			// 之前的值 当前的值
    			memo=iteratee(memo,obj[curKey],curKey,obj);
    		}
    		return memo;
    	}

    	return function(obj,iteratee,memo,context) {
    		 // {}或者[]
    		 var  keys = !_.isArrayLike(obj) && _.keys(obj),
		          length = (keys || obj).length,
		          index = dir > 0 ? 0 : length - 1;
             
             // 默认初始值没有的话
		     if(memo===undefined) {
		     	// 默认为第一个
                memo = obj[keys ? keys[index] : index];
                // 索引变为第二个
                index += dir;
		     }     

		     // 调用迭代器
		     return iterator(obj,iteratee,memo,keys,index,length);
    	}

    }

    // 迭代 如:累加
    // 用法：
		    /* _.reduce({[1,2,5]},function(memo,val) {
		           return memo+val;
		     })*/
    _.reduce=createReduce(1);
    _.reduceRight=createReduce(-1);
    

    // {} or [] 中 return true 时候对应的值
    _.find=function(obj,predicate,context) {
         var key;
         // 伪数组
         if(_.isArrayLike(obj)) {
          key=_.findIndex(obj,predicate,context);

         // 对象{}
         } else {
           key=_.findKey(obj,predicate,context);
         }
        
        // 返回数组 or 对象中的值
        if(key !== void 0 && key !== -1) return obj[key]; 
    }
    
    
    // 打乱数组顺序
    _.shuffle=function(arr) {
    	
       if(_.isArray(arr)) {
         arr.sort(function() {
          	 return 0.5-Math.random();
          });
       }
       return arr;
    }
    
    // 集合每一项都得满足
    _.every=function(obj,fn,context) {
      fn=cb(fn,context);
      var keys=!_.isArrayLike&& _.keys(obj),
          length=(keys||obj).length;
      
      for(var i=0;i<length;i++) {
      	  var curKey=keys? keys[i]: i;

      	  if(!fn(obj[curKey],curKey,obj)) return false;
      }
      return true;
    }
    
    // 有一项满足就 return true
    _.some=function(obj,fn,context) {
    	  fn=cb(fn,context);
    	  var keys=!_.isArrayLike&& _.keys(obj),
              length=(keys||obj).length;
	      
	      for(var i=0;i<length;i++) {
	      	  var curKey=keys? keys[i]: i;

	      	  if(fn(obj[curKey],curKey,obj)) return true;
	      }
	      return false;
    }

    // 返回集合中的个数
    // [] or {}
    _.size=function(obj) {
       if(obj==null) return 0;

       return _.isArrayLike(obj) ? obj.length : _.keys(obj).length;
    }
    
    
    // 对多个数组 调用同一个方法，返回多个数组的集合
    // var random=function() {
    //    return [].sort.call(this,function() {
    //      return 0.5-Math.random();
    //    })
    //  }
    // _.invoke([[1,3,5],[2,4,6]],random); 乱序
    _.invoke =function(obj,method) {
       var args=slice.call(arguments,2);
       var isFun=_.isFunction(method);
       return _.map(obj,function(arr) {
         var fun= isFun ? method : arr[method];
         return fun == null ? fun : fun.apply(arr,args);
       })
    }
    
    // 数组最大值 or 多个对象中 某个属性最大值 返回对应的对象
    _.max=function(obj,iteratee,context) {
       var result=-Infinity,
           lastComputed=-Infinity,
           value,computed;
       
       // 数组情况
       if(obj != null && iteratee === undefined) {
          for(var i=0,length=obj.length;i<length;i++) {
            value=obj[i];
            if(value > result) {
              result=value;
            }
          }

       // [{name: 'moe', age: 40}, {name: 'larry', age: 50}]
       // function(stooge){ return stooge.age; }
       // return  对象
       } else {
          iteratee=cb(iteratee,context);
          _.each(obj,function(index,value,list) {
            computed=iteratee(value,index,list);
            if(computed > lastComputed || computed === -Infinity) {
              // value是对象
              result=value;
              lastComputed=computed;
            }
          });
       }

       return result;    
    }
   
   // 数组最小值 or 多个对象中 某个属性最小值 返回对应的对象
    _.min=function(obj,iteratee,context) {
       var result=Infinity,
           lastComputed=Infinity,
           value,computed;
       
       // 数组情况
       if(obj != null && iteratee === undefined) {
          for(var i=0,length=obj.length;i<length;i++) {
            value=obj[i];
            if(value < result) {
              result=value;
            }
          }

       // [{name: 'moe', age: 40}, {name: 'larry', age: 50}]
       // function(stooge){ return stooge.age; }
       // return  对象
       } else {
          iteratee=cb(iteratee,context);
          _.each(obj,function(index,value,list) {
            computed=iteratee(value,index,list);
            if(computed < lastComputed || computed === Infinity) {
              // value是对象
              result=value;
              lastComputed=computed;
            }
          });
       }

       return result;    
    }

    // {} or [] 中是否包含某个值
    // 如果obj 是{}，target是属性值
    _.contains=_.include=function(obj,target,fromIndex) {
       if(!_.isArrayLike(obj)) obj=_.values(obj);
       return _.indexOf(obj,target,fromIndex) >-1;
    }


    // 把数组，伪数组，{}转为数组
    _.toArray=function(obj) {
      if(!obj) return [];
      // 数组
      if(_.isArray(obj)) return slice.call(obj);
      // 伪数组 {0:2,length:1} dom集合 arguments
      if(_.isArrayLike(obj)) return _.map(obj,_.identity);
      // {}
      return _.values(obj);
    }

    
    // 过滤出 true的
    _.filter=function(obj,fn,context) {
      var arr=[];
      fn=cb(fn,context);
      _.each(obj,function(i,val,list) {
         if(fn(val,i,list)) arr.push(val);
      });
      return arr;
    }
    
    // 过滤出 false的
    _.reject=function(obj,fn,context) {
        return _.filter(obj,_.negate(fn),context);
    }

    // 数组部分
    // 
    // 
    // 
    // 
    // 
    

    // 默认返回数组第一个，或者前n个
    _.first=function(arr,n) {
      var length=arr.length;
      if(arr == null) return void 0;
      // 默认返回数组第一个
      if(n === undefined) return arr[0];
        
      return slice.call(arr,0, Math.max(1,Math.min(n,length)));
    }
   
   // 默认返回数组最后一个，否则 最后n个
    _.last=function(arr,n) {
      var length=arr.length;
      if(arr == null) return void 0;
      if(n === undefined) return arr[length-1];

      return slice.call(arr,length-n < 0 ? 0:length-n ,length);
    }
  
  // 返回 除前n个 后面的所有
    _.rest=function(arr,n) {
      var length=arr.length;
     if(arr && typeof n === 'number') {
      return slice.call(arr,n > length ? length : n,length);
     }
    }

   // 过滤掉 可能为false 后 所有 true的 新数组
   // false, null, 0, "", undefined 和 NaN 都是false值
   _.compact=function(arr) {
     return _.filter(arr,_.identity);
   } 
   
   
   // 数组去重
   _.reRepeat=function(arr) {
      var array=[],
          obj={};
      
      if(arr&&_.isArrayLike(arr)) {
         for(var i=0,length=arr.length;i<length;i++) {
            if(!obj[arr[i]]) {
                obj[arr[i]]=true;
                array.push(arr[i]);
            }
         }
      }
      return array;
          
   }

   
   // 数组中某个元素出现次数
   _.countEle=function(arr,target) {
      var length=_.isArrayLike(arr) && arr.length,
          number=0;

      if(target !== undefined) {
         for(var i=0;i<length;i++) {
           if(arr[i] === target) {
             number++;
           }
         }
      } 
      return number;   
   }

   // 数组中 元素出现次数最多的元素
   _.getMoreEle=function(arr) {
    var array=[],
        obj={},
        key;

    for(var i=0,length=arr.length;i<length;i++) {
        key=arr[i];
        if(obj[key]) {
           obj[key]++;
        } else {
           obj[key]=1;
        }
        　
    }     

    for( var attr in obj) {
       array.push({key:attr,count:obj[attr]});
    }

    // 降序
    array.sort(function(a1,a2) {
      return a2.count-a1.count;
    });

    return array.slice(0,1);
   }


    var createIndexFinder=function(dir) {
      return function(array,predicate,context) {
        predicate=cb(predicate,context);
        var length=array&&array.length;
        // 根据方向，设置起始索引
        var index= dir>0 ? 0 : length-1;
        for(; index>=0 && index<length;index+=dir) {
           // 第一个 return true 时候对应的索引
           if(predicate(array[index],index,array)) return index;
        }
        return -1;
      }
    }
    
    // function(array,predicate,context) 第二个参数是函数，返回true对应的索引
    _.findIndex=createIndexFinder(1);
    _.findLastIndex=createIndexFinder(-1);

    // 查找目标所在数组索引
    _.indexOf=function(arr,target,index) {
      var i,
          length=arr.length;
      
      // undefined为0
      index=index >>0;
      i=index<0? Math.max(0,length+index) : Math.min(index,length);

      // NaN情况
      if(target!==target) {
        return _.findIndex(arr,_.isNaN);
      }
      for(;i<length;i++) {
        if(arr[i]===target) {
          return i;
        }
      }
      return -1;
         
    }

   // 函数部分
   // 
   // 
   // 
   // 
   // 
   
   var Ctor=function() {};
   
   // 相当于Object.create(prototype)
   var baseCreate=function(prototype) {
     if(!_.isObject) return {};
     
     // 如果支持 Object.create
     if(create) return create(prototype);

     // 不支持的话
     Ctor.prototype=prototype;
     var result=new Ctor;
     return result;
   }


   // 用来判断 绑定后的新函数，是用 boundFunc()执行，还是new boundFunc()
   // callingContext是运行boundFunc时候的上下文，context是要待绑定的上下文
   var executeBound=function(sourceFunc,boundFunc,context,callingContext,args) {
     // 不是实例调用方法，即boundFunc() 这种情况
     if(!(callingContext instanceof boundFunc)) return sourceFunc.apply(context,args);
     // 通过 new boundFunc()调用的话，
     // return 的是 sourceFunc的实例或者sourceFunc返回 Object类型的值
     var self=baseCreate(sourceFunc.prototype);
     var result=sourceFunc.apply(self,args);
     // 如果原函数有返回 Object类型的值
     if(_.isObject(result)) return result;
     // 没有就返回原函数实例对象
     return self;
   }
   
   // 绑定函数上下文
   _.bind=function(func,context) {
     // 如果支持bind方法
     if(bind && func.bind === bind) return bind.apply(func,slice.call(arguments,1));
     // 非函数
     if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');

     var args=slice.call(arguments,2);
     // 新函数
     var bound=function() {
        // this是指 bound 运行时候的上下文
        return executeBound(func,bound,context,this,args.concat(slice.call(arguments)));
     }
     return bound;
   }

   
   // 把某个方法始终绑定到某个对象中，前提 对象中已经有这个方法，防止方法中this的改变
   // 比如 var result=obj.fn;
   //      fn() 一般情况下this改变了，但_.bindAll之后，fn中的this还是obj
   //      固定 this
   _.bindAll=function(obj) {
      var length=arguments.length,
          i,key;
      if (length <= 1) throw new Error('bindAll must be passed function names');
      for(i=1;i<length;i++) {
         key=arguments[i];
         obj[key]=_.bind(obj[key],obj);
      }
     return obj;
   }


   // 缓存函数处理结果，如果下次执行有的话直接返回，hasher是对传入的key处理，默认没有 
   _.memoize=function(func,hasher) {
        var memoize=function(key) {
           var cache=memoize.cache;
           var address=''+ (hasher ? hasher.apply(this,arguments): key);
           // 第一次走这里
           if(!_.has(cache,address)) {
             cache[address]=func.apply(this,arguments);
          
           }
            
           return cache[address];
        }

        memoize.cache={};
        return memoize;
   }
   
   // 只能调用一次，重复调用 返回第一次调用结果
   _.once=function(func) {
    var time=1,
        result;
    return function() {
       if( time-- >0) {
         result=func.apply(this,arguments);
       } else {
         func=null;
       }
                
 
       return result;
    }
   }

   var createFnSort=function(randomFn,fn) { 
         return function() {
             randomFn.call(this,arguments);
             return fn.call(this,arguments);
         }
   }
   
   // 在第一个函数之前执行
   _.fnBefore=function(afterFn,beforeFn) {
       return createFnSort(beforeFn,afterFn);
   }
   
   // 在第一个函数之后执行
   _.fnAfter=function(beforeFn,afterFn) {
      return createFnSort(beforeFn,afterFn);
   }

    // 取反操作
    _.negate=function(predicate) {
       return function() {
         return !predicate.apply(this,arguments);
       }
    }
   
   
   
   // 函数节流，
   // 应用：
   //      1 window.resize,scroll等事件，如果用户快接近底部时，
   //        我们应该发送请求来加载更多内容到页面。
   //        
   //      2.如果用户在 30s 内 input 输入非常快，但你想固定每间隔 5s 就进行一次某个事情。
   // 
   // 采用时间戳是: 立即执行，移出不执行， 
   // 采用定时器是: 不是立即执行，移出在执行一次

    // 默认没有options时候，鼠标移入立即触发，当鼠标离开的时候，还会执行一次函数
    //   1.now刚开始为时间戳 如1532873001609，结果肯定remaining < 0，所以第一次立即执行 [函数]
    //   2.接着previous=now，为当前时间戳，不停的触发事件 走 else, remaining > 0 ，开启定时器，
    //   3.然后 定时器和if其中之一执行，谁执行都不影响，都执行 else or if都没影响
    //     
    //     
    //     相当于 if(执行函数) -> else or if -> else or if
    //     
    // options.leading为false的话，表示鼠标移入时候 不立即触发 [函数]
    //   1.   leading为false，previous = now，则remaining >0 走 else，触发[函数]
    //   2.   previous=0，不停触发函数，执行else，继续按照 wait时间执行定时器，基本上不执行 
    //        if了，不好说，if和定时器不知道哪个更快执行
    //        
    //     相当于 else(执行函数) -> else(执行函数)  -> else(执行函数) 
    // options.trailing === false  表示鼠标离开后不会执行一次 [函数]
    //    1. 因为   trailing为false不会走 else了，一直走的是 if  
    //    
    //     相当于 if(执行函数) -> if(执行函数) -> if(执行函数)
    //     
    //     leading和trailing可以同时用。
    _.throttle=function(func, wait,options) {
      var context, args,result;

      var previous = 0,
          timeout=null;
        
        if(!options) options={};

        var later=function() {
       
          // 0表示立即触发，因为wait-时间戳 肯定小于0
          // Now表示还是按照 wait触发
          //   再次触发throttle时候,有参数,leading为false，previous=now,再次移入并不会立即触发
          //   再次触发throttle时候,没有参数,leading为 _.now()，再次移入会立即触发
          previous=options.leading === false ? 0 : _.now();
        
          timeout=null;
          result=func.apply(context,args);
          // 释放内存
          context=args=null;
        }
      return function() {
          // 当前时间戳
          var now = _.now();
          context = this;
          args = arguments;

          // 没参数忽略这句
          // 有参数只是第一次执行
          if (!previous && options.leading === false) previous = now;
          
          // 函数执行倒计时
          var remaining = wait - (now - previous);

          // 刚开始肯定 < 0  remaining > wait是修改了本地时间
          if (remaining < 0 || remaining > wait) {
            // 执行这里的时候，不会执行定时器任务
          
            if(timeout) {
              clearTimeout(timeout);
              timeout=null;
            }

            // 保存为当前时间戳
            previous=now;
              func.apply(context, args);
              if(!timeout) context=args=null;


            // 没参，options.trailing为undefined！==false
          } else if(!timeout && options.trailing !== false) {
                  
                timeout=setTimeout(later, remaining);
          }
          return result;
        }
    }


   // 防抖动, >= wait才触发函数,如果在[0，wait]之间再次触发，重新设置定时器
   // 相当于等电梯，如果有人进来，重新等，直到大于wait，电梯才会升降
   // 
   // immediate为true,表示开始边界立即执行函数，如果间隔时间大于wait，timeout=null，再次触发事件时候，
   // 又在开始边界执行
   // 
   // 应用：1.当窗口停止改变大小之后重新计算布局
   //       2.在进行input校验的时候，“你的密码太短”等类似的信息。
   //       3.AutoComplete中的Ajax请求使用的keypress
   //       4.比如在点击按钮后200ms内提交，连续点击两次按钮，只会执行一次，且时间往后延迟了
   //         可能在220ms后提交
   //    如果在指定wait之内再次触发，只会重新设置定时器，直到最后再次触发事件，时间间隔
   //    大于wait，相当于最后执行一次后，不在触发事件，空闲时间就大于了wait,就会触发函数   
   
   _.debounce=function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      // 距离上次触发debounce的间隔
      var last = _.now() - timestamp;
      
      // 在[0,wait]内再次触发事件，肯定last < wait,重新设置定时器
      if (last < wait && last >= 0) {
        // wait - last 让下次等待的时间短点, 也可以设置为 wait
        timeout = setTimeout(later, wait - last);
      } else {
        
        // 有参数只会执行这一句
        timeout = null;
        // 默认没有参数，会执行下面
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      // 有参数会执行，没参数忽略
      var callNow = immediate && !timeout;
      // 有参数会 先执行函数，在执行一下定时器
      // 没参数只会执行定时器，不会执行callNow
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
   }

   // 限制调用次数，多出次数的返回最后一次结果
   _.before=function(times,func) {
      var memo;
      return function() {
          if(--times >= 0) {
             memo=func.apply(this,arguments);
          }
          
          // 超出次数的 调用
          if(times<1) func=null;
          return memo;
      }
   }
   
   // 直到最后一次才执行
   // 处理同组异步请求返回结果时, 如果你要确保同组里所有异步请求完成之后才 执行这个函数, 
   // 这将非常有用
   _.after=function(times,func) {
     return function() {
        if(--times<1) {
          return func.apply(this,arguments);
        }
     }
   }
   // 延迟执行某个函数
   _.delay=function(func,wait) {
     var args=slice.call(arguments,2);
     return setTimeout(function() {
       return func.apply(null,args);
     },wait);
   }
   
   // 对象部分
   // 
   // 
   // 
   // 
   //
   
    // 获得对象 key的集合 ，兼容所有浏览器
    // support {} or []
    _.keys=function(obj) {
      if(!_.isObject(obj)) return [];

      if(keys) return keys(obj);

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

    // 返回{}的value集合
    _.values=function(obj) {
      var keys=!_.isArrayLike(obj) && _.keys(obj),
          length=keys.length,
          arr=Array(length);
      for(var i=0;i<length;i++) {
        arr[i]=obj[keys[i]];
      }    
      return arr;
    }


   // 类似数组中的map方法，对对象做处理
    _.mapObject=function(obj,iteratee,context) {
      iteratee=cb(iteratee,context);
      var keys=_.keys(obj),
          length=keys.length,
          result={},
          currentKey;

      for(var i=0;i<length;i++) {
         currentKey=keys[i];
         result[currentKey]=iteratee(obj[currentKey],currentKey,obj);
      }    

      return result;
    }
    
    // 找到对象{} 中第一个return true的 key
    _.findKey=function(obj,predicate,context) {
      predicate=cb(predicate,context);
      var keys=obj&&_.keys(obj),
          length=keys.length;
      
      for(var index=0;index<length;index++) {
         var curKey=keys[i];
         // 第一个 return true 的 key
         if(predicate(obj[curKey],curKey,obj)) return key;
      }

    } 

    // 对象类型
    var typeArray=["Boolean","Number","String","Function","Array","Date",
                   "RegExp","Object","Error"];
    var classType=[];

    typeArray.forEach(function(val,i) {
      classType["[object "+val+"]"]=val.toLowerCase();
    });

    // 判断对象类型
    _.type=function(obj) {
        // if is  undefined or null
        if(obj==null) {
            return String(obj);
        }

        // 对象类型或基本类型
        // 更简便方法{}.toString.call(obj).slice(7,-1).toLowerCase()
        return typeof obj==="object"?classType[toString.call(obj)]:
               typeof obj; 
    }

    // 判断是否是window对象
    _.isWindow=function(obj) {
       // 除了undefined或者null 之外的类型才能通过第一个判断
       return obj!=null &&obj===obj.window;
    }
    
    // 判断是否是伪数组，
    // array,{0:"a",1:"b",length:2},arguments,
    // NodeList,HTMLCollection 都满足
    _.isArrayLike=function(obj) {
         var length=!!obj&& "length" in obj &&obj.length,
         // NodeList,HTMLCollection,arguments都有length属性
             typeOn=_.type(obj);
        
         // 为什么要判断window，因为在全局上设置 var length=10,
         // 会挂载到window上，window.length=10了
         // function 也有length，是形参的个数
         if(_.isWindow(obj)||typeOn==='function') {
            return false;
         }    
        
         // (length-1) in obj 来排除{length:10}这种情况
         // array,{0:"a",1:"b",length:2},arguments,
         // NodeList,HTMLCollection
         return typeOn==='array'|| (length===0|| typeof length==='number'&&length>0
                    &&(length-1) in obj);
    }
    
    // 使实例对象也能使用数组方法
    // 等价于 _([1,3,5]).push == [1,3,5].push
    _.each(['pop','push','reverse','shift','sort','splice','unshift'],function(i,name) {
    	var method=ArrayProto[name];
    	_.prototype[name]=function() {
    		var obj=this._wrapped;
    		method.apply(obj,arguments);

    		// 支持链式调用
    		return chainResult(this,obj);
    	}
    })
    
    // 使实例对象也能使用数组方法
    _.each(['concat','join','slice'],function(i,name) {
        var method=ArrayProto[name];
        _.prototype[name]=function() {
        	return chainResult(this,method.apply(this._wrapped,arguments));
        }
    });

    // 克隆数组 or 对象
    _.clone=function(obj) {
      if(!_.isObject(obj)) return obj;
      
      return _.isArray(obj) ? slice.call(obj) : _.extend({},obj);
    } 
    
    // 将多个对象的某一个属性的值，提取成一个数组
    // [{name : 'moe', age : 40}, {name : 'larry', age : 50}] => ['moe','larry']
    _.pluck=function(obj,key) {
       return _.map(obj,_.property(key));
    }


    // 把对象中的 键值对 转为数组
    // _.pairs({one: 1, two: 2, three: 3}) -> [["one", 1], ["two", 2], ["three", 3]]
    _.pairs=function(obj) {
       var keys=_.keys(obj),
           length=keys && keys.length,
           result=[];

       for(var i=0;i<length;i++) {
          result[i]=[keys[i],obj[keys[i]]];
       }    

       return result;
    }

    // 从对象中挑选出某个部分， 返回对象格式
    _.pick=function(obj,iteratee,context) {
        var result={},
            keys;

        if(obj == null) return {};
        // 如果是_.pick({name: 'moe', age: 50},function(val,key,obj){})
        if(_.isFunction(iteratee)) {
          keys=_.keys(obj);
          iteratee=cb(iteratee,context);

        // if is  _.pick({name: 'moe', age: 50},'name','age')
         
        } else {
          // 第二个往后所有的参数
           keys=slice.call(arguments,1);
           iteratee=function(val,key,obj) {return key in obj};
          
        }    
        
        // 最终都把iteratee 转为函数
        for(var i=0,length=keys.length;i<length;i++) {
           var curKey=keys[i];
           if(iteratee(obj[curKey],curKey,obj)) result[curKey]=obj[curKey];
        }

        return result;
    }

    // _.pick的取反操作
    _.omit=function(obj, iteratee, context) {
       if(_.isFunction(iteratee)) {
         iteratee=_.negate(iteratee);
       } else {
         var keys=slice.call(arguments,1);
         iteratee=function(val,key) {
           return !_.contains(keys,key);
         }
       }
       return _.pick(obj,iteratee,context);
    }
    


    // extend继承，jq中写法
    _.extend=function() {
            var src,copy,option,key,copyIsArray,
                target=arguments[0]||{},
                len=arguments.length,
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
            if(typeof target!=="object" && !_.isFunction(target)) {
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
              if(deep&&copy&&(_.type(copy)==='object'||
                (copyIsArray=(_.type(copy)==='array')))) {
                       //是数组
                       if(copyIsArray) {
                          copyIsArray=false;
                          clone=src && _.type(src)==='array'?src:[];
                       }
                       //是对象
                       else {
                          clone=src && _.type(src)==='object' ? src:{};
                       }
                        
                       //递归
                       target[key]=_.extend(deep,clone,copy);
                    } else if(copy!==undefined) {
                      //浅拷贝
       
                      target[key]=copy;
                    }
                 }
               }
            }
            //返回target
            return target;
   }

     // 把对象的 键值对 互换过来
    _.invert=function(obj) {
      var keys=obj && _.keys(obj),
          result={},
          length=keys.length;

      for(var i=0;i<length;i++) {
         var curKey=keys[i];

         result[obj[curKey]]=curKey;
      }    

      return result;
    }

       // 包含对象中所有的函数集合
    _.functions=_.methods=function(obj) {
      var arr=[];
      for(var attr in obj) {
        if(_.isFunction(obj[attr])) {
          arr.push(attr);
        }

      }
      return arr.sort();
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

    _.defaults=createAssigner(_.keys,true);


  

    // 是否有某个属性
   _.has=function(obj,key) {
     return obj != null && hasOwnProperty.call(obj,key);
   } 

   // 匹配对象
   _.matcher=function(value) {
       // 拷贝一份
       value=_.extend({},value);
       return function(obj) {
           // obj是否包含value
           return _.isMatch(obj,value);
       }
    }

  // 浅获取对象属性  如{"name":"wangli"}
  var shallowProperty=function(key) {
     return function(obj) {
      return obj==null? void 0: obj[key];
     }
  };

  // 深获取对象属性 如{"name":{"smallName":"hay"}} ["name","smallName"]
  var deepGet=function(obj,path) {
     var length=path.length;
     for(var i=0;i<length;i++) {
      if(obj==null) return void 0;
      obj=obj[path[i]];
     }

     return length ? obj : void 0;
  };


  // 获取属性
  _.property=function(value) {
       // 不是数组
       if(!_.isArray(value)) return shallowProperty(value);

       // 是数组
       return function(obj) {
         return deepGet(obj,value);
       }
    }

  // obj是否包含attrs中属性 obj是 {}类型
  _.isMatch=function(obj,attrs) {
       var keys=_.keys(attrs),
           length=keys.length;
       
       // undefined or null
       if(obj==null) return false;    

       var obj=Object(obj);
       for(var i=0;i<length;i++) {
          var currentKey=keys[i];
          if(attrs[currentKey]!==obj[currentKey] ||!(currentKey in obj)) {
            return false;
          }
       }
       return true;
   }  
  
    // array,string,{}, null, undefined  is empty
    _.isEmpty=function(obj) {
      // undefined or null
      if(obj == null)  return true;
      // [],'',arguments
      if( _.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
      // {}
      return _.keys(obj).length === 0;
    }
    
    // 增加一些方法
    _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'],function(i,name) {
        _['is'+name]=function(obj) {
           return _.type(obj)===name.toLowerCase();
        }
     });

      // 是否是函数
    _.isFunction = function(obj) {
      return typeof obj === 'function' || false;
    };

    // 是否为dom元素
    _.isElement=function(obj) {
      return !!(obj && obj.nodeType===1);
    }

    // 是否为纯数字
    _.isFinite=function(obj) {
      return isFinite(obj) && !isNaN(parseFloat(obj));
    }
   
   // 是否为NaN
    _.isNaN=function(obj) {
      // 相当于 if(typeof obj==='number' && isNaN(obj));
      // obj.length===+obj.length 相当于 if(typeof obj.length==='number' &&!isNaN(obj.length))
      return obj !== +obj;
    }
   
   // 是否为boolean
    _.isBoolean=function(obj) {
       return _.type(obj)==='boolean';
    }

   // 是否为null
   _.isNull=function(obj) {
      return obj===null;
   } 

   // 是否为undefined
   _.isUndefined=function(obj) {
     return obj === void 0;
   }

    // function , {},[]等
   _.isObject=function(obj) {
      var type=typeof obj;
        // !!obj  if obj is null  为false
      return type==="function"|| type==="object"&&!!obj;
    }

    // {} or new Object()
   _.isPlainObj=function(obj) {
        // 基本类型 或者dom节点或者window
        if(_.type(obj)!=='object'||obj.nodeType||_.isWindow(obj)) {
          return false;
        }
        
        // window.location或者 [1,23]这种
        // 只有Object.prototype有isPrototypeOf属性，其他的原型没有
        if(obj.constructor&&!hasOwnProperty.call(obj.constructor.prototype,"isPrototypeOf")) {
          return false;
        }
        // {} or new Object() 这种对象
        return true;
    }
      
    // 兼容所有浏览器
   _.isArray=isArray||function(obj) {
      return _.type(obj)==='array';
    }

    // 实用部分
    // 
    // 
    // 
    // 
    // 
    //

    // 防止 _冲突
    _.noConflict=function() {
      // 把全局(window)下的_注销掉
      // 如果前面已经有了_,则prevUnder是之前的值，
      // 如果前面没有_,则prevUnder为undefined
      root._=prevUnder;
      // 返回函数
      // var user=_.noConflict(),即window.user=函数(_) 
      // 此时闭包里面的_全部变成了user, 即 user.VERSION=1.0 
      // root.user=user; 全局下可以继续使用user来代替_操作函数
      return this;
    }


    var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
        };

    // 把键值对互换过来
    var unescapeMap=_.invert(escapeMap); 

    var createEscaper=function(map) {
        // 在正则里面是 匹配到的值
        var escaper=function(match) {
            return map[match];
        }

        var source='(?:'+_.keys(map).join('|')+')';
        var testReg=RegExp(source);
        var replaceReg=RegExp(source,"g");
        return function(str) {
           str= str == null ? '' : ''+str;
           // 
           return testReg.test(str) ? str.replace(replaceReg,escaper) : string;
        }
    };   
    
    // 转义HTML字符串，替换&, <, >, ", ', 和 / 字符     
    _.escape = createEscaper(escapeMap);
    // 转义HTML字符串，替换&, &lt;, &gt;, &quot;, &#96;, 和 &#x2F;字符
    _.unescape = createEscaper(unescapeMap);
    

    // 设置默认参数, 惰性模式 ，匹配最少
    _.templateSettings={
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
    /*<%for ( var i = 0; i < users.length; i++ ) { %>
        <li>
            <a href="<%=users[i].url%>">
                <%=users[i].name%>
            </a>
        </li>
    <% } %> */

    // 将 <%=xxx%> 替换成 '+ xxx +'，再将 <%xxx%> 替换成 '; xxx __p+='
    /*';for ( var i = 0; i < users.length; i++ ) { __p+='
        <li>
            <a href="'+ users[i].url + '">
                '+ users[i].name +'
            </a>
        </li>
    ';  } __p+='*/


    // 添加些头尾代码，然后组成一个完整的代码字符串
    
     /*  var __p='';
        with(obj){
        __p+='

        ';for ( var i = 0; i < users.length; i++ ) { __p+='
            <li>
                <a href="'+ users[i].url + '">
                    '+ users[i].name +'
                </a>
            </li>
        ';  } __p+='

        ';
        };
        return __p;*/
    
     // 整理一下就是：
    
     /*var __p='';
      with(obj){
          __p+='';
          for ( var i = 0; i < users.length; i++ ) { 
              __p+='<li><a href="'+ users[i].url + '"> '+ users[i].name +'</a></li>';
          }
          __p+='';
      };
      return __p*/
    _.template=function(text,settings,oldSettings) {
      // 如果有settings，把新的设置+ _temp设置拷贝给{}，
      // 否则，只拷贝_.temp给{}
      settings=_.defaults({},settings,_.templateSettings);
      
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
            source += "'+((t=" + escape + ")==null?'':_.escape(t))+'";

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
        var render=new Function(settings.variable||'obj','_',source);
      } catch(e) {
         e.source=source;
         throw e;
      }
      
      // 每次传入数据直接调用这个方法，省的每次都要创建 new Function
      var template=function(data) {
         return render.call(this,data,_);
      }
      
      // 方便查看 source内容
      var argument=settings.variable|| 'obj';
      template.source='function('+argument+'){\n'+source+'}';

      // 第一次调用返回模板，第二次调用传入数据
      return template;

    }

    
    // 返回本身
    _.identity=function(value) {
      return value;
    }

    // 生成某个区间随机数
    _.random=function(min,max) {
         return Math.floor(Math.random()*(max-min+1)+min);
    }

    // 获取当前时间戳 1532873001609 这样的
   _.now=Date.now ||function() {
        return new Date().getTime();
   }

    // 为需要的客户端模型或DOM元素生成一个全局唯一的id。
    // 如果prefix参数存在， id 将附加给它。
    var idCounter = 0;
    _.uniqueId = function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };


     // 是否支持链式调用
     // _(arr1).chain().each(fn) 或 _.chain(arr1).each(fn)
     // 后面调用的方法必须是 (obj,fn)这种类型的
     // 像_.each(obj,fn)
     
    _.chain=function(obj) {
      var instance=_(obj);
      instance._chain=true;
      return instance;
    }

    
    // 返回_.chain调用的结果，如果为实例对象._chain=true，返回一个
    // 被包装的under对象，否则对象本身
    var chainResult=function(instance,obj) {
      console.log(instance._chain)
      return instance._chain ? _(obj).chain() : obj;
    }
    
    // 链式调用结果就是this._wrapped -> obj
    // 因为每次调用方法前返回的都是新的对象实例
    // 调用value之后不能在继续链式调用，因为不会有包装对象
    // 因为其他的实例方法都是通过调用_下的方法实现的，value不是
    _.prototype.value=function() {
      return this._wrapped;
    }

    
    // 把_函数上的方法都挂载到_的原型上
    // 实例对象就拥有了_的方法
    //  _(obj1).each(fn1) ==   _.each(obj1,fn1)
    //  既可以扩展_上的方法，也可扩展新对象上的方法
    //  如_.mixin(_) 或 
    //   _.mixin({
    //     add:function(){alert(3)}
    //    })
    _.mixin=function(obj) {
       _.each(_.functions(obj),function(i,name) {
           // 当obj是自定义对象，不是_时候
           // obj的方法被扩充到under的方法集合中以及_.prototype上
           var func=_[name]=obj[name];
           _.prototype[name]=function() {
               var args=[this._wrapped];
               // _(args1).func(args2)  == _.func(args1, args2)
               // 右侧func的参数比左侧func的参数多一个，
               // args1,也就是this._wrapped,也就是包装对象
               push.apply(args,arguments);
              
               // 第二个参数是执行完某个方法后返回的结果 res1
               // res1等于 _(obj).chain()中的 obj
               // 当有链式调用：
               //              每次先调用实例方法，最后在调用_(obj).chain()
               // 当没有链式调用：
               //              直接返回 第二个参数的结果
               return chainResult(this,func.apply(_,args));

          }

       });
    }
   // 调用的时候，保证_.mixin必须放在 _.each和_.functions方法后面
   // 要不然找不到_.each等方法
    _.mixin(_);

}.call(this));