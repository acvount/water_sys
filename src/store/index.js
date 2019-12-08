import Vue from 'vue';
import Vuex from 'vuex';
import { menus, filterMenus } from '@/utils/sideJson'
import { stat } from 'fs';

Vue.use(Vuex);
const wsurl = "ws://192.168.18.4:9999/websocket/123"
const store = new Vuex.Store({
  state: {
    options: [],
    activeIndex: '/home',
    userInfo: {},
    side: [],
    websock: null
  },
  actions: {
    add_side({ commit }, userInfo) {
      commit('add_side_user', userInfo.userType)
      commit('WEBSOCKET_INIT', wsurl)
    },
    WEBSOCKET_INIT({ commit }, url) {
      commit('WEBSOCKET_INIT', wsurl)
    }
  },
  mutations: {
    WEBSOCKET_INIT(state, url) {
      // state.websock = new WebSocket(url);
      state.websock = new ReconnectingWebSocket(url);
      state.debug = true;
      state.timeoutInterval = 5400;
      state.websock.onopen = function () {
        console.log("连接成功！");
      }
      window.onbeforeunload = function () {
        state.websock.send('游览器关闭')
        alert("游览器关闭")
        state.websock.close();
      }
    },
    add_side_user(state, role) {
      if (role == 1) {
        state.side = filterMenus(menus);
      } else {
        let userMenus = menus.filter(item => JSON.parse(JSON.parse(localStorage.getItem("userInfo")).userPower).includes(item.id))
        state.side = filterMenus(userMenus);
      }
    },
    // 添加tabs
    add_tabs(state, data) {
      if (this.state.options.some(v => v.route === data.route)) return
      this.state.options.push(data);
    },
    // 删除tabs
    delete_tabs(state, route) {
      let index = 0;
      for (let option of state.options) {
        if (option.route === route) {
          break;
        }
        index++;
      }
      this.state.options.splice(index, 1);
    },
    // 设置当前激活的tab
    set_active_index(state, index) {
      this.state.activeIndex = index;
    },
    // 设置详情信息
    save_user_info(state, info) {
      this.state.userInfo = info;
    }
  },
  getters: {
    userinfo: (state) => state.userInfo,
    side: (state) => state.side,
    STAFF_UPDATE: (state) => state.websock
  }
});

export default store;
