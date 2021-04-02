<template>
  <div id="project-detail-container">
    <el-divider content-position="left">部署信息</el-divider>
    <el-form
      id="project-detail-form"
      :model="searchOriginForm"
      ref="searchOriginForm"
      label-width="80px"
    >
      <el-form-item label="工程名称">
        <div class="info-font">{{ this.project.name }}</div>
      </el-form-item>
      <el-form-item label="工程标识">
        <div class="info-font">{{ this.project.identification }}</div>
      </el-form-item>
      <div class="flex-container">
        <el-form-item class="flex-item" label="发布者">
          <el-input v-model="searchOriginForm.publisher"></el-input>
        </el-form-item>
        <el-form-item label="GitTag" class="flex-item">
          <el-select
            v-model="searchOriginForm.gitTag"
            placeholder="请选择标签"
            filterable
            clearable
            no-data-text="指定的仓库没有Tag"
          >
            <el-option
              v-for="(item, index) in tagOptions"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称空间" class="flex-item">
          <el-select
            v-model="searchOriginForm.namespaceId"
            filterable
            clearable
            placeholder="请选择名称空间"
          >
            <el-option
              v-for="(item, index) in namespaceOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="flex-item" label="日期">
          <el-date-picker
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            v-model="searchOriginForm.pubDate"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div id="detail-search-button-container">
        <el-button type="primary" @click="$refs.projectDeployForm.switch()">
          新增部署
        </el-button>
        <el-button type="primary" @click="refreshTableData">查找</el-button>
      </div>
    </el-form>

    <el-divider content-position="left">历史</el-divider>

    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      :default-sort="{ prop: 'pubDate', order: 'descending' }"
    >
      <el-table-column
        prop="namespaceId"
        label="名称空间"
        :formatter="tableFormatNamespace"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="gitTag" label="Tag" width="180"> </el-table-column>
      <el-table-column prop="publisher" label="发布者" width="180">
      </el-table-column>
      <el-table-column
        prop="pubDate"
        label="日期"
        :formatter="tableFormatDate"
        width="230"
      >
      </el-table-column>
      <el-table-column prop="status" label="状态" width="180">
        <template slot-scope="scope">
          <div
            class="icon-font-container success"
            v-if="scope.row.status === 0"
          >
            <i class="el-icon-sunny"></i>
            部署成功
          </div>
          <div
            class="icon-font-container failure"
            v-else-if="scope.row.status === 1"
          >
            <i class="el-icon-lightning"></i>
            部署失败
          </div>
          <div
            class="icon-font-container waiting"
            v-else-if="scope.row.status === 2"
          >
            <i class="el-icon-loading"></i>
            正在部署
          </div>
          <div
            class="icon-font-container abort"
            v-else-if="scope.row.status === 3"
          >
            <i class="el-icon-cloudy-and-sunny"></i>
            终止构建
          </div>
          <div class="icon-font-container failure" v-else>
            <i class="el-icon-heavy-rain"></i>
            终止构建失败
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip
            effect="light"
            content="日志"
            placement="top"
            class="button-group"
          >
            <el-button
              @click="logSwitch(scope.row.id, scope.row.status === 0)"
              plain
              circle
              type="info"
              icon="el-icon-document"
            ></el-button>
          </el-tooltip>

          <el-tooltip
            effect="light"
            content="详细信息"
            placement="top"
            class="button-group"
          >
            <el-button
              plain
              circle
              type="info"
              icon="el-icon-view"
              @click="reviewInfo(scope.row)"
            ></el-button>
          </el-tooltip>

          <el-tooltip
            effect="light"
            content="重新部署"
            placement="top"
            class="button-group"
          >
            <el-button
              @click="reDeploy(scope.row.id)"
              plain
              circle
              type="primary"
              icon="el-icon-refresh-left"
            ></el-button>
          </el-tooltip>

          <el-tooltip
            effect="light"
            content="取消构建"
            placement="top"
            class="button-group"
            v-if="scope.row.status === 2"
          >
            <el-popconfirm title="确定取消构建？" ref="stopBuild">
              <el-button
                slot="reference"
                plain
                circle
                type="warning"
                @click="stopBuild(scope.row.id)"
                icon="el-icon-switch-button"
              ></el-button>
            </el-popconfirm>
          </el-tooltip>

          <el-tooltip
            effect="light"
            content="重启"
            placement="top"
            class="button-group"
            v-if="scope.row.status === 0"
          >
            <el-button
              plain
              circle
              type="warning"
              @click="restartContainer(scope.row.id)"
              icon="el-icon-refresh"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      id="project-detail-pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageRequest.current"
      :page-sizes="[1, 5, 10, 20, 50, 100, 500]"
      :page-size="pageRequest.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageRequest.total"
    >
    </el-pagination>

    <project-deploy
      ref="projectDeployForm"
      :tagOptions="tagOptions"
      :namespaceOptions="namespaceOptions"
      :buildTypeOptions="buildTypeOptions"
      @afterSave="refreshTableData"
    ></project-deploy>

    <project-log ref="projectLog"></project-log>

    <el-dialog title="详细信息" :visible.sync="infoVisible">
      <el-form :model="infoForm" label-width="120px">
        <el-form-item label="构建类型">
          <el-input
            autocomplete="off"
            disabled
            v-model="infoForm.buildType"
          ></el-input>
        </el-form-item>
        <el-form-item label="编译命令">
          <el-input
            autocomplete="off"
            disabled
            v-model="infoForm.buildCommand"
          ></el-input>
        </el-form-item>
        <el-form-item label="拷贝到容器(当前所在目录:/)">
          <el-input
            autocomplete="off"
            disabled
            v-model="infoForm.cpToContainerPath"
          ></el-input>
        </el-form-item>
        <el-form-item label="运行命令">
          <el-input
            autocomplete="off"
            disabled
            v-model="infoForm.runCommand"
          ></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>


