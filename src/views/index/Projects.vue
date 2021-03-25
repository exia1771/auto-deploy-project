<template>
  <div id="project-container">
    <el-divider content-position="left">工程</el-divider>
    <div id="project-header">
      <div id="project-header-left">
        <el-input
          placeholder="工程名称、工程标识、拥有者"
          prefix-icon="el-icon-search"
          v-model.trim="searchText"
        >
        </el-input>
        <el-button
          id="search-btn"
          type="success"
          plain
          @click="
            isSearch = true;
            findPagedProjectsByKeyword();
          "
        >
          搜索
        </el-button>

        <el-button
          id="reset-btn"
          type="info"
          plain
          @click="
            isSearch = false;
            findPagedProjectsByCurrentUser();
          "
        >
          复原
        </el-button>

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
      <el-table :data="tableData" stripe v-loading="tableLoading" border>
        <el-table-column prop="name" label="工程名称" width="280">
        </el-table-column>
        <el-table-column prop="identification" label="工程标识" width="280">
        </el-table-column>
        <el-table-column prop="username" label="拥有者"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              content="查看"
              placement="top"
              class="button-group"
            >
              <el-button
                @click="toDetail(scope.row)"
                plain
                circle
                type="primary"
                icon="el-icon-view"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="light"
              content="配置"
              placement="top"
              class="button-group"
            >
              <el-button
                @click="toSetting(scope.row)"
                plain
                circle
                type="info"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              effect="light"
              content="成员配置"
              placement="top"
              class="button-group"
            >
              <el-button
                plain
                circle
                type="success"
                icon="el-icon-s-custom"
              ></el-button>
            </el-tooltip>

            <el-popconfirm
              title="确定删除吗？"
              @confirm="deleteProjectById(scope)"
              class="button-group"
            >
              <el-tooltip
                effect="light"
                content="删除"
                placement="top"
                slot="reference"
              >
                <el-button
                  plain
                  circle
                  type="danger"
                  icon="el-icon-delete"
                ></el-button>
              </el-tooltip>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="[1, 5, 10, 20, 50, 100, 500]"
      :page-size="pageRequest.size"
      :current-page="pageRequest.current"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageRequest.total"
    >
    </el-pagination>

    <el-dialog
      id="project-dialog"
      :visible.sync="projectForm.visible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="projectForm.form"
        :rules="projectForm.rules"
        ref="projectForm"
        status-icon
      >
        <div id="form-select-container" class="flex-container">
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
              no-data-text="请先选择模板"
              @change="changeProjectTemplateId"
            >
              <el-option
                v-for="(item, index) in templateTagOptions.data"
                :key="index"
                :label="item.templateTag"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="flex-container">
          <el-form-item label="工程名称" prop="name" id="project-name">
            <el-input
              v-model="projectForm.form.name"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>

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
  doFindPagedProjectsByCurrentUser,
  doFindPagedProjectsByKeyword,
  doDeleteProjectById,
} from "../../service/project";
import {
  doFindDistinctNamespaces,
  doSaveProjectConfig,
} from "../../service/projectConfig";
export default {
  name: "Projects",
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
        size: 10,
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
          configId: "",
          namespace: "",
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
    this.findPagedProjectsByCurrentUser();
  },
  methods: {
    handleSizeChange(size) {
      this.pageRequest.size = size;
      this.pageAll();
    },
    handleCurrentChange(current) {
      this.pageRequest.current = current;
      this.pageAll();
    },
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
      await doSaveProjectConfig({})
        .then((res) => {
          this.projectForm.form.configId = res.data.data.id;
        })
        .catch(() => {
          this.projectForm.loading = false;
          this.projectForm.form.configId = null;
        });

      if (this.projectForm.form.configId === null) {
        return;
      }

      doSaveProject({
        ...this.projectForm.form,
      })
        .then(() => {
          this.projectForm.loading = false;
          this.projectForm.visible = false;
          this.$message.success("保存成功");
          this.findPagedProjectsByCurrentUser();
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
          this.projectForm.form.templateTag = res.data.data[0].templateTag;
          this.projectForm.form.templateId = res.data.data[0].id;
        })
        .catch(() => {
          this.templateTagOptions.loading = false;
        });
    },
    changeProjectTemplateId(value) {
      this.projectForm.form.templateId = value;
    },
    findPagedProjectsByCurrentUser() {
      doFindPagedProjectsByCurrentUser(this.pageRequest)
        .then((res) => {
          this.tableData = res.data.data.records;
          this.pageRequest.total = res.data.data.total;
          this.pageRequest.current = res.data.data.current;
          this.pageRequest.size = res.data.data.size;
        })
        .catch(() => {
          this.tableData = [];
        });
    },
    findPagedProjectsByKeyword() {
      if (this.searchText === null || this.searchText.trim().length === 0) {
        return this.findPagedProjectsByCurrentUser();
      }

      doFindPagedProjectsByKeyword(this.searchText, this.pageRequest)
        .then((res) => {
          this.tableData = res.data.data.records;
          this.pageRequest.total = res.data.data.total;
          this.pageRequest.current = res.data.data.current;
          this.pageRequest.size = res.data.data.size;
        })
        .catch(() => {
          this.tableData = [];
        });
    },
    pageAll() {
      if (!this.isSearch) {
        this.findPagedProjectsByCurrentUser();
      } else {
        this.findPagedProjectsByKeyword();
      }
    },
    deleteProjectById(scope) {
      this.tableData.splice(scope.$index, 1);
      doDeleteProjectById(scope.row.id)
        .then(() => {
          this.pageAll();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.pageAll();
        });
    },
    toDetail(project) {
      this.$router.push({
        name: "ProjectsDetail",
        params: { id: project.id, name: project.name },
      });
    },
    toSetting(project) {
      this.$router.push({
        name: "ProjectsSetting",
        params: {
          id: project.id,
          name: project.name,
          configId: project.configId,
        },
      });
    },
    findDistinctNamespaces() {
      this.namespaceOptions.data = [];
      this.namespaceOptions.loading = true;
      doFindDistinctNamespaces()
        .then((res) => {
          this.namespaceOptions.loading = false;
          this.namespaceOptions.data = res.data.data.map((option) => {
            return option.namespace;
          });
        })
        .catch(() => {
          this.namespaceOptions.loading = false;
        });
    },
  },
};
</script>


<style>
#project-dialog .el-dialog__header {
  padding: 0px;
}

#project-dialog .el-dialog__body {
  padding: 0px 10px 0 10px;
}

#project-dialog .el-dialog__footer {
  padding: 0 10px 10px 10px;
}
</style>

<style scoped lang="scss">
@import "../../utils/globla.scss";
.el-divider__text {
  @extend .divider-text;
}

.el-dialog__wrapper {
  top: auto;
}

.el-form-item {
  margin: 5px;
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
  padding-top: 0.5rem;
}

.select-item {
  flex: 1;
}

#project-name {
  flex: 2;
}

.flex-container {
  display: flex;
}

.button-group {
  margin: 0 5px;
}
</style>