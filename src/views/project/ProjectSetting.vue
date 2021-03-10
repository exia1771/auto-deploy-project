<template>
  <div id="setting-container">
    <el-divider content-position="left">基础信息</el-divider>
    <div id="setting-basic" class="setting-title">
      <el-form
        id="setting-basic-info-form"
        ref="basicInfoForm"
        :model="basicInfoForm"
        label-width="80px"
      >
        <el-form-item label="工程名称">
          <el-input
            v-model="basicInfoForm.name"
            placeholder="请输入工程的名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="工程标识">
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
          <el-input
            v-model="basicInfoForm.username"
            placeholder="请输入工程的简要概况"
          ></el-input>
        </el-form-item>
        <el-form-item label="Git地址">
          <el-input v-model="basicInfoForm.gitUrl" disabled></el-input>
        </el-form-item>
        <el-form-item label="工程简介">
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
          >更新</el-button
        >
      </div>
    </div>
    <el-divider content-position="left">资源配置</el-divider>
    <div id="setting-project" class="setting-title">CPU</div>
  </div>
</template>


<script>
import { doFindProjectById, doFindTemplateById } from "../../service/project";
import { objEqual } from "../../utils/common";
export default {
  name: "ProjectsSetting",
  data() {
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
$percent-width: 50%;

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
  display: flex;
  justify-content: flex-end;
  width: $percent-width;
}
</style>