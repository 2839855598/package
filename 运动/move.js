//1.完美运动
function getStyle(obj,attr)
{
	return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];
}
function starMove(obj,json,fn)
{
	clearInterval(obj.timer);
	obj.timer=setInterval(function(){
	 var cur=0;
	 var flag=true;
	 for(var attr in json)
	 {
        if(attr=="opacity")
        {
        	cur=Math.round(parseFloat(getStyle(obj,attr))*100);//parseFloat保存所有数值，Math.round 四舍五入取整。


        }
        else 
        {
        	cur=parseInt(getStyle(obj,attr));
        }
         var speed=(json[attr]-cur)/6; //目标减去当前值
         //为什么用[]不用. 因为 for循环中，attr是变量，变量必须用[],
		 speed=speed>0?Math.ceil(speed):Math.floor(speed);
		 if(cur!=json[attr])  //至少有一样没达到目标值
		 {
		 	    flag=false;
				if(attr=="opacity")
			     {
			     	obj.style.filter="alpha(opacity:"+(cur+speed)+")";
			     	obj.style.opacity=(cur+speed)/100;
			     }
			     else
			     {
			     	obj.style[attr]=cur+speed+"px";
			     }
		 }
	   
	 }
	
	 if(flag) //当所有都实现了，关闭定时器，如果有一样没实现，不关闭定时器。
	 {
	 	clearInterval(obj.timer);
	 	fn&&fn(); //函数存在就执行。
	 }
	},30);
};
