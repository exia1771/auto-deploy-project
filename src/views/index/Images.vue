<template>
  <div>
    <el-divider content-position="left" class="title">目前已有镜像</el-divider>
    <div id="search-container">
      <el-input
        placeholder="输入Tag名"
        prefix-icon="el-icon-search"
        v-model.trim="searchText"
      >
      </el-input>
      <el-button id="search-btn" type="primary" plain @click="searchImages">
        搜索
      </el-button>

      <el-button id="reset-btn" type="success" plain @click="findAllImages">
        复原
      </el-button>
    </div>
    <el-table
      :data="tableData"
      stripe
      style="width: 95%"
      :loading="isLoading"
      :border="true"
    >
      <el-table-column
        prop="id"
        label="镜像ID"
        width="180"
        :formatter="formatImageID"
      >
      </el-table-column>
      <el-table-column prop="repoTags" label="仓库标签" width="180">
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" sortable width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-document"
            type="info"
            plain
            @click="inspect(scope.row.id)"
            v-loading.fullscreen.lock="isInspect"
          >
            详细信息
          </el-button>

          <el-button
            type="success"
            plain
            @click="copyID()"
            :data-clipboard-text="scope.row.id.substring(7)"
            id="copy-btn"
          >
            复制ID
          </el-button>

          <el-button
            id="make-template-btn"
            type="warning"
            plain
            @click="showTemplateForm(scope.row.id)"
          >
            制作模板
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="详细信息" :visible.sync="dialogVisible" width="60%">
      <json-viewer
        :value="inspectData"
        :expand-depth="5"
        copyable
        boxed
        sort
      ></json-viewer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      id="template-form"
      title="制作模板"
      :visible.sync="templateFormVisible"
    >
      <el-form
        :model="templateForm"
        ref="templateForm"
        :rules="templateFormRules"
        status-icon
      >
        <el-form-item label="模板名称" prop="templateName">
          <el-input
            v-model.trim="templateForm.templateName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="模板标签" prop="templateTag">
          <el-input
            v-model.trim="templateForm.templateTag"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveTemplate()"
          :loading="isFormSaving"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import Clipboard from "clipboard";
import { doFindImage, doInspect, doFindByTag } from "../../service/docker.js";
import { doSaveTemplate } from "../../service/project";
export default {
  name: "Images",
  data() {
    return {
      imageList: [],
      isLoading: false,
      inspectData: {},
      isInspect: false,
      dialogVisible: false,
      searchText: "",
      templateFormVisible: false,
      templateForm: {
        templateName: "",
        templateTag: "",
        dockerImageId: "",
      },
      isFormSaving: false,
      templateFormRules: {
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1~255 个字符",
            trigger: ["blur", "change"],
          },
        ],
        templateTag: [
          { required: true, message: "请输入模板标签", trigger: "blur" },
          {
            min: 1,
            max: 255,
            message: "长度在 1~255 个字符",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  components: {},
  methods: {
    findAllImages() {
      this.isLoading = true;
      const findParam = {
        all: true,
        limit: 40,
      };
      doFindImage(findParam)
        .then((res) => {
          this.imageList = res.data.data;
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    inspect(id) {
      this.isInspect = true;
      doInspect(id)
        .then((res) => {
          this.isInspect = false;
          this.inspectData = res.data.data;
          this.dialogVisible = true;
        })
        .catch(() => {
          this.isInspect = false;
        });
    },
    formatImageID(row, column, cellValue) {
      const start = 7;
      let end = 7 * 3;
      return cellValue.substring(start, end);
    },
    copyID() {
      const copyBtn = new Clipboard("#copy-btn");
      const that = this;
      copyBtn.on("success", function (e) {
        that.$message.success("已复制到剪贴板");
        e.clearSelection();
        copyBtn.destroy();
      });
    },
    searchImages() {
      this.isLoading = true;
      doFindByTag(this.searchText)
        .then((res) => {
          this.isLoading = false;
          this.imageList = res.data.data;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    showTemplateForm(id) {
      this.templateFormVisible = true;
      this.templateForm.dockerImageId = id;
    },
    saveTemplate() {
      let validResult = true;

      this.$refs.templateForm.validate((valid) => {
        if (!valid) {
          validResult = false;
          return false;
        }
      });

      if (!validResult) {
        return;
      }

      this.isFormSaving = true;
      doSaveTemplate({
        ...this.templateForm,
      })
        .then(() => {
          this.isFormSaving = false;
          this.templateFormVisible = false;
          this.$message.success("保存完成");
        })
        .catch(() => {
          this.isFormSaving = false;
        });
    },
  },
  computed: {
    tableData() {
      const list = this.imageList;
      return list;
    },
  },
  created() {
    this.findAllImages();
  },
};
</script>


<style scoped>
.el-divider__text {
  font-weight: 800;
  font-size: 0.4rem;
}

.jv-container {
  font-size: 0.4rem;
}

#search-container {
  margin-bottom: 10px;
}

#search-container .el-input {
  width: 40%;
}

#search-btn {
  margin-left: 10px;
}

#template-form .el-input {
  width: 80%;
}
</style>