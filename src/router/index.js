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
        },
        {
          path: '/dayHis',
          name: '按天查询',
          component: () => import("@/views/History/day.vue"),
        },
        {
          path: '/mouthHis',
          name: '按月查寻',
          component: () => import("@/views/History/month.vue"),
        },
        {
          path: '/yearHis',
          name: '按年查寻',
          component: () => import("@/views/History/year.vue"),
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
  // console.log(to)
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
