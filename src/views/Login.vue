<template>
  <div class="wa-login">
    <div class="wa-content">
      <el-form ref="LoginForm" class="login-box" :model="LoginForm" :rules="rules">
        <h3 class="login-title">欢迎登录</h3>
        <el-form-item prop="user">
          <span>
            <i class="iconfont icon-user"></i>
          </span>
          <el-input
            type="text"
            v-model="LoginForm.user"
            v-on:input="LoginForm.user=LoginForm.user.replace(/[^0-9]/g,'')"
            autocomplete="on"
          ></el-input>
        </el-form-item>
        <el-form-item prop="pwd">
          <span>
            <i class="iconfont icon-user"></i>
          </span>
          <el-input type="password" v-model="LoginForm.pwd" autocomplete="on"></el-input>
        </el-form-item>
        <el-button class="login-btn" @click="LoginFn()">登 录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "login",
  data() {
    return {
      LoginForm: {
        user: "",
        pwd: ""
      },
      rules: {
        user: [{ required: true, message: "请输入账号", trigger: "blur" }],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  mounted() {
   
  },
  methods: {
    LoginFn() {
      this.$refs["LoginForm"].validate(valid => {
        if (!valid) {
          this.$message.error("验证");
        } else {
          this.$request
            .post(this.api.login, { userName: "Ac", password: "sad" })
            .then(res => {
              console.log(res);
              const state = {
                2: "缺少参数",
                3: "用户不存在",
                4: "账号锁定请与管理员联系！！！",
                5: `密码错误${res.data}次,剩余${5 - res.data}次`
              };
              if (res.code !== 1) {
                this.$message.error(state[res.code]);
              }
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.wa-login {
  min-width: 1200px;
  height: 100vh;
  overflow: hidden;
  position: relative;
  & .wa-content {
    .login-box {
      padding: 20px;
    }
    .login-title {
      text-align: center;
    }
    width: 250px;
    height: 300px;
    // background: #6e959f;
    border: 1px red solid;
    border-radius: 3px;
    position: absolute;
    right: 180px;
    top: 50%;
    transform: translateY(-50%);
    .el-form-item {
      & .iconfont {
        font-size: 16px;
        color: #ccc;
        margin-right: 6px;
      }
      & > div {
        display: flex;
        border-bottom: 1px #ccc solid;
        input {
          border: 0;
          &:-webkit-autofill {
            -webkit-box-shadow: 0 0 0px 1000px white inset;
          }
        }
      }
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>