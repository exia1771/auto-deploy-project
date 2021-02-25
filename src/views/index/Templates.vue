<template>
  <div id="template-container">
    <el-divider content-position="left">模板</el-divider>
    <div id="template-header">
      <el-input
        placeholder="模板名称"
        prefix-icon="el-icon-search"
        v-model.trim="searchText"
      >
      </el-input>
      <el-button id="search-btn" type="primary" plain @click="search">
        搜索
      </el-button>

      <el-button id="reset-btn" type="success" plain @click="reset">
        复原
      </el-button>
    </div>
    <el-table :data="tableData" stripe border :loading="isLoading">
      <el-table-column prop="id" label="ID" width="180" sortable>
      </el-table-column>
      <el-table-column
        prop="templateName"
        label="模板名称"
        width="180"
        sortable
      >
      </el-table-column>
      <el-table-column prop="templateTag" label="模板标签" sortable width="180">
      </el-table-column>
      <el-table-column prop="dockerImageId" label="镜像ID" width="180">
      </el-table-column>
      <el-table-column
        prop="creationTime"
        label="创建时间"
        :formatter="dateFormat"
        sortable
        width="180"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="修改时间"
        :formatter="dateFormat"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="success"
            id="update-button"
            @click="updateTemplate(scope.row)"
            :disabled="!user.role.updatePri"
          >
            修改
          </el-button>
          <el-popconfirm
            title="这是一段内容确定删除吗？"
            @confirm="deleteTemplate"
          >
            <el-button
              type="danger"
              :disabled="!user.role.deletePri"
              @click="templateForm.id = scope.row.id"
              slot="reference"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      id="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageRequest.current"
      :page-sizes="[1, 5, 10, 20, 50, 100]"
      :page-size="pageRequest.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageRequest.total"
    >
    </el-pagination>

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
          <el-input v-model.trim="templateForm.templateName" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="模板标签" prop="templateTag">
          <el-input v-model.trim="templateForm.templateTag" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="镜像ID" prop="dockerImageId">
          <el-input
            v-model.trim="templateForm.dockerImageId"
            autocomplete="off"
          >
          </el-input>
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
import {
  doPageAll,
  doPageByName,
  doSaveTemplate,
  doDeleteById,
} from "../../service/project";
import { objEqual, dateFormatter } from "../../utils/common.js";
export default {
  name: "Templates",
  data() {
    return {
      pageRequest: {
        current: 1,
        size: 5,
        total: 0,
      },
      searchText: "",
      templateList: [],
      isLoading: false,
      isSearch: false,
      templateFormVisible: false,
      templateForm: {
        id: "",
        templateName: "",
        templateTag: "",
        dockerImageId: "",
      },
      oldTemplateForm: { templateName: "", templateTag: "", dockerImageId: "" },
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
        dockerImageId: [
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
  methods: {
    pageAll() {
      this.isLoading = true;
      doPageAll(this.pageRequest)
        .then((res) => {
          this.isLoading = false;
          this.pageRequest.total = res.data.data.total;
          this.templateList = res.data.data.records;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    handleSizeChange(size) {
      this.pageRequest.size = size;
      if (this.isSearch) {
        this.search();
      } else {
        this.pageAll();
      }
    },
    handleCurrentChange(size) {
      this.pageRequest.current = size;
      if (this.isSearch) {
        this.search();
      } else {
        this.pageAll();
      }
    },
    dateFormat(row, column, cellValue) {
      return dateFormatter(cellValue);
    },
    search() {
      if (!this.isSearch) {
        this.pageRequest.current = 1;
      }
      this.isLoading = true;
      this.isSearch = true;
      doPageByName({
        ...this.pageRequest,
        templateName: this.searchText,
      })
        .then((res) => {
          this.isLoading = false;
          this.pageRequest.total = res.data.data.total;
          this.templateList = res.data.data.records;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    reset() {
      this.isSearch = false;
      this.pageRequest.current = 1;
      this.pageAll();
    },
    updateTemplate(template) {
      this.templateForm.templateName = template.templateName;
      this.templateForm.id = template.id;
      this.templateForm.templateTag = template.templateTag;
      this.templateForm.dockerImageId = template.dockerImageId;
      this.oldTemplateForm = { ...this.templateForm };
      this.templateFormVisible = true;
    },
    deleteTemplate() {
      doDeleteById(this.templateForm.id).then((res) => {
        if (res.data.data === true) {
          this.$message.success("删除成功");
        } else {
          this.$message.error("删除失败");
        }
        this.pageAll();
      });
    },
    saveTemplate() {
      if (objEqual(this.templateForm, this.oldTemplateForm)) {
        this.$message.success("保存成功");
        return;
      }

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
          this.pageAll();
        })
        .catch(() => {
          this.isFormSaving = false;
        });
    },
  },
  created() {
    this.pageAll();
  },
  computed: {
    tableData() {
      const list = this.templateList;
      return list;
    },
    user() {
      return this.$store.state.user;
    },
  },
};
</script>


<style scoped>
.el-divider__text {
  font-weight: 800;
  font-size: 0.4rem;
}

#pagination {
  margin-top: 10px;
}

#template-header {
  margin-bottom: 10px;
}

#template-header .el-input {
  width: 30%;
}

#search-btn {
  margin-left: 10px;
}

#update-button {
  margin-right: 10px;
}
</style>