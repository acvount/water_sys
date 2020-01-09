import Vue from 'vue'
import Router from 'vue-router'
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
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/map',
          name: '地图',
          component: () => import("@/views/Map"),
          meta: {
            keepAlive: false
          }
        },
        {
          path: '/real-time',
          name: '实时数据',
          component: () => import("@/views/real-time"),
          meta: {
            keepAlive: false
          }
        },
        {
          path: '/dayHis',
          name: '按天查询',
          component: () => import("@/views/History/day.vue"),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/mouthHis',
          name: '按月查寻',
          component: () => import("@/views/History/month.vue"),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/yearHis',
          name: '按年查寻',
          component: () => import("@/views/History/year.vue"),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/site',
          name: '站点管理',
          component: () => import("@/views/Site/index"),
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/user',
          name: '用户管理',
          component: () => import("@/views/User"),
          meta: {
            keepAlive: true
          }
        },

      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
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
