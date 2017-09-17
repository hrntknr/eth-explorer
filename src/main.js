import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import Tx from './Tx.vue'
import Block from './Block.vue'
import _Event from './Event.vue'
Vue.use(VueRouter)
const routes = [
  { path: '/tx/:hash', component: Tx},
  { path: '/block/:hash', component: Block},
  { path: '/event/:id/:tx_hash', component: _Event}
]
const router = new VueRouter({routes})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
