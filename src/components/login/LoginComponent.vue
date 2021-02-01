<template>
  <div id="login-component-container">
    <div id="login-title" class="input-container">账号密码登录</div>
    <el-form
      status-icon
      ref="loginForm"
      :model="loginForm"
      :rules="loginFormRules"
      class="form-container"
    >
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="password" id="login-password-container">
        <el-input
          type="password"
          v-model="loginForm.password"
          placeholder="密码"
        ></el-input>
      </el-form-item>

      <el-button
        id="login-button"
        type="primary"
        :loading="isLogin"
        @click="login"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>


<script>
import { doLogin } from "../../service/login";
import { setUser } from "../../utils/auth";

export default {
  name: "LoginComponent",
  data() {
    return {
      isLogin: false,
      loginForm: {
        username: "",
        password: "",
      },
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    async login() {
      const that = this;
      let validResult = true;
      this.$refs.loginForm.validate((valid) => {
        if (!valid) {
          validResult = false;
          return false;
        }
      });
      if (!validResult) {
        return;
      }
      this.isLogin = true;
      await doLogin(this.loginForm)
        .then((res) => {
          this.isLogin = false;
          setUser(res.data.data);
          that.$router.replace({ name: "Index", params: { fromLogin: true } });
        })
        .catch(() => {
          this.isLogin = false;
        });
    },
  },
};
</script>

  
<style scoped>
#login-title {
  font-size: 0.32rem;
  margin-top: 0.45rem;
  width: 60%;
}

#login-component-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.form-container {
  width: 60%;
  margin-top: 0.45rem;
}

.el-form-item {
  margin: 0;
}

#login-password-container {
  margin-top: 0.45rem;
}

#login-button {
  width: 100%;
}
</style>