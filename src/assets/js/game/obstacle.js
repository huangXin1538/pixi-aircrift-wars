import * as PIXI from 'pixi.js';
import {getWidth, getHeight} from './unix.js';
let delay = 0;
let createSpeed = 3;
let obstacleTime = 6000;
function createobstacle(gameScene, texture, obstacles, TWEEN, tweens){
  if (delay > createSpeed) {
    createSpeed -= createSpeed*0.05
    delay = 0;
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
  } else{
    delay += 1/60;
  }
}

export default createobstacle;