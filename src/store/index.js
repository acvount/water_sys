import Vue from 'vue';
import Vuex from 'vuex';
import { menus, filterMenus } from '@/utils/sideJson'
import request from '@/utils/request'

Vue.use(Vuex);
const wsurl = `ws://${process.env.VUE_APP_BASE_API}/websocket`
const store = new Vuex.Store({
  state: {
    options: [],
    activeIndex: '/home',
    userInfo: {},
    side: [],
    isCollapse: false,
    websock: null
  },
  actions: {
    add_side({ commit }, userInfo) {
      commit('add_side_user', userInfo.userType)
      if (this.state.websock == null) {
        commit('WEBSOCKET_INIT', wsurl)
      }
    },
    WEBSOCKET_INIT({ commit }) { //初始化
      commit('WEBSOCKET_INIT', wsurl)
    },
    WEBSOCKET_DESTROY({ commit }) { //销毁
      commit('WEBSOCKET_DESTROY')
    },
  },
  mutations: {
    Edit_Collapse(state, val) {
      state.isCollapse = val;
    },
    WEBSOCKET_INIT(state, url) {
      state.websock = new ReconnectingWebSocket(url);
      state.debug = true;
      state.timeoutInterval = 5400;
      state.websock.onopen = function () {
        console.log("-->连接成功！");
      }
      window.onbeforeunload = function () {
        state.websock.close();
      }
    },
    WEBSOCKET_DESTROY(state) {
      console.log("-->关闭连接！");
      state.websock.close();
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
    IS_COLLAPSE: (state) => state.isCollapse,
    STAFF_UPDATE: (state) => state.websock
  }
});

export default store;
