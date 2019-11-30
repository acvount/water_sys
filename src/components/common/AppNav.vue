<!-- 左侧菜单导航栏组件 -->

<template>
  <div class="app-nav-wrap">
    <el-menu :default-active="$route.path" class="el-menu-vertical-demo" router>
      <template v-for="menu in menus">
        <el-submenu :index="menu.route" v-if="menu.children" :key="menu.route">
          <template slot="title">
            <i :class="`iconfont icon-${menu.icon}`"></i>&emsp;
            <span slot="title">{{menu.name}}</span>
          </template>
          <el-menu-item-group :key="index" v-for="(item,index) in menu.children">
            <el-menu-item :index="item.route">{{item.name}}</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item :index="menu.route" :key="menu.route" v-else>
          <i :class="`iconfont icon-${menu.icon}`"></i>&emsp;
          <span slot="title">{{menu.name}}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menus: [
        { route: "/", name: "首页", icon: "sys" },
        { route: "/user", name: "用户中心", icon: "user" },
        { route: "/psd", name: "地图展示", icon: "map" },
        { route: "/salary", name: "实时查询", icon: "real-time" },
        {
          route: "/attendence",
          name: "历史查询",
          icon: "history",
          children: [
            { name: "按天查询" },
            { name: "按月查询" },
            { name: "按年查询" }
          ]
        },
        {
          name: "系统管理",
          icon: "sys",
          children: [{ name: "站点查询" }, { name: "用户管理" }]
        }
      ]
    };
  },
  mounted() {
    // 刷新时以当前路由做为tab加入tabs
    if (
      this.$route.path !== "/" &&
      this.$route.path.indexOf("userInfo") == -1
    ) {
      this.$store.commit("add_tabs", { route: "/", name: "首页" });
      this.$store.commit("add_tabs", {
        route: this.$route.path,
        name: this.$route.name
      });
      this.$store.commit("set_active_index", this.$route.path);
    } else {
      this.$store.commit("add_tabs", { route: "/", name: "首页" });
      this.$store.commit("set_active_index", "/");
      this.$router.push("/");
    }
  },
  computed: {
    options() {
      return this.$store.state.options;
    }
  }
};
</script>
