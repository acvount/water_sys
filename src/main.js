import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store/index';
import './assets/custom.scss';
import './assets/water_icon.css';
// import VueSocketIO from 'vue-socket.io'
import * as socket from '@/websocket'

import api from "@/utils/api"
import request from '@/utils/request'
Vue.prototype.$socket = socket
// Vue.prototype.$socket = VueSocketIO;
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: 'ws://192.168.18.4:9999/websocket/123',
// }))


Vue.use(ElementUI);
Vue.prototype.api = api;
Vue.prototype.$request = request;
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
