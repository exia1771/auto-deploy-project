<template>
  <div id="project-config-container">
    <div id="project-config" class="config-title">
      <el-form
        id="config-info-form"
        ref="configInfoForm"
        :model="configInfoForm"
        :rules="configInfoFormRules"
        label-width="90px"
      >
        <el-form-item label="部署空间" prop="namespaceId">
          <el-select
            v-model="configInfoForm.namespaceId"
            placeholder="请选择"
            filterable
            @change="selectNamespaceChange"
          >
            <el-option
              v-for="item in namespaceOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
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
        <el-form-item label="CPU核心" prop="core">
          <div class="slider-font-item">
            <el-slider
              v-model="configInfoForm.core"
              show-input
              :max="8"
            ></el-slider>
            <div class="slider-font">Core</div>
          </div>
        </el-form-item>
        <el-form-item>
          <template slot="label">
            <el-tooltip
              effect="light"
              content="端口为0的一项将会被忽略"
              placement="top-start"
            >
              <div>
                <span>容器端口</span>
                <i class="el-icon-info"></i>
              </div>
            </el-tooltip>
          </template>
          <div
            class="port-item"
            v-for="(item, index) in configInfoForm.port"
            :key="index"
          >
            <el-input-number
              v-model.number="item.container"
              :precision="0"
              :min="0"
              :max="65535"
            ></el-input-number>
            <div class="port-font">映射为</div>
            <el-input-number
              v-model.number="item.host"
              :precision="0"
              :min="0"
              :max="65535"
            ></el-input-number>
            <div class="flex icon-container">
              <div class="port-icon" @click="addPortMapping(index)">
                <i class="el-icon-circle-plus-outline"></i>
              </div>
              <div
                class="port-icon"
                @click="removePortMapping(index)"
                v-show="configInfoForm.port.length >= 2"
              >
                <i class="el-icon-remove-outline"></i>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="content-to-left">
      <el-button
        type="success"
        :disabled="!isUpdatedConfigInfoForm"
        @click="updateConfigInfoForm"
        :loading="configInfoFormLoading"
        >更新</el-button
      >
    </div>
  </div>
</template>


<script>
import {
  doFindByProjectIdAndNamespaceId,
  doSaveProjectConfig,
} from "../../service/projectConfig";
import { doFindAllNamespace } from "../../service/namespace";
import { objEqual } from "../../utils/common";
export default {
  name: "ProjectConfig",
  data() {
    return {
      originConfigInfoForm: {},
      namespaceOptions: [],
      configInfoForm: {
        namespaceId: "",
        core: 0,
        memory: 0,
        storage: 0,
        port: [{ container: null, host: null }],
      },
      configInfoFormRules: {
        core: [
          { required: true, message: "请选择CPU的核心数量", trigger: "blur" },
        ],
        namespaceId: [
          { required: true, message: "请选择部署空间", trigger: "blur" },
        ],
        memory: [
          { required: true, message: "请选择内存的大小", trigger: "blur" },
        ],
        storage: [
          { required: true, message: "请选择硬盘的大小", trigger: "blur" },
        ],
      },
      configInfoFormLoading: false,
      project: {},
    };
  },
  async created() {
    await this.findAllNamespace();
    this.findProjectConfigByProejctIdAndNamespaceId();
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
    removePortMapping(index) {
      this.configInfoForm.port.splice(index, 1);
    },
    findProjectConfigByProejctIdAndNamespaceId() {
      doFindByProjectIdAndNamespaceId(
        this.routeParams.id,
        this.configInfoForm.namespaceId
      ).then((res) => {
        const data = res.data.data;
        this.configInfoForm.memory = data.memory;
        this.configInfoForm.storage = data.storage;
        this.configInfoForm.core = data.core;
        this.originConfigInfoForm = { ...this.configInfoForm };
        if (data.port != null || data.port != undefined) {
          this.configInfoForm.port = JSON.parse(data.port);
        }
        if (this.configInfoForm.port.length === 0) {
          this.configInfoForm.port = [{ container: null, host: null }];
        }
        this.originConfigInfoForm = JSON.parse(
          JSON.stringify(this.configInfoForm)
        );
      });
    },
    updateConfigInfoForm() {
      if (this.isUpdatedConfigInfoForm) {
        const result = this.$refs.configInfoForm.validate();
        if (!result) {
          return;
        }
        const configInfo = { ...this.configInfoForm };
        const originInfo = { ...this.originConfigInfoForm };
        configInfo.port = configInfo.port.filter((value) => {
          if (value.host === undefined || value.container === undefined) {
            return false;
          }
          return value.host !== 0 && value.port !== 0;
        });
        originInfo.port = originInfo.port.filter((value) => {
          return value.host !== 0 && value.port !== 0;
        });
        if (objEqual(configInfo, originInfo)) {
          return;
        }
        this.configInfoFormLoading = true;
        configInfo.port = JSON.stringify(configInfo.port);
        doSaveProjectConfig({ ...configInfo, projectId: this.routeParams.id })
          .then((res) => {
            const data = res.data.data;
            this.originConfigInfoForm.core = data.core;
            this.originConfigInfoForm.id = data.id;
            this.originConfigInfoForm.memory = data.memory;
            this.originConfigInfoForm.namespaceId = data.namespaceId;
            this.originConfigInfoForm.port = JSON.parse(data.port);
            if (this.originConfigInfoForm.port.length === 0) {
              this.originConfigInfoForm.port = [
                { container: null, host: null },
              ];
            }
            this.configInfoFormLoading = false;
            this.$message.success("修改成功");
          })
          .catch(() => {
            this.configInfoFormLoading = false;
          });
      }
    },
    async findAllNamespace() {
      await doFindAllNamespace().then((res) => {
        const data = res.data.data;
        this.namespaceOptions = data;
        this.configInfoForm.namespaceId = data[0].id;
      });
    },
    selectNamespaceChange() {
      this.findProjectConfigByProejctIdAndNamespaceId();
    },
  },
  computed: {
    routeParams() {
      return this.$route.params;
    },
    isUpdatedConfigInfoForm() {
      return !objEqual(this.configInfoForm, this.originConfigInfoForm);
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
  width: $percent-width;
}

.config-title {
  font-size: 0.3rem;
}

.flex {
  display: flex;
}

.icon-container {
  justify-content: center;
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
  grid-template-columns: 35% 15% 35% 15%;
  margin-bottom: 15px;

  .port-font {
    text-align: center;
    color: grey;
  }

  .port-icon {
    text-align: right;
    font-size: 0.4rem;
  }

  .port-icon:hover {
    color: #409eff;
  }
}
</style>