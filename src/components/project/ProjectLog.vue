<template>
  <div id="project-log-container">
    <el-dialog
      id="project-log-dialog"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="activeName" id="project-log-tabs" @tab-click="tabClick">
        <el-tab-pane label="部署日志" name="build">
          <el-input
            class="log-container"
            type="textarea"
            v-model="log.build"
            :rows="log.rows"
            v-loading.fullscrees.lock="fullScreenLoading"
          >
          </el-input>
        </el-tab-pane>

        <el-tab-pane label="容器日志" name="container" v-if="isSuccess">
          <div id="container-log-since">
            <el-date-picker
              type="datetime"
              v-model="since"
              placeholder="选择日志的开始时间，默认0"
            >
            </el-date-picker>
            <el-button @click="findContainerLog()">查找</el-button>
          </div>
          <el-input
            class="log-container"
            type="textarea"
            v-model="log.container"
            :rows="log.rows"
            v-loading.fullscrees.lock="fullScreenLoading"
          >
          </el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>


<script>
import {
  doFindBuildLog,
  doFindContainerLog,
} from "../../service/projectContainer";
export default {
  name: "ProjectLog",
  data() {
    return {
      dialogVisible: false,
      activeName: "build",
      log: {
        build: "",
        container: "",
        rows: 20,
      },
      since: new Date(),
      isSuccess: false,
      projectContainerId: "",
      fullScreenLoading: false,
    };
  },
  methods: {
    switch(id, success) {
      this.dialogVisible = !this.dialogVisible;
      if (this.dialogVisible) {
        this.fullScreenLoading = true;
        this.projectContainerId = id;
        this.isSuccess = success;
        this.findBuildLog();
      }
    },
    findBuildLog() {
      doFindBuildLog(this.projectContainerId)
        .then((res) => {
          this.log.build = res.data.data;
          this.fullScreenLoading = false;
        })
        .catch(() => {
          this.fullScreenLoading = false;
        });
    },
    findContainerLog() {
      const since = Math.round(this.since.getTime() / 1000);
      doFindContainerLog(this.projectContainerId, since)
        .then((res) => {
          this.log.container = res.data.data;
          this.fullScreenLoading = false;
        })
        .catch(() => {
          this.fullScreenLoading = false;
        });
    },
    tabClick(e) {
      if (e.name === "container") {
        this.fullScreenLoading = true;
        this.findContainerLog();
      }
    },
  },
};
</script>


<style lang="scss">
#project-log-dialog {
  .el-dialog__body {
    padding: 10px 5px 5px 10px;
  }
}
#project-log-tabs {
  .el-tabs__header {
    margin-bottom: 10px;
  }
}

#container-log-since {
  margin-bottom: 0.2rem;
  .el-button {
    margin-left: 0.3rem;
  }
}
</style>

<style scoped lang="scss">
</style>