<template>
  <div id="submit-component-container">
    <el-form
      status-icon
      ref="submitForm"
      :model="submitForm"
      :rules="submitRules"
      class="form-container"
    >
      <el-form-item prop="username">
        <el-input
          v-model="submitForm.username"
          placeholder="用户名"
          class="input-container"
        ></el-input>
      </el-form-item>

      <el-form-item prop="password" id="submit-password-container">
        <el-input
          type="password"
          v-model="submitForm.password"
          placeholder="密码"
          class="input-container"
        ></el-input>
      </el-form-item>

      <el-form-item prop="rePassword" id="submit-re-password-container">
        <el-input
          type="password"
          v-model="submitForm.rePassword"
          placeholder="再次输入密码"
          class="input-container"
        ></el-input>
      </el-form-item>

      <el-button
        id="submit-button"
        type="primary"
        :loading="isSubmit"
        @click="submit"
      >
        注册
      </el-button>
    </el-form>
  </div>
</template>


<script>
import { doSubmit, doCheckSameName } from "/src/service/login";
import { setToken } from "../../utils/auth";
export default {
  name: "SubmitComponent",
  data() {
    const PASSWORD_NOT_SAME = "两次输入的密码不一致!";
    const USER_NAME_EXISTED = "已存在的用户名!";
    const checkPassword = (rule, value, callback) => {
      if (value !== this.submitForm.password) {
        callback(new Error(PASSWORD_NOT_SAME));
      } else {
        callback();
      }
    };
    const checkSameName = (rule, value, callback) => {
      if (this.existedName[value] === true) {
        callback(new Error(USER_NAME_EXISTED));
        return;
      }
      if (3 <= value.length && value.length <= 255) {
        doCheckSameName(value)
          .then(() => {
            callback();
          })
          .catch((error) => {
            console.log(error.response);
            callback(new Error(error.response.data.message));
            this.existedName[value] = true;
          });
      }
    };
    return {
      isSubmit: false,
      submitForm: {
        username: "",
        password: "",
        rePassword: "",
      },
      existedName: {},
      submitRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
          {
            validator: checkSameName,
            trigger: "blur",
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
        rePassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
          { validator: checkPassword, trigger: "change" },
        ],
      },
    };
  },
  methods: {
    submit() {
      let validResult = true;
      this.$refs.submitForm.validate((valid) => {
        if (!valid) {
          validResult = false;
          return false;
        }
      });
      if (!validResult) {
        return;
      }
      this.isSubmit = true;
      doSubmit(this.submitForm)
        .then((res) => {
          this.isSubmit = false;
          setToken(res.data.data.token);
          this.$router.push({ name: "Index" });
        })
        .catch(() => {
          this.isSubmit = false;
        });
    },
  },
};
</script>


<style scoped>
#submit-component-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.form-container {
  width: 60%;
  margin-top: 0.45rem;
}

.input-container {
  margin-top: 0.3rem;
}

.el-form-item {
  margin: 0;
}

#submit-button {
  width: 100%;
}
</style>