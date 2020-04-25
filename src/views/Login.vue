<template>
  <div class="loncom_login">
    <div class="loncom_login_con">
      <div class="loncom_logo_img"></div>
      <div class="loncom_logo_text">水资源管理系统</div>
      <!-- <div class="loncom_logo_text">管理系统</div> -->
      <div class="loncom_login_input">
        <el-form ref="LoginForm" class="login-box" :model="LoginForm" :rules="rules">
          <div class="loncom_user">
            <el-form-item prop="user">
              <el-input
                type="text"
                @keyup.enter.native="LoginFn()"
                v-model="LoginForm.user"
                autocomplete="on"
              ></el-input>
            </el-form-item>
          </div>
          <div class="loncom_pass">
            <el-form-item prop="pwd">
              <el-input
                type="password"
                @keyup.enter.native="LoginFn()"
                v-model="LoginForm.pwd"
                autocomplete="on"
              ></el-input>
            </el-form-item>
          </div>
          <el-button type="primary" :loading="loading" @click="LoginFn()">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>


<script>
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
      },
      loading: false
    };
  },
  mounted() {
    // var myCity = new BMap.LocalCity();
    // myCity.get((result)=>{
    //   var cityName = result.name;
		//  alert("当前定位城市:"+cityName);
    // });
  },
  methods: {
    keyLogin(ev) {
      if (ev.keyCode == 13) {
        this.LoginFn();
      }
    },
    LoginFn() {
      this.$refs["LoginForm"].validate(valid => {
        if (valid) {
          this.loading = true;
          this.$request
            .post(this.api.login, {
              userName: this.LoginForm.user,
              password: this.LoginForm.pwd
            })
            .then(res => {
              const state = {
                2: "缺少参数",
                3: "用户不存在",
                4: "账号锁定请与管理员联系！！！",
                5: `密码错误${res.data}次,剩余${5 - res.data}次`
              };
              if (res.code != 1) {
                this.$message.error(state[res.code]);
                this.loading = false;
              } else {
                localStorage.setItem("Authorization", true);
                localStorage.setItem("userInfo", JSON.stringify(res.data));
                this.$router.push({ path: "/" });
                // if (this.$socket.readyState === 1) {
                //   this.$socket.send(JSON.stringify({ router: "login" }));
                // }
                // this.$socket.onmessage = data => console.log(data);
                // this.$websocket.dispatch("WEBSOCKET_INIT");
              }
            })
            .catch(err => {
              this.$message.warning("网络出故障了,请稍后在试");
              this.loading = false;
            });
        }
      });
    }
  }
};
</script>


<style>
.loncom_login {
  width: 100%;
  height: 220px;
  background: #199ed8 url(../assets/images/login_bg.png) no-repeat right bottom;
  position: relative;
  top: 50%;
  margin-top: -110px;
}

.loncom_login_con {
  width: 350px;
  height: 420px;
  position: absolute;
  left: 50%;
  top: 50%;
  /* margin-left: -175px;
  margin-top: -210px; */
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20px 25px;
  border-top: 10px solid #199ed8;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.35);
}

.loncom_login_con .loncom_logo_img {
  width: 60px;
  height: 60px;
  margin: 0 auto;
  background: url(../assets/images/logo.png) no-repeat center center;
  background-size: contain;
}

.loncom_login_con .loncom_logo_text {
  text-align: center;
  font-style: normal;
  font-size: 24px;
  color: #199ed8;
  font-weight: bold;
  margin: 20px 0;
}

.loncom_login_input input {
  width: 100%;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  padding-left: 40px;
  color: #999;
}

.loncom_login_input p {
  margin-bottom: 20px;
}
input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
}
.loncom_login_input .loncom_user,
.loncom_login_input .loncom_pass {
  position: relative;
}
.loncom_login_input .loncom_user:after {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  top: 0;
  background: url(../assets/images/login_user.png) no-repeat 10px center !important;
}
.loncom_login_input .loncom_pass:after {
  content: "";
  position: absolute;
  width: 40px;
  height: 40px;
  top: 0;
  background: url(../assets/images/login_pass.png) no-repeat 10px center !important;
}

.loncom_login_input {
  margin-left: 0 !important;
}

.loncom_login_input button {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-radius: 3px;
  background: #199ed8;
  color: #fff;
}
</style>