<script>
import ProjectDeploy from "../../components/project/ProjectDeploy.vue";
import { dateFormatter } from "../../utils/common";
import {
  doFindRepositoryTags,
  doFindPagedBySpecificFields,
  doSaveById,
  doRestartContainer,
  doStopBuild,
} from "../../service/projectContainer";
import { doFindAllNamespace } from "../../service/namespace";
import { doFindProjectById } from "../../service/project";
import { doFindAllBuildTypes } from "../../service/buildType";
import ProjectLog from "../../components/project/ProjectLog.vue";
export default {
  components: { ProjectDeploy, ProjectLog },
  name: "ProjectsDetail",
  data() {
    return {
      project: {},
      tableData: [],
      searchOriginForm: {
        publisher: "",
        gitTag: "",
        namespaceId: "",
        pubDate: [],
      },
      infoForm: {
        buildType: "",
        buildCommand: "",
        runCommand: "",
        cpToContainerPath: "",
      },
      tagOptions: [],
      namespaceOptions: [],
      buildTypeOptions: [],
      pageRequest: {
        current: 1,
        size: 10,
        total: 500,
      },
      infoVisible: false,
    };
  },
  async created() {
    this.project = {
      id: this.$route.params.id,
      name: this.$route.params.name,
    };
    this.findProjectById();
    this.findRepositoryTags("");
    await this.findAllNamespace();
    this.findPagedList({ ...this.pageRequest, ...this.searchForm });
    this.findAllBuildTypes();
  },
  computed: {
    searchForm() {
      const form = { ...this.searchOriginForm };
      if (form.pubDate.length === 1) {
        form.pubStartDate = dateFormatter(form.pubDate[0]);
      } else if (form.pubDate.length === 2) {
        form.pubStartDate = dateFormatter(form.pubDate[0]);
        form.pubEndDate = dateFormatter(form.pubDate[1]);
      }
      return form;
    },
  },
  methods: {
    findProjectById() {
      doFindProjectById(this.project.id).then((res) => {
        const data = res.data.data;
        this.project.name = data.name;
        this.project.identification = data.identification;
      });
    },
    findRepositoryTags(keyword) {
      doFindRepositoryTags(this.project.id, keyword).then((res) => {
        const data = res.data.data;
        this.tagOptions = data;
      });
    },
    async findAllNamespace() {
      await doFindAllNamespace().then((res) => {
        this.namespaceOptions = res.data.data;
      });
    },
    findPagedList(page) {
      doFindPagedBySpecificFields({
        ...page,
        projectId: this.project.id,
      }).then((res) => {
        const data = res.data.data;
        this.tableData = data.records;
        this.pageRequest.current = data.current;
        this.pageRequest.size = data.size;
        this.pageRequest.total = data.total;
      });
    },
    tableFormatNamespace(row, column, cellValue) {
      const namespace = this.namespaceOptions.find((value) => {
        return value.id === cellValue;
      });
      return namespace.name;
    },
    tableFormatDate(row, column, cellValue) {
      return dateFormatter(cellValue);
    },
    tableFormatStatus(row, column, cellValue) {
      console.log(cellValue);
      if (cellValue === 0) {
        return "部署成功";
      } else if (cellValue === 1) {
        return "部署失败";
      } else if (cellValue === 2) {
        return "正在部署";
      } else if (cellValue === 3) {
        return "终止构建";
      } else {
        return "终止构建失败";
      }
    },
    handleSizeChange(size) {
      this.pageRequest.size = size;
      this.findPagedList({ ...this.pageRequest, ...this.searchForm });
    },
    handleCurrentChange(current) {
      this.pageRequest.current = current;
      this.findPagedList({ ...this.pageRequest, ...this.searchForm });
    },
    refreshTableData() {
      this.findPagedList({ ...this.pageRequest, ...this.searchForm });
    },
    logSwitch(id, isSuccess) {
      this.$refs.projectLog.switch(id, isSuccess);
    },
    reDeploy(id) {
      this.$message.info("正在重新部署，请勿重复点击");
      doSaveById(id).then(() => {
        this.refreshTableData();
      });
    },
    reviewInfo(row) {
      this.infoVisible = true;
      this.infoForm.buildType = this.buildTypeOptions.find((value) => {
        return value.id === row.buildTypeId;
      }).name;
      this.infoForm.buildCommand = row.buildCommand;
      this.infoForm.runCommand = row.runCommand;
      this.infoForm.cpToContainerPath = row.cpToContainerPath;
    },
    findAllBuildTypes() {
      doFindAllBuildTypes().then((res) => {
        const data = res.data.data;
        this.buildTypeOptions = data;
      });
    },
    stopBuild(id) {
      this.$refs.stopBuild.confirm = () => {
        doStopBuild(id)
          .then(() => {
            return;
          })
          .catch(() => {
            return;
          });
      };
    },
    restartContainer(id) {
      doRestartContainer(id).then((res) => {
        this.$message.success(res.data.data);
      });
    },
  },
};
</script>


<style scoped lang="scss">
@import "../../utils/globla.scss";

.el-divider__text {
  @extend .divider-text;
}

#project-detail-form {
  width: 98%;
  margin-top: 1rem;
}

.flex-container {
  display: flex;
  .el-form-item {
    margin-bottom: 0;
  }
  .flex-item {
    flex: 1;
  }
  .el-button {
    margin-left: 0.5rem;
  }
}

#detail-search-button-container {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
}

#project-detail-pagination {
  margin-top: 0.3rem;
}

.info-font {
  font-size: 0.3rem;
  font-weight: bolder;
}

.failure {
  color: red;
}

.success {
  color: green;
}

.waiting {
  color: #0099ff;
}

.abort {
  color: #ffcc33;
}

.icon-font-container {
  font-size: 0.3rem;
  font-weight: 500;
}

.el-tooltip {
  margin-left: 10px;
}
</style>