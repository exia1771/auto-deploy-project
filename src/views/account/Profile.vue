<template>
  <div id="profile-container">
    <el-divider content-position="left">基本信息</el-divider>
    <div id="profile-sub-container">
      <div id="profile-left-container">
        <el-form
          label-position="top"
          ref="updateForm"
          :model="updateForm"
          :rules="updateFormRules"
        >
          <el-form-item label="ID">
            <el-input :placeholder="user.id" disabled class="input"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input
              :placeholder="user.username"
              disabled
              class="input"
            ></el-input>
          </el-form-item>
          <el-form-item label="电子邮件地址" prop="email">
            <el-input class="input" v-model.trim="updateForm.email"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="telephone">
            <el-input
              class="input"
              v-model.trim="updateForm.telephone"
            ></el-input>
          </el-form-item>
          <el-button type="success" @click="update" :loading="isUpdate"
            >更新</el-button
          >
        </el-form>
      </div>
      <div id="profile-right-container">
        <div id="profile-username">头像</div>
        <el-upload
          id="profile-avatar"
          class="avatar-uploader"
          name="avatar"
          :action="uploadAvatar.url"
          :before-upload="beforeUpload"
          :headers="uploadAvatar.headers"
          :multiple="false"
          :show-file-list="false"
          :with-credentials="true"
          :on-success="uploadAvatarSuccess"
        >
          <img
            v-if="user.avatarAddress"
            :src="fileServerURL + user.avatarAddress"
            class="avatar box-shadow"
            id="avatar-img"
          />
          <i v-else class="el-icon-user-solid avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </div>
</template>


<script>
import { nullToBlank, getOrDefault } from "../../utils/common.js";
import { doUpdateBasicInfo } from "../../service/account";
import { USER_PATH } from "../../service/login";
import { setUser } from "../../utils/auth";
import { FILE_SERVER_URL } from "../../../config/global";
export default {
  name: "Profile",
  data() {
    const checkEmail = (rule, value, callback) => {
      const pattern = /^\w+@[a-zA-Z0-9]{2,}(?:\.[a-z]{1,4}){1,3}$/;
      if (value != null && value.length >= 6) {
        if (!pattern.test(value)) {
          callback(new Error("请输入正确的电子邮件"));
        }
      }
    };
    const checkTelephone = (rule, value, callback) => {
      const pattern = /^(([0-9]{1,11})|([0-9\\-]))$/;
      if (value != null && value.length >= 6) {
        if (!pattern.test(value)) {
          callback(new Error("请输入正确的联系方式"));
        }
      }
    };
    return {
      fileServerURL: FILE_SERVER_URL,
      form: {},
      updateForm: {},
      updateFormRules: {
        email: [
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
          { validator: checkEmail, trigger: ["blur", "change"] },
        ],
        telephone: [
          {
            min: 6,
            max: 255,
            message: "长度在 6~255 个字符",
            trigger: ["blur", "change"],
          },
          { validator: checkTelephone, trigger: ["blur", "change"] },
        ],
      },
      isUpdate: false,
      uploadAvatar: {
        url: USER_PATH + "/avatar",
        imageTypeList: "image/jpeg, image/png",
        headers: {},
      },
    };
  },
  computed: {
    user() {
      let storedUser = this.$store.state.user;
      this.initForm(storedUser);
      return storedUser;
    },
  },
  methods: {
    labelZeroPadding() {
      let label = document.querySelectorAll(".el-form-item label");
      label.forEach((v) => {
        v.style.padding = 0;
      });
    },
    initForm(user) {
      let temp = getOrDefault(user, {});
      this.form.email = getOrDefault(temp.email, "");
      this.form.telephone = getOrDefault(temp.telephone, "");
      this.updateForm = { ...this.form };
    },
    update() {
      let hasUpdated = false;
      Object.keys(this.updateForm).forEach((k) => {
        let oldValue = nullToBlank(this.form[k]);
        let newValue = nullToBlank(this.updateForm[k]);
        console.log(oldValue, newValue);
        if (oldValue !== newValue) {
          hasUpdated = true;
        }
      });
      if (hasUpdated === true) {
        this.isUpdate = true;
        doUpdateBasicInfo(this.updateForm).then((res) => {
          setUser(res.data.data);
          this.isUpdate = false;
          this.$message({
            showClose: true,
            message: "更新成功",
            type: "success",
          });
        });
      }
    },
    beforeUpload(file) {
      const fileType = file.type;
      const typeList = this.uploadAvatar.imageTypeList.split(", ");
      if (!typeList.includes(fileType)) {
        this.$message.warning("只允许上传" + this.imageTypeList + "文件");
        return false;
      }
      const size = file.size / 1024 / 1024;
      if (size > 4) {
        this.$message.warning("上传的图像文件不能超过4MB!");
        return false;
      }
      return true;
    },
    uploadAvatarSuccess(response) {
      let tempUser = { ...this.user };
      tempUser.avatarAddress = response.data.url;
      setUser(tempUser);
    },
  },
  mounted() {
    this.labelZeroPadding();
  },
};
</script>


<style scoped>
#profile-sub-container {
  display: flex;
  flex-direction: row;
  padding-left: 10px;
}

#profile-left-container {
  flex: 3;
}

#profile-right-container {
  flex: 2;
}

#profile-username {
  margin-top: 0.3rem;
  font-size: 0.5rem;
}

.el-divider__text {
  font-size: 0.4rem;
}

#profile-avatar {
  margin-top: 0.5rem;
}

.input {
  width: 70%;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: white;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  background: #dddddd;
  border-radius: 50%;
}
.avatar {
  width: 178px;
  height: 178px;
  border-radius: 50%;
  display: block;
}

.el-form-item {
  margin: 0;
}

.el-form--label-top {
  font-weight: 800;
}
</style>