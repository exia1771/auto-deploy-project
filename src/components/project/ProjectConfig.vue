<template>
  <div id="project-config-container">
    <div id="project-config" class="config-title">
      <el-form
        id="config-info-form"
        ref="configInfoForm"
        :model="configInfoForm"
        label-width="80px"
      >
        <el-form-item label="CPU频率">
          <div class="slider-font-item">
            <el-slider
              v-model="configInfoForm.cpu"
              show-input
              :max="8"
            ></el-slider>
            <div class="slider-font">Core</div>
          </div>
        </el-form-item>
        <el-form-item label="内存大小">
          <div class="slider-font-item">
            <el-slider
              v-model="configInfoForm.memory"
              show-input
              :max="2048"
            ></el-slider>
            <div class="slider-font">MB</div>
          </div>
        </el-form-item>
        <el-form-item label="硬盘存储">
          <div class="slider-font-item">
            <el-slider
              v-model="configInfoForm.storage"
              show-input
              :max="2048"
            ></el-slider>
            <div class="slider-font">MB</div>
          </div>
        </el-form-item>
        <el-form-item label="端口映射">
          <el-input v-model="configInfoForm.port"></el-input>
          <el-input v-model="configInfoForm.port"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-to-left">
      <el-button type="success">更新</el-button>
    </div>
  </div>
</template>


<script>
export default {
  name: "ProjectConfig",
  data() {
    return {
      originConfigInfoForm: {},
      configInfoForm: {
        cpu: 1,
        memory: 1,
        storage: 1,
        port: 1,
      },
      configInfoFormLoading: false,
      isUpdatedConfigInfoForm: false,
    };
  },
};
</script>


<style scoped lang="scss">
@import "../../utils/globla.scss";
#project-config {
  width: 50%;
}

.config-title {
  font-size: 0.3rem;
}

.slider-font-item {
  display: flex;

  .el-slider {
    flex: 2;
  }

  .slider-font {
    margin-left: 10px;
    color: grey;
  }
}

.content-to-left {
  @extend .to-left;
}
</style>