;(function (w) {
  w.css = function (obj, name, value) {
    if(!obj.transform){
        obj.transform = {}
    }
    if(arguments.length > 2){
      var result = ''
      obj.transform[name] = value
      for (var item in obj.transform) {
        switch (item){
          case 'rotate':
          case 'skewX':
          case 'skewY':
          case 'skew':
            result += item + '(' + obj.transform[name] + 'deg) '
            break
          case 'translateX':
          case 'translateY':
          case 'translateZ':
          case 'translate':
            result += item + '(' + obj.transform[name] + 'px) '
            break
          case 'scale':
          case 'scaleX':
          case 'scaleY':
            result += item + '(' + obj.transform[name] + ') '
            break
        }
      }
      obj.style.webkitTransform = obj.style.transform = result
    }else if(arguments.length = 2){
      value = obj.transform[name]
      if(typeof value == 'undefined'){
          if(name=='scale' || name=='scaleX' || name=='scaleY'){
            value = 1
          }else {
            value = 0
          }
      }
      return value
    }
  };

  w.drag = function (wrap, index, callback) {
    var child = wrap.children[index]
    css(child, 'translateZ', 0.01)
    var minY = wrap.clientHeight - child.offsetWidth
    var start = {}
    var elementY = 0
    // 橡皮筋系数
    var ratio = 1
    // 上一次的位置
    var lastPoint = 0
    // 上一次的时间
    var lastTime = 0
    // 时间差
    var timeV = 1
    // 位置差
    var pointV = 0
    var Tween = {
      // 模拟transtion的贝塞尔去实现回弹
      easeOut: function(t,b,c,d,s){
        if (s == undefined) s = 1.70158;
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
      },
      //模拟transtion的线性
      Linear: function(t,b,c,d){ return c*t/d + b; }
    }

    //防抖动
    var isY = true;
    var isFirst=true;


    wrap.addEventListener("touchstart",function(ev){
      //					解决速度的残留
      pointV =0;
      timeV = 1;
      child.style.transition="none";

      var touch = ev.changedTouches[0];
      start = {
        clientX:touch.clientX,
        clientY:touch.clientY
      };
      elementY = css(child,"translateY");

      lastPoint = start.clientY;
      lastTime = new Date().getTime();

      clearInterval(wrap.clear);

      if(callBack&&callBack["start"]){
        callBack["start"]();
      }

      isY = true;
      isFirst=true;
    })
    wrap.addEventListener("touchmove",function(ev){
      if(!isY){
        return;
      }
      var touch = ev.changedTouches[0];
      var now = touch;
      var disX = now.clientX-start.clientX;
      var disY = now.clientY-start.clientY;

      if(isFirst){
        isFirst=false;
        if(Math.abs(disX)>Math.abs(disY)){
          isY=false;
        }
      }

      var translateY=elementY+disY;
      if(translateY>0){
        //随着ul移动距离越来越大，整个ul移动距离的增幅越来越小
        ratio = document.documentElement.clientHeight/((document.documentElement.clientHeight+translateY)*1.8);
        translateY=translateY*ratio;
      }else if(translateY<minY){
        //右边的留白（正值）
        var over = minY - translateY;
        ratio = document.documentElement.clientHeight/((document.documentElement.clientHeight+over)*1.8);
        translateY=minY-(over*ratio);
      }
      var nowTime = new Date().getTime();
      var nowPoint = now.clientY;;
      pointV = nowPoint - lastPoint;
      timeV = nowTime - lastTime;
      lastPoint = nowPoint;
      lastTime = nowTime;
      css(child,"translateY",translateY);
      //外部的touchmove逻辑
      if(callBack&&callBack["move"]){
        callBack["move"]();
      }
    })

    wrap.addEventListener("touchend",function(){
      var speed = pointV/timeV;
      var addY = speed*200;
      var target= css(child,"translateY")+addY;
      var type="Linear";
      var time =0;
      time = Math.abs(speed)*0.3;
      time =time<0.3?0.3:time;

      if(target>0){
        target=0;
        type="easeOut";
      }else if(target<minY){
        target = minY;
        type="easeOut";
      }

      move(target,time,type);
    })
    function move (target,time,type){
      //		t :当前次数(t从1开始)
      //		b :初始位置
      //		c :目标位置与初始位置之间的差值
      //		d :总次数
      //		s :一般我们不改,它用来抽象回弹距离
      var t=0;
      var b=css(child,"translateY");
      var c=target-b;
      var d=time/0.01;

      //开启循环定时器之前必须清除这个定时器
      //避免重复开启逻辑一样的定时器
      clearInterval(wrap.clear);
      wrap.clear=setInterval(function(){
        t++;
        if(t>d){
          clearInterval(wrap.clear);

          //外部的touchend逻辑
          if(callBack&&callBack["end"]){
            callBack["end"]();
          }
        }else{
          //Tween算法给我们提供了每一帧具体的位置;
          var dis = Tween[type](t,b,c,d);
          //每一帧的运动  dis：每一帧的位置！！！由Twenn算法来提供
          //每一帧的运动本质上没有消耗时间，而是登录20毫秒之后去触发队列里的下一个定时器
          css(child,"translateY",dis);
          if(callBack&&callBack["move"]){
            callBack["move"]();
          }
        }
      },10);
    }
  }
})(window)


