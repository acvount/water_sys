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
import VueNativeSock from 'vue-native-websocket'

Vue.use(ElementUI);
Vue.use(VueNativeSock, `ws://${process.env.VUE_APP_BASE_API}/websocket/123`)

Vue.prototype.$socket = VueNativeSock;
Vue.prototype.api = api;
Vue.prototype.$request = request;

Vue.config.productionTip = true



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
