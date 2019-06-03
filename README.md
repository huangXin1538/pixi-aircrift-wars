# aircrift-wars

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### 因为屏幕适配问题，请在移动端打开

## demo 效果地址
http://47.104.9.195:8080/pixi-aircraft-wars/

## 什么是pixi.js
Pixi.js使用WebGL，是一个超快的HTML5 2D渲染引擎。作为一个Javascript的2D渲染器，Pixi.js的目标是提供一个快速的、轻量级而且是兼任所有设备的2D库。提供无缝 Canvas 回退，支持主流浏览器，包括桌面和移动。 Pixi渲染器可以开发者享受到硬件加速，但并不需要了解WebGL。
## 如何引入pixi.js
1.安装模块
代码中引入：import * as PIXI from 'pixi.js';
2.cdn
<script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.5.1/pixi.min.js"></script>

## 创建pixi实例完整流程
1.创建一个应用(application)(包含舞台stage)
2.加载资源（loader）
3.创建游戏场景
4.将场景插入舞台(addchild)
5.把画布插入dom（append）
6.创建精灵（sprite）
7.把精灵加入画布（addchild）
8.刷新舞台（ticker）
9.游戏结束，销毁应用（destroy）

## 1.创建应用
```js
let gameApp = new PIXI.Application({
    width: xxxx,
    height: xxxx,
    antialiasing: true, // 抗锯齿
    transparent: false, // 背景透明
    resolution: 2 // 渲染倍数，避免模糊
});
```

## 2.加载资源
```js
let loader = new PIXI.Loader();
loader
    .add('bg', 'img/bg.jpg')
    .....
    .load((loader, resources) => {
      // 加载完毕回调
      setUp(); //执行创建精灵等操作
    });
```

## 3/4.创建游戏场景并插入舞台
```js
let gameScene = new PIXI.Container();
gameScene.width = xxx;
gameScene.height = xxx;
gameApp.stage.addchild(gameScene);
```

## 5.把画布插入dom
```js
document.getElementById('xxx').appendChild(gameApp.view);
```
## 6.创建精灵并插入场景

首先，为了方便的设定精灵宽高，声明两个方法
```js
function getWidth (precent) {
  let w = document.body.clientWidth > 720 ? 720 : document.body.clientWidth;
  return (precent / 50) * w / 2;
}
function getHeight (precent) {
  let h = document.body.clientHeight;
  return (precent / 50) * h / 2;
}
```

1.背景
```js
let bg = new PIXI.Sprite(resources.bg.texture);
bg.width = xxx;
bg.height = xxx;
bg.x = xxx;
bg.y = xxx;
gameScene.addchild(bg)
```
2.飞机
```js
let plane = new PIXI.Sprite(resources.plane.texture);
plane.width = xxx;
plane.height = xxx;
plane.x = xxx;
plane.y = xxx;
gameScene.addchild(plane)
```
给飞机添加拖动事件，让飞机跟着手指移动。
给飞机添加射击事件，在ticker中调用，使飞机一直发射子弹
3.障碍物
```js
let obstacle  = new PIXI.Sprite(resources.obstacle.texture);
obstacle.width = xxx;
obstacle.height = xxx;
obstacle.x = xxx;
obstacle.y = xxx;
gameScene.addchild(obstacle)
```
这种只是最基础的做法，如果有稍微多一点的需求，例如，碰撞检测的区域，和纹理图大小不一样，就需要
将障碍物纹理、碰撞区域、爆炸动画，都放入一个container内，碰撞区域push进入obstacles数组，去和子弹飞机做碰撞检测
障碍物的飞行，使用tween.js,初始化时候，设置好起点终点，在ticker中update就可以像目的地移动

