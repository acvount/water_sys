import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
      options: [],
      activeIndex: '/user',
      userInfo: {}
  },
  mutations: {
    // 添加tabs
    add_tabs (state, data) {
      this.state.options.push(data);
    },
    // 删除tabs
    delete_tabs (state, route) {
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
    set_active_index (state, index) {
      this.state.activeIndex = index;
    },
    // 设置详情信息
    save_detail_info (state, info) {
      this.state.userInfo = info;
    }
  }
});

export default store;
