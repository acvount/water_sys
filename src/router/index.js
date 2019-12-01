import Vue from 'vue'
import Router from 'vue-router'
import Template from '@/components/Template'
import ElementTable from '@/components/ElementTable'
import DetailInfo from '@/components/DetailInfo'
import store from '@/store/index.js'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: '登陆',
      component: () => import("@/views/Login.vue"),
    },
    {
      path: '/',
      name: '主页面',
      redirect: '/home',
      component: () => import("@/views/Main"),
      children: [
        {
          path: '/home',
          name: '首页',
          component: () => import("@/views/Home"),
        },
        {
          path: '/site',
          name: '站点管理',
          component: () => import("@/views/Site/index"),
        },
        {
          path: '/user',
          name: '用户管理',
          component: () => import("@/views/User"),
        },
        {
          path: '/map',
          name: '地图',
          component: () => import("@/views/Map"),
        },
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  let Auth = localStorage.getItem('Authorization');
  if (to.path == "/login") {
    Auth ? next("/") : next()
  } else {
    if (Auth) {
      if (store.getters.side.length == 0) {
        store.dispatch('add_side', JSON.parse(localStorage.getItem("userInfo")));
      }
      next()
    } else {
      next("/login")
    }
  }
})

export default router;


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