```js
    let container = new PIXI.Container();
    // 图案
    let obstacle = new PIXI.Sprite(texture.obstacle.texture);
    obstacle.name = 'obstacle';
    obstacle.width = getWidth(30);
    obstacle.height = getWidth(30);
    obstacle.x = 0;
    obstacle.y = 0;
    obstacle.anchor.set(0.5, 0.5);
    // 碰撞区域
    let circle = new PIXI.Sprite();
    circle.width = obstacle.width * 0.5;
    circle.height = circle.width;
    circle.name = 'circle';
    circle.circular = true;
    circle.x = -circle.width*0.5;
    circle.y = -circle.height*0.5;
    container.addChild(circle);
    
    // 文字
    let text = new PIXI.Text('哈哈', {
      fontSize: obstacle.width * 0.13,
      fill: '#fff'
    });
    text.x = - text.width*0.5;
    text.y = - text.height*0.5;
    container.addChild(text);

    // 爆炸效果
    let fireClip = [
    ];
    for (let i = 0; i <= 23; i++) {
      fireClip.push(texture.boom.textures['boom' + i + '.png']);
    }
    let boom = new PIXI.AnimatedSprite(fireClip);
    boom.width = obstacle.width * 2.5;
    boom.height = obstacle.height * 2.5;
    boom.x = -boom.width * 0.5;
    boom.y = -boom.height * 0.5;
    boom.name = 'boom';
    boom.loop = false;
    container.addChild(boom);


    container.addChild(obstacle);
    container.addChild(circle);
    container.x = getWidth(Math.random()*100);
    container.y = -obstacle.height;
   
    // 位移设定
    let tween = new TWEEN.Tween(container)
      .to(
        {
          x: getWidth(Math.random() * 100),
          y: getHeight(100) + obstacle.height,
        },
        obstacleTime // tween持续时间
      )
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(function () {
        // 到底
        container.destroy();
      });
    tween.start();

    // 旋转设定
    let tween2 = new TWEEN.Tween(obstacle)
      .to(
        {
          rotation: -20
        },
        obstacleTime // tween持续时间
      )
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(function () {
      });
    tween2.start();
    // 插入场景
    container.tween = tween;
    obstacles.push(circle);
    tweens.push(tween);
    gameScene.addChild(container);
```
## 7.更新舞台
创建完游戏内所有元素后，开启pixi内置定时器ticker
```js
app.ticker.add(function () {
    return gameLoop();
});
```
在ticker中更新需要调用的事件，来实现游戏的动态效果
```js
function gameLoop(){
  // 生成子弹
  plane.shut(gameScene, bullets);
  // 生成障碍物
  createobstacle(gameScene, texture, obstacles, TWEEN, tweens);
  // 子弹逻辑处理
  bulletsEvents();
  // 障碍物逻辑处理
  obstaclesEvents();
}
```

## 8.子弹飞机障碍物的碰撞逻辑（重点）
```js
function bulletsEvents(){
  for(let i = 0; i < bullets.length;){
    let hit = false;
    for(let o = 0; o < obstacles.length; ) {
        // 子弹与障碍物碰撞检测
      if(hitTest(obstacles[o], bullets[i])) {
        hit = true;
        // 移除障碍物
        obstaclesBoom(o)
        continue;
      }else if(hitTest(obstacles[o], plane)){
        // 飞机与障碍物碰撞检测
        let _obstacle = obstacles.splice(o,1)[0];
        _obstacle.destroy();
        gameOver();
        continue;
      }else{
        o++
      }
    }
    // 根据碰撞状态做处理
    if(hit){
      // 如果碰撞了
      // 移除当前子弹
      let _bullet = bullets.splice(i,1)[0];
      _bullet.destroy();
      // 加分
      score ++;
      scorePanel.text = '得分：' + score;
    }else{
      // 如果子弹飞出屏幕，则移除；如果没有，Y轴位移
      if(bullets[i].y < -bullets[i].height){
        let _bullet = bullets.splice(i,1)[0];
        _bullet.destroy();
      }else{
        bullets[i].y -= 10;
        i++
      }
    }
  }
}
```
首先遍历子弹池，内部遍历所有障碍物，通过hitTest做碰撞检测
如果子弹和障碍物碰撞，子弹消失，障碍物消失/爆炸，得分+1；
如果飞机和障碍物碰撞，障碍物消失/爆炸，游戏结束
如果都没有，检测下一个子弹
如果子弹自下而上，飞出屏幕，则子弹移除，否则影响性能
==============================================================
碰撞检测代码，bump通过cdn引入
hitTestCircleRectangle只能用于圆形和矩形的碰撞，更多方式查看PIXI官方文档
```js
// 子弹词条碰撞
import * as PIXI from 'pixi.js';
export function hitTest (r1, r2) {
  let b = new Bump(PIXI);
  if (b.hitTestCircleRectangle(r1, r2, true) !== false) {
    return true;
  } else {
    return false;
  }
}

```
## 9.障碍物爆炸逻辑

碰撞之后，根据parent属性，找到container，进而找到内部的爆炸动画，执行play()方法；
爆炸的同时，使纹理隐藏，形成视觉上的碰撞爆炸效果

部分代码：
```js
function obstaclesBoom(o){
  let container = obstacles[o].parent;
  let _obstacle = obstacles.splice(o,1)[0];
  _obstacle.destroy();
  container.children[1].play();
  container.children[0].visible = false;
  container.children[2].visible = false;
}
```

## 总结
只是随便讲一下做法的逻辑，请查看具体代码已上传github