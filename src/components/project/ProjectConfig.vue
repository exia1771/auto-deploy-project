<template>
  <div id="project-config-container">
    <div id="project-config" class="config-title">
      <el-form
        id="config-info-form"
        ref="configInfoForm"
        :model="configInfoForm"
        :rules="configInfoFormRules"
        label-width="80px"
      >
        <el-form-item label="内存大小" prop="memory">
          <div class="slider-font-item">
            <el-slider
              v-model="configInfoForm.memory"
              show-input
              :max="2048"
            ></el-slider>
            <div class="slider-font">MB</div>
          </div>
        </el-form-item>
        <el-form-item label="硬盘存储" prop="storage">
          <div class="slider-font-item">
            <el-slider
              v-model="configInfoForm.storage"
              show-input
              :max="2048"
            ></el-slider>
            <div class="slider-font">MB</div>
          </div>
        </el-form-item>
        <el-form-item label="CPU核心" prop="cpu">
          <div class="slider-font-item">
            <el-slider
              v-model="configInfoForm.cpu"
              show-input
              :max="8"
            ></el-slider>
            <div class="slider-font">Core</div>
          </div>
        </el-form-item>
        <el-form-item label="容器端口">
          <div
            class="port-item"
            v-for="(item, index) in configInfoForm.port"
            :key="index"
          >
            <el-input-number
              v-model.number="item.container"
              :precision="0"
              :max="65535"
            ></el-input-number>
            <div class="port-font">映射为</div>
            <el-input-number
              v-model.number="item.host"
              :precision="0"
              :max="65535"
            ></el-input-number>
            <div class="port-icon" @click="addPortMapping(index)">
              <i class="el-icon-circle-plus-outline"></i>
            </div>
          </div>
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
        cpu: 2,
        memory: 1024,
        storage: 2048,
        port: [{ container: null, host: null }],
      },
      configInfoFormRules: {
        cpu: [
          { required: true, message: "请选择CPU的核心数量", trigger: "blur" },
        ],
        memory: [
          { required: true, message: "请选择内存的大小", trigger: "blur" },
        ],
        storage: [
          { required: true, message: "请选择硬盘的大小", trigger: "blur" },
        ],
      },
      configInfoFormLoading: false,
      isUpdatedConfigInfoForm: false,
    };
  },
  methods: {
    addPortMapping(index) {
      let portArray = this.configInfoForm.port;
      const port = { container: null, host: null };
      if (index == portArray.length - 1) {
        portArray.push(port);
      } else {
        const left = portArray.slice(0, index + 1);
        const right = portArray.slice(index + 1);
        left.push(port);
        portArray = left.concat(right);
        this.configInfoForm.port = portArray;
      }
    },
  },
};
</script>


<style scoped lang="scss">
@import "../../utils/globla.scss";

.el-input-number {
  width: 105%;
}

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

.port-item {
  display: grid;
  grid-template-columns: 35% 20% 35% 10%;
  margin-bottom: 15px;

  .port-font {
    text-align: center;
    color: grey;
  }

  .port-icon {
    text-align: right;
    font-size: 0.5rem;
  }

  .port-icon:hover {
    color: #409eff;
  }
}
</style>