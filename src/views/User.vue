<template>
  <div class="wa-user-view">
    <el-form :inline="true" :loading="loading">
      <el-form-item label>
        <el-input clearable placeholder="用户账号、姓名、联系人电话" size="small" v-model="searchForm.userNick"></el-input>
      </el-form-item>
      <el-form-item label="账号状态">
        <el-select clearable size="small" v-model="searchForm.status">
          <el-option label="正常" value="1"></el-option>
          <el-option label="停用" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="initTableData()">查询</el-button>
      </el-form-item>
      <el-form-item style="float:right;">
        <el-button type="primary" size="small" @click="userDialog=!userDialog;isAdd=true;">用户添加</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="#" width="50" align="center"></el-table-column>
      <el-table-column prop="userName" label="用户账号" align="center"></el-table-column>
      <el-table-column prop="userNick" label="用户名称" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="createTime" label="用户创建时间" align="center"></el-table-column>
      <el-table-column label="用户角色" align="center">
        <template slot-scope="scope">{{scope.row.userType == 0?'普通用户':'超级管理员'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.userType == 0">
            <el-button @click="editUser(scope.row)" type="text" size="small">修改</el-button>
            <el-button
              type="text"
              @click="HandleUser(scope.row)"
              v-if="scope.row.status == 0"
              size="small"
            >开启</el-button>
            <el-button type="text" @click="HandleUser(scope.row)" v-else size="small">禁用</el-button>
            <el-button type="text" @click="editPwd(scope.row)" size="small">密码重置</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchForm.pageNo"
      :page-sizes="[10, 20, 50,100]"
      :page-size="searchForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="searchForm.total"
    ></el-pagination>
    <el-dialog :visible.sync="userDialog" width="50%" @close="handleCloseDialog">
      <span slot="title">{{isAdd?'用户添加':'用户修改'}}</span>
      <el-form
        label-width="80px"
        class="site-add-form"
        ref="addForm"
        :rules="rules"
        :model="addForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="userName">
              <el-input v-if="isAdd" v-model="addForm.userName" size="small"></el-input>
              <el-input v-else disabled v-model="addForm.userName" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称" prop="userNick">
              <el-input v-model="addForm.userNick" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="addForm.phone" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="isAdd" label="密码" prop="password">
              <el-input v-model="addForm.password" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户权限">
              <el-tree
                :data="Menusoptions"
                show-checkbox
                default-expand-all
                :default-checked-keys="[1]"
                node-key="id"
                ref="addMenuTree"
              ></el-tree>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { menus, filterMenus } from "@/utils/sideJson";
export default {
  data() {
    var phoneReg = (rule, value, callback) => {
      const reg = /^[1]([3-9])[0-9]{9}$/;
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确的手机号"));
        }
        callback();
      }
    };
    const newPwdValidate = (rule, value, callback) => {
      if (
        value.length >= 6 &&
        value.length <= 25 &&
        // /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/.test(value)
        /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,20}$/.test(
          value
        )
      ) {
        callback();
      } else {
        callback(new Error("密码过于简单"));
      }
    };
    return {
      userDialog: false,
      isAdd: true,
      Menusoptions: null, //
      loading: false,
      tableData: [], //显示的table
      searchForm: {
        //搜索
        userNick: "",
        status: "",
        pageNo: 0,
        pageSize: 10,
        total: 0,
        pages: ""
      },
      addForm: {
        //添加用户
        userName: "",
        userNick: "",
        phone: "",
        password: "",
        userPower: ""
      },
      rules: {
        userName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        userNick: [{ required: true, message: "请输入账号", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: phoneReg, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: newPwdValidate, trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.initTableData();
  },
  methods: {
    handleSizeChange(val) {
      this.searchForm.pageSize = val;
      this.initTableData();
    },
    handleCurrentChange(val) {
      this.searchForm.pageNo = val;
      this.initTableData();
    },
    handleCloseDialog() {
      this.addForm = {
        userName: "",
        userNick: "",
        phone: "",
        password: "",
        userPower: ""
      };
    },
    editPwd(row) {
      //密码重置
      this.$confirm(`确定要重置【${row.userNick}】的密码吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$request
            .post(this.api.sys.user.editpwd, { id: row.id })
            .then(res => {
              if (res.code == 1) {
                this.initTableData();
                this.$message.success('密码充值成功');
              } else {
                this.$message.error(res.msg);
              }
            });
        })
        .catch(() => {});
    },
    editUser(row) {
      //修改用户信息
      this.isAdd = false;
      this.userDialog = true;
      this.$nextTick(() => {
        this.addForm = JSON.parse(JSON.stringify(row));
        this.$refs.addMenuTree.setCheckedKeys(
          JSON.parse(this.addForm.userPower)
        );
      });
    },
    addUser() {
      //添加用户
      let allMenuId = [].concat(
        this.$refs.addMenuTree.getCheckedKeys(),
        this.$refs.addMenuTree.getHalfCheckedKeys()
      );
      this.addForm.userPower = JSON.stringify(allMenuId);
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this.$request
            .post(
              this.isAdd ? this.api.sys.user.add : this.api.sys.user.update,
              this.addForm
            )
            .then(res => {
              if (res.code == 1) {
                this.initTableData();
                this.userDialog = false;
                this.$message.success(
                  `用户${this.isAdd ? "添加" : "修改"}成功`
                );
              } else {
                this.$message.error(res.msg);
              }
            });
        }
      });
    },
    initTableData() {
      this.loading = true;
      this.$request.post(this.api.sys.user.get, this.searchForm).then(res => {
        if (res.code == 1) {
          this.tableData = res.data.list;
          this.searchForm.pageNo = res.data.pageNum;
          this.searchForm.pageSize = res.data.pageSize;
          this.searchForm.total = res.data.total;
        }
        this.loading = false;
      });
    },
    initMenus() {
      this.Menusoptions = filterMenus(menus);
    },
    HandleUser(row) {
      const userStatus =
        row.status == 0
          ? this.api.sys.user.openUser
          : this.api.sys.user.closeUser;
      this.$request.post(userStatus, { id: row.id }).then(res => {
        if (res.code == 1) {
          this.$message.success(
            row.status == 0 ? "用户激活成功" : "用户禁用成功"
          );
        } else {
          this.$message.error("操作失败");
        }
        this.initTableData();
      });
    }
  },
  watch: {
    userDialog(val) {
      if (val) {
        this.initMenus();
      }
    }
  }
};
</script>

<style lang="scss">
.wa-user-view {
  padding: 10px 20px;
}
</style>