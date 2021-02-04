<template>
  <div id="safety-container">
    <el-divider content-position="left">修改密码</el-divider>
    <el-form
      status-icon
      ref="safetyForm"
      :model="safetyForm"
      :rules="safetyFormRules"
      label-position="top"
      id="safety-form"
    >
      <el-form-item prop="oldPassword" label="输入旧密码" class="input">
        <el-input
          type="password"
          placeholder="旧密码"
          v-model="safetyForm.oldPassword"
        ></el-input>
      </el-form-item>

      <el-form-item prop="newPassword" label="输入新密码" class="input">
        <el-input
          type="password"
          placeholder="新密码"
          v-model="safetyForm.newPassword"
        ></el-input>
      </el-form-item>

      <el-form-item prop="confirmedPassword" label="确认新密码" class="input">
        <el-input
          type="password"
          placeholder="确认新密码"
          v-model="safetyForm.confirmedPassword"
          :disabled="safetyForm.newPassword.length === 0"
        ></el-input>
      </el-form-item>
      <el-button type="success" @click="changePassword" :loading="isChanging"
        >更改密码</el-button
      >
    </el-form>
  </div>
</template>


<script>
import { doChangePassword } from "../../service/account";
export default {
  name: "Safety",
  data() {
    const checkConfirmedPassword = (rule, value, callback) => {
      if (value !== null && value.length >= 6) {
        if (value !== this.safetyForm.newPassword) {
          callback(new Error("两次新密码输入不一致"));
        } else {
          callback();
        }
      }
    };
    const checkNewPassword = (rule, value, callback) => {
      if (value !== null && value.length >= 6) {
        if (value === this.safetyForm.oldPassword) {
          callback(new Error("新密码不能与旧密码相同"));
        } else {
          callback();
        }
      }
    };
    return {
      safetyForm: {
        oldPassword: "",
        newPassword: "",
        confirmedPassword: "",
      },
      safetyFormRules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
          { validator: checkNewPassword, trigger: ["blur", "change"] },
        ],
        confirmedPassword: [
          { required: true, message: "再次确认新密码", trigger: "blur" },
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
          { validator: checkConfirmedPassword, trigger: ["blur", "change"] },
        ],
      },
      isChanging: false,
    };
  },
  methods: {
    changePassword() {
      let validResult = true;
      this.$refs.safetyForm.validate((valid) => {
        if (!valid) {
          validResult = false;
          return false;
        }
      });
      if (!validResult) {
        return;
      }
      this.isChanging = true;
      doChangePassword(this.safetyForm)
        .then(() => {
          this.$message.success("修改完成");
          this.isChanging = false;
        })
        .catch(() => {
          this.isChanging = false;
        });
    },
  },
};
</script>


<style scoped>
.input {
  width: 40%;
}

.el-form-item {
  margin: 0;
}

.el-form--label-top {
  font-weight: 800;
}

.el-divider__text {
  font-size: 0.4rem;
}

#safety-form {
  padding-left: 10px;
}
</style>