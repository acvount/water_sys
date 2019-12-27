<template>
  <div class="app-nav-wrap">
    <div class="wa_left_navtop" @click="isCollapse=!isCollapse">
      <i
        class="iconfont icon-side-bars"
        :style="{transform:isCollapse?'rotate(0deg)':'rotate(90deg)'}"
      ></i>
    </div>
    <el-menu
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      router
      unique-opened
      :collapse="isCollapse"
    >
      <template v-for="menu in menus">
        <el-submenu :index="menu.name" v-if="menu.children" :key="menu.route">
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
import { user, admin } from "@/utils/sideJson.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isCollapse: false
    };
  },
  mounted() {
    this.initTab();
  },
  methods: {
    initTab() {
      // 刷新时以当前路由做为tab加入tabs
      if (this.$route.path !== "/") {
        this.$store.commit("add_tabs", { route: "/home", name: "首页" });
        this.$store.commit("add_tabs", {
          route: this.$route.path,
          name: this.$route.name
        });
        this.$store.commit("set_active_index", this.$route.path);
      } else {
        this.$store.commit("add_tabs", { route: "/home", name: "首页" });
        this.$store.commit("set_active_index", "/");
        this.$router.push("/");
      }
    }
  },
  watch: {
    isCollapse(newval, oldval) {
      this.$store.commit("Edit_Collapse", newval);
    }
  },
  computed: {
    ...mapGetters({ menus: "side" }),
    options() {
      return this.$store.state.options;
    },
    userAuth() {
      return JSON.parse(localStorage.getItem("userInfo"));
    }
  }
};
</script>

<style lang="scss">
.wa_left_navtop {
  height: 40px;
  background: #02657c;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s linear;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 25px;
    color: #fff;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
