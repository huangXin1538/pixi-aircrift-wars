/* eslint-disable */
import * as PIXI from 'pixi.js';
// 子弹词条碰撞
export function hitTest (r1, r2) {
  let b = new Bump(PIXI);
  if (b.hitTestCircleRectangle(r1, r2, true) !== false) {
    return true;
  } else {
    return false;
  }
}
