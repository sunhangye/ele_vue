import Vue from 'vue'
import VueResouce from 'vue-resource'
import app from './app'
import router from './router'
import './mock/mockServer' // 引入加载模块
import './common/stylus/fonts.styl'

Vue.use(VueResouce)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(app),
  router
})
