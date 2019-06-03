import * as PIXI from 'pixi.js';
import {getWidth, getHeight} from './unix.js';
let delay = 0;
let createSpeed = 0.2;
function createPlane(resources){
  // 创建
  let plane = new PIXI.Sprite(resources.plane.texture);
  plane.name = 'plane';
  plane.width = getWidth(20);
  plane.height = plane.width * 258/371;
  plane.x = getWidth(50) - (plane.width / 2);
  plane.y = getHeight(80) - (plane.height / 2);
  // 拖动
  plane.interactive = true;
  plane.on('pointermove', onDragMove);
  // 射击
  plane.shut = shut;
  function shut(gameScene, bullets){
    if(delay > createSpeed){
      delay = 0;
      let bullet = new PIXI.Sprite(resources.bullet.texture);
      bullet.width = getWidth(4);
      bullet.height = bullet.width * 148 / 66;
      bullet.x = plane.x + (plane.width * 0.5) - (bullet.width*0.5);
      bullet.y = plane.y;
      gameScene.addChild(bullet);
      bullets.push(bullet);
    }else{
      delay += 1/60;
    }
  }
  return plane;
}

function onDragMove (event) {
  let currentTarget = event.currentTarget;
  let newPosition = event.data.global; // 获取拖动到的位置
  // 划分范围
  if (newPosition.x > 0 && newPosition.x < getWidth(100)) {
    currentTarget.x = newPosition.x - currentTarget.width * 0.5;
  }
  if (newPosition.y >0 &&newPosition.y < getHeight(100)) {
     currentTarget.y = newPosition.y - currentTarget.height * 0.5;
  }
}


export default createPlane;