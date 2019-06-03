/* eslint-disable */
import * as PIXI from 'pixi.js';
import {getWidth, getHeight} from './unix.js';
import sources from './sources';
import createPlane from './plane.js';
import createobstacle from './obstacle.js';
import TWEEN from 'tween.js';
import {hitTest} from './hitTest.js';
const Application = PIXI.Application;
const Container = PIXI.Container;
const Sprite = PIXI.Sprite;
const loader = new PIXI.Loader();
let app;
let gameScene;
let plane;
let texture;
let bullets = []; // 子弹组
let obstacles = []; // 障碍物组
let tweens = []; 
let score = 0; // 分数
let scorePanel; // 分数记录
let game = {
  gameInit:gameInit,
  start:gameStart,
  end:()=>{}
}
// 加载资源
function gameLoad(){
  // loader
  //   .add('bg', 'img/bg.jpg')
  //   .load((loader, resources) => {
  //     // 加载完毕回调
  //     gameSetup(resources); //执行创建精灵等操作
  //   });
  for(let i in sources){
    loader.add(i, sources[i]);
  }
  loader.load((loader, resources) => {
    // 加载完毕回调
    gameSetup(resources); //执行创建精灵等操作
    texture = resources;
  });
}
function gameInit (dom) {
  app = new Application({
    width: getWidth(100),
    height: getHeight(100),
    antialiasing: true, // 抗锯齿
    transparent: false, // 背景透明
    resolution: 2 // 渲染倍数，避免模糊
  });
  dom.append(app.view);
  gameLoad();
}
function gameSetup(resources){
  // 创建场景
  gameScene = new Container();
  gameScene.name = 'gameScene';
  gameScene.width = getWidth(100);
  gameScene.height = getHeight(100);
  gameScene.x = 0;
  gameScene.y = 0;
  app.stage.addChild(gameScene);
  // 创建背景
  let bg = new Sprite(resources.bg.texture);
  bg.width = getWidth(100);
  bg.height = getHeight(100);
  bg.x = 0;
  bg.y = 0;
  gameScene.addChild(bg);

  // 创建分数
  scorePanel = new PIXI.Text('得分：' + score, {
    fontSize: 15,
    fill: '#fff'
  });
  scorePanel.x = 10;
  scorePanel.y = 10;
  scorePanel.name = 'scorePanel';
  gameScene.addChild(scorePanel);
  // 创建飞机
  plane = createPlane(resources);
  gameScene.addChild(plane);
}
// 开启ticker/开始游戏
function gameStart(){
  app.ticker.add(function () {
    return gameLoop();
  });
}
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
function obstaclesEvents(){
  // 更新位置
  TWEEN.update();
}

function gameOver(){
  console.log('游戏结束');
  app.ticker.stop();
  game.end();
  // app.destroy({
  //   children: true
  // });
}
function obstaclesBoom(o){
  let container = obstacles[o].parent;
  let _obstacle = obstacles.splice(o,1)[0];
  _obstacle.destroy();
  container.children[1].play();
  container.children[0].visible = false;
  container.children[2].visible = false;
}
window.game = game;
export default game;