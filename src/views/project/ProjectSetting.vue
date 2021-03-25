<template>
  <div id="setting-container">
    <el-divider content-position="left">基础信息</el-divider>
    <div id="setting-basic" class="setting-title">
      <el-form
        id="setting-basic-info-form"
        ref="basicInfoForm"
        :model="basicInfoForm"
        :rules="basicInfoFormRules"
        status-icon
        label-width="80px"
      >
        <el-form-item label="工程名称" prop="name">
          <el-input
            v-model="basicInfoForm.name"
            placeholder="请输入工程的名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="工程标识" prop="identification">
          <el-input v-model="basicInfoForm.identification"></el-input>
        </el-form-item>

        <div id="basic-info-form-template">
          <el-form-item label="模板名称">
            <el-input v-model="template.templateName" disabled></el-input>
          </el-form-item>
          <el-form-item label="模板标签">
            <el-input v-model="template.templateTag" disabled></el-input>
          </el-form-item>
        </div>

        <el-form-item label="所属用户">
          <el-input disabled :placeholder="basicInfoForm.username"></el-input>
        </el-form-item>
        <el-form-item label="Git地址">
          <el-input v-model="basicInfoForm.gitUrl" disabled></el-input>
        </el-form-item>
        <el-form-item label="工程简介" prop="description">
          <el-input
            v-model="basicInfoForm.description"
            placeholder="请输入工程的简要概况"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="content-to-left">
        <el-button
          type="success"
          :loading="basicInfoFormLoading"
          :disabled="isUpdatedBasicInfoForm"
          @click="updateProjectById"
          >更新</el-button
        >
      </div>
    </div>
    <el-divider content-position="left">资源配置</el-divider>
    <div id="setting-project" class="setting-title">
      <project-config></project-config>
    </div>
  </div>
</template>


<script>
import ProjectConfig from "../../components/project/ProjectConfig.vue";
import {
  doFindProjectById,
  doFindTemplateById,
  doUpdateProjectById,
} from "../../service/project";
import { objEqual } from "../../utils/common";
export default {
  name: "ProjectsSetting",
  components: { ProjectConfig },
  data() {
    const checkIdentification = (rule, value, callback) => {
      if (value !== null) {
        if (1 <= value.length && value.length <= 255) {
          const pattern = /^[\w-]+$/;
          if (value.search(pattern) === -1) {
            callback(
              new Error("工程标识只允许输入 数字、字母、英文减号、下划线")
            );
          }
        }
        callback();
      }
    };
    return {
      project: {},
      template: {
        name: "",
        tag: "",
      },
      originBasicInfoForm: {},
      basicInfoForm: {
        name: "",
        identification: "",
        username: "",
        description: "",
      },
      basicInfoFormRules: {
        name: [
          {
            required: true,
            message: "请输入工程名称",
            trigger: ["blur", "change"],
          },
          {
            min: 1,
            max: 255,
            message: "长度在 1~255 个字符",
            trigger: ["blur", "change"],
          },
        ],
        identification: [
          {
            required: true,
            message: "请输入工程标识",
            trigger: ["blur", "change"],
          },
          {
            min: 1,
            max: 255,
            message: "长度在 1~255 个字符",
            trigger: ["blur", "change"],
          },
          {
            validator: checkIdentification,
            trigger: ["blur", "change"],
          },
        ],
        description: [
          {
            max: 255,
            message: "长度最大 255 个字符",
            trigger: ["blur", "change"],
          },
        ],
      },
      basicInfoFormLoading: false,
      isUpdatedBasicInfoForm: false,
    };
  },
  created() {
    this.project = {
      id: this.$route.params.id,
      name: this.$route.params.name,
    };
    this.findProjectById();
  },
  methods: {
    findProjectById() {
      doFindProjectById(this.project.id).then((res) => {
        this.basicInfoForm = { ...res.data.data };
        this.originBasicInfoForm = { ...res.data.data };
        doFindTemplateById(res.data.data.templateId).then((res) => {
          this.template = res.data.data;
        });
      });
    },
    updateProjectById() {
      let validResult = true;
      this.$refs.basicInfoForm.validate((valid) => {
        if (!valid) {
          validResult = false;
          return false;
        }
      });
      if (!validResult) {
        return;
      }
      this.basicInfoFormLoading = true;
      doUpdateProjectById(this.project.id, this.basicInfoForm)
        .then(() => {
          this.$message.success("更新成功");
          this.basicInfoFormLoading = false;
          this.findProjectById();
        })
        .catch(() => {
          this.basicInfoFormLoading = false;
        });
    },
  },
  watch: {
    basicInfoForm: {
      handler(newVal) {
        this.isUpdatedBasicInfoForm = objEqual(
          this.originBasicInfoForm,
          newVal
        );
      },
      deep: true,
    },
  },
};
</script>


<style scoped lang="scss">
@import "../../utils/globla.scss";

.el-divider__text {
  @extend .divider-text;
}

.setting-title {
  font-size: 0.3rem;
}

#setting-basic-info-form {
  width: $percent-width;
  margin-top: 1rem;
}

#basic-info-form-template {
  display: flex;
}

.content-to-left {
  @extend .to-left;
}
</style>