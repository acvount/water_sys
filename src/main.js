import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from '@/store/index';
import './assets/custom.scss';
import './assets/water_icon.css';
import api from "@/utils/api"
import request from '@/utils/request'

Vue.use(ElementUI);

Vue.prototype.api = api;
Vue.prototype.$request = request;
Vue.prototype.$websocket = store;

Vue.config.productionTip = true



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
