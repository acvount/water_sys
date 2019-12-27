<template>
  <div>
    <div class="app-header">
      <div class="title">
        <img src="../../assets/images/logo-white.png" />
        <span>水资源智能管理云平台</span>
        <!-- <span>亦客测试管理系统</span> -->
      </div>
      <div class="userBox">
        <span type="primary" @click.prevent.stop="userInfoShow=!userInfoShow">
          {{userInfo.userNick}}
          <i class="iconfont icon-xiala"></i>
        </span>
        <div class="userInfo" id="userInfo" v-if="userInfoShow">
          <ul>
            <li>
              <span>账号：</span>
              {{userInfo.userName}}
            </li>
            <li>
              <span>姓名：</span>
              {{userInfo.userNick}}
            </li>
            <li>
              <span>联系电话：</span>
              {{userInfo.phone}}
            </li>
            <li>
              <div @click="Logout">
                <i class="iconfont icon-logout"></i>退出登陆
              </div>
              <div @click="pwddialogVisible=true">
                <i class="iconfont icon-pwd"></i>修改密码
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="pwddialogVisible" width="30%" :before-close="pwdhandleClose">
      <span slot="title">修改密码</span>
      <el-form
        ref="pwdForm"
        label-width="80px"
        class="demo-ruleForm"
        :rules="pwdrules"
        :model="pwdForm"
      >
        <el-form-item label="旧密码" prop="oldpwd">
          <el-input type="password" autocomplete="off" v-model="pwdForm.oldpwd"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newpwd">
          <el-input type="password" autocomplete="off" v-model="pwdForm.newpwd"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="okpwd">
          <el-input type="password" autocomplete="off" v-model="pwdForm.okpwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pwddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pwdUpdate()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    const newPwdValidate = (rule, value, callback) => {
      if (
        value.length >= 6 &&
        value.length <= 25 &&
        // /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)
        // /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{6,}$/.test(value)
        /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,20}$/.test(value)
      ) {
        callback();
      } else {
        callback(
          new Error("密码不能少于6位不能大于15位，并且只能是数字和字母组合！")
        );
      }
    };
    const okPwdValidate = (rule, value, callback) => {
      if (value.trim() == this.pwdForm.newpwd) {
        callback();
      } else {
        callback(new Error("俩次密码输入不一致！"));
      }
    };

    return {
      userInfo: {},
      userInfoShow: false,
      pwddialogVisible: false,
      pwdForm: {
        oldpwd: "",
        newpwd: "",
        okpwd: ""
      },
      pwdrules: {
        oldpwd: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newpwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: newPwdValidate, trigger: "blur" }
        ],
        okpwd: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: okPwdValidate, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.getUserInfo();
  },
  methods: {
    afreshLogin() {
      localStorage.removeItem("Authorization");
      localStorage.removeItem("userInfo");
      location.reload();
    },
    closeUserInfo() {
      this.userInfoShow = false;
    },
    Logout() {
      this.afreshLogin();
    },
    pwdUpdate() {
      this.$refs["pwdForm"].validate(valid => {
        if (valid) {
          this.$request
            .post(this.api.user.pwdUpdate, {
              rePassword: this.pwdForm.oldpwd,
              password: this.pwdForm.newpwd
            })
            .then(res => {
              if (res.code == 1) {
                this.$message.success("密码修改成功，请重新登陆");
                setTimeout(() => {
                  this.afreshLogin();
                }, 1000);
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      });
    },
    pwdhandleClose() {},
    getUserInfo() {
      this.userInfo = JSON.parse(localStorage.getItem("userInfo"));
    }
  },
  watch: {
    userInfoShow(value) {
      if (value) {
        document.body.addEventListener("click", this.closeUserInfo);
      } else {
        document.body.removeEventListener("click", this.closeUserInfo);
      }
    }
  }
};
</script>

<style lang="scss">
.app-header {
  background: url(../../assets/images/nav_bg.jpg);
  background-size: 100% 100%;
  color: #fff;
  flex: 0 0 60px;
  // background: #324057;
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
  display: flex;
  min-width: 1200px;
  justify-content: space-between;
  .title {
    display: flex;
    align-items: center;
    font-size: 24px;
    img {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
  .userBox {
    margin-right: 50px;
    position: relative;
    & > :first-child {
      cursor: pointer;
      color: #fff;
      -moz-user-select: none; /*火狐*/
      -webkit-user-select: none; /*webkit浏览器*/
      -ms-user-select: none; /*IE10*/
      -khtml-user-select: none; /*早期浏览器*/
      user-select: none;
    }
    .userInfo {
      width: 230px;
      background: #fff;
      position: absolute;
      left: -180px;
      border: 1px #ccc solid;
      border-radius: 3px;
      z-index: 1020;

      ul {
        padding: 10px 0 0 0;
        margin: 0;
        li {
          padding: 0;
          list-style: none;
          & > span {
            display: inline-block;
            width: 80px;
            text-align: right;
          }
          font-size: 12px;
          color: #666;
          line-height: 30px;
          &:last-child {
            margin-top: 10px;
            display: flex;
            border-top: 1px #ccc solid;
            line-height: 30px;
            div {
              flex: 1;
              margin: 0;
              text-align: center;
              color: #666;
              cursor: pointer;
              font-size: 12px;
              i {
                font-size: 12px;
                margin-right: 3px;
              }
              &:first-child {
                border-right: 1px #ccc solid;
              }
            }
          }
        }
      }
    }
  }
}
</style>