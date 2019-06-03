<template>
  <div class="game-page" ref="page">
    <div class="layer" v-show="layer">
      <div class="btn" @click="gameStart">开始游戏</div>
    </div>
    <div class="layer" v-show="layer2">
      <div class="btn">游戏结束</div>
    </div>
  </div>
</template>
<style>
.layer{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 3;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5)
}
.btn{
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 50%;
  height: 40px;
  font-size: 20px;
  line-height: 40px;
  z-index: 2;
  text-align: center;
  background-color: #fff;
}
</style>
<script>
import game from '@/assets/js/game/main.js';
export default {
  data(){
    return {
      layer: true,
      layer2: false
    }
  },
  methods:{
    gameStart(){
      this.layer = false;
      game.start();
    },
    gameEnd(){
      this.layer2 = true;
    }
  },
  mounted(){
    game.gameInit(this.$refs.page);
    game.end = this.gameEnd;
  }
}
</script>

