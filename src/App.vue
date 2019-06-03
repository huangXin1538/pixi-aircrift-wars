<template>
  <div id="app">
    <page></page>
  </div>
</template>

<script>
import page from './view/page.vue'
import '@/assets/css/reset.css'
import '@/assets/css/index.css'
export default {
  name: 'app',
  components: {
    page
  }
}
</script>

<style>

</style>
