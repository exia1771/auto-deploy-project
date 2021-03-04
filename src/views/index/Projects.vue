<template>
  <div id="project-container">
    <el-divider content-position="left">工程</el-divider>
    <div id="project-header">
      <div id="project-header-left">
        <el-input
          placeholder="工程名称"
          prefix-icon="el-icon-search"
          v-model.trim="searchText"
        >
        </el-input>
        <el-button id="search-btn" type="success" plain> 搜索 </el-button>

        <el-button id="reset-btn" type="info" plain> 复原 </el-button>

        <el-button
          id="create-btn"
          type="primary"
          plain
          @click="projectForm.visible = true"
        >
          新增
        </el-button>
      </div>

      <div id="project-header-right"></div>
    </div>
    <div id="projct-table-container">
      <el-table :data="tableData" stripe v-loading="tableLoading">
        <el-table-column prop="name" label="工程名称" width="280">
        </el-table-column>
        <el-table-column prop="identification" label="工程标识" width="280">
        </el-table-column>
        <el-table-column prop="username" label="拥有者"> </el-table-column>
        <el-table-column label="操作">
          <el-button plain type="danger">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
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
      :visible.sync="projectForm.visible"
      :close-on-click-modal="false"
      width="40%"
    >
      <el-form
        :model="projectForm.form"
        :rules="projectForm.rules"
        ref="projectForm"
        status-icon
      >
        <div id="form-select-container">
          <el-form-item
            class="select-item"
            label="选择模板"
            prop="templateName"
          >
            <el-select
              v-model="projectForm.form.templateName"
              filterable
              placeholder="请选择"
              @change="findTagsByTemplateName"
              :loading="templateNameOptions.loading"
            >
              <el-option
                v-for="(item, index) in templateNameOptions.data"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="select-item"
            label="选择模板标签"
            prop="templateTag"
          >
            <el-select
              v-model="projectForm.form.templateTag"
              filterable
              placeholder="请选择"
              :loading="templateTagOptions.loading"
            >
              <el-option
                v-for="(item, index) in templateTagOptions.data"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="工程名称" prop="name">
          <el-input
            v-model="projectForm.form.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="工程标识 (数字、字母、英文减号、下划线) "
          prop="identification"
        >
          <el-input
            v-model="projectForm.form.identification"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="Git地址" prop="gitUrl">
          <el-input
            v-model="projectForm.form.gitUrl"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属用户名" prop="username">
          <el-input
            v-model="projectForm.form.username"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="相关描述" prop="description">
          <el-input
            type="textarea"
            v-model="projectForm.form.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="projectForm.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="saveProject"
          :loading="projectForm.loading"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  doSaveProject,
  doFindDistinctTemplateName,
  doFindTagsByTemplateName,
  doFindTemplateIdByTemplateNameAndTag,
  doFindListByCurrentUser,
} from "../../service/project";
export default {
  name: "Projects",
  data() {
    const checkIdentification = (rule, value, callback) => {
      if (value !== null) {
        if (1 <= value.length && value.length <= 255) {
          const pattern = /^[\w-]+$/;
          if (value.search(pattern) === -1) {
            callback(
              new Error("标识符只允许输入 数字、字母、英文减号、下划线")
            );
          }
        }
        callback();
      }
    };
    const checkGitUrl = (rule, value, callback) => {
      if (value !== null) {
        if (1 <= value.length && value.length <= 255) {
          const pattern = /^(http|https):\/\/.*?\/.*?.git$/;
          if (value.search(pattern) === -1) {
            callback(new Error("请输入正确http(s)方式的Git地址"));
          }
        }
        callback();
      }
    };
    return {
      searchText: "",
      tableData: [],
      tableLoading: false,
      isSearch: false,
      pageRequest: {
        current: 1,
        size: 5,
        total: 0,
      },
      templateNameOptions: {
        loading: false,
        data: [],
      },
      templateTagOptions: {
        loading: false,
        data: [],
      },
      projectForm: {
        form: {
          name: "",
          username: "",
          identification: "",
          gitUrl: "",
          description: "",
          templateName: "",
          templateTag: "",
          templateId: "",
          state: 0,
        },
        rules: {
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
          templateName: [
            {
              required: true,
              message: "请选择需要使用的模板",
              trigger: ["blur", "change"],
            },
          ],
          templateTag: [
            {
              required: true,
              message: "请选择所用模板的标签",
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
          username: [
            {
              required: true,
              message: "请输入项目所属用户",
              trigger: ["blur", "change"],
            },
            {
              min: 1,
              max: 255,
              message: "长度在 1~255 个字符",
              trigger: ["blur", "change"],
            },
          ],
          gitUrl: [
            {
              required: true,
              message: "请输入Git地址",
              trigger: ["blur", "change"],
            },
            {
              min: 1,
              max: 255,
              message: "长度在 1~255 个字符",
              trigger: ["blur", "change"],
            },
            {
              validator: checkGitUrl,
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
        visible: false,
        loading: false,
      },
    };
  },
  created() {
    this.findDistinctTemplateName();
    this.findListByCurrentUser();
  },
  methods: {
    pageAll() {},
    handleSizeChange() {},
    handleCurrentChange() {},
    async saveProject() {
      let validResult = true;
      this.$refs.projectForm.validate((valid) => {
        if (!valid) {
          validResult = false;
          return false;
        }
      });
      if (!validResult) {
        return;
      }
      this.projectForm.loading = true;
      await this.findTemplateIdByTemplateNameAndTag();
      doSaveProject({
        ...this.projectForm.form,
      })
        .then(() => {
          this.projectForm.loading = false;
        })
        .catch(() => {
          this.projectForm.loading = false;
        });
    },
    findDistinctTemplateName() {
      this.templateNameOptions.loading = true;
      doFindDistinctTemplateName()
        .then((res) => {
          this.templateNameOptions.loading = false;
          this.templateNameOptions.data = res.data.data;
        })
        .catch(() => {
          this.templateNameOptions.loading = false;
        });
    },
    findTagsByTemplateName(templateName) {
      this.templateTagOptions.data = [];
      this.templateTagOptions.loading = true;
      doFindTagsByTemplateName(templateName)
        .then((res) => {
          this.templateTagOptions.loading = false;
          this.templateTagOptions.data = res.data.data;
          this.projectForm.form.templateTag = res.data.data[0];
        })
        .catch(() => {
          this.templateTagOptions.loading = false;
        });
    },
    async findTemplateIdByTemplateNameAndTag() {
      await doFindTemplateIdByTemplateNameAndTag(
        this.projectForm.form.templateName,
        this.projectForm.form.templateTag
      ).then((res) => {
        this.projectForm.form.templateId = res.data.data.id;
      });
    },
    findListByCurrentUser() {
      this.tableLoading = true;
      doFindListByCurrentUser()
        .then((res) => {
          this.tableData = res.data.data;
          this.tableLoading = false;
        })
        .catch(() => {
          this.tableLoading = false;
        });
    },
  },
};
</script>


<style scoped>
.el-divider__text {
  font-weight: 800;
  font-size: 0.4rem;
}

.el-form-item {
  margin: 10px;
}

#project-header {
  margin-bottom: 10px;
  display: flex;
}

#project-header .el-input {
  width: 30%;
}

#project-header-left {
  flex: 1;
}

#search-btn {
  margin-left: 10px;
}

#form-select-container {
  display: flex;
}

.select-item {
  flex: 1;
}
</style>