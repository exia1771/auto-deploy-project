<template>
  <div id="project-detail-container">
    <el-divider content-position="left">部署信息</el-divider>
    <el-form id="project-detail-form" ref="form" label-width="80px">
      <div class="flex-container">
        <el-form-item class="flex-item" label="发布者">
          <el-input></el-input>
        </el-form-item>
        <el-form-item class="flex-item" label="Tag">
          <el-input></el-input>
        </el-form-item>
        <el-form-item class="flex-item" label="名称空间">
          <el-input></el-input>
        </el-form-item>
        <el-form-item class="flex-item" label="日期">
          <el-date-picker
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
      </div>
      <div id="detail-search-button-container">
        <el-button type="primary">查找</el-button>
      </div>
    </el-form>

    <el-divider content-position="left">历史</el-divider>
    <el-button type="primary" @click="$refs.projectDeployForm.switch()">
      新增部署
    </el-button>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="name" label="标识" width="180"> </el-table-column>
      <el-table-column prop="date" label="Tag" width="180"> </el-table-column>
      <el-table-column label="名称空间" width="180"> </el-table-column>
      <el-table-column label="发布者" width="180"> </el-table-column>
      <el-table-column label="日期" width="180"> </el-table-column>
      <el-table-column label="操作"> </el-table-column>
    </el-table>

    <project-deploy ref="projectDeployForm"></project-deploy>
  </div>
</template>


<script>
import ProjectDeploy from "../../components/project/ProjectDeploy.vue";
export default {
  components: { ProjectDeploy },
  name: "ProjectsDetail",
  data() {
    return {
      project: {},
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  created() {
    this.project = {
      id: this.$route.params.id,
      name: this.$route.params.name,
    };
  },
};
</script>


<style scoped lang="scss">
@import "../../utils/globla.scss";

.el-divider__text {
  @extend .divider-text;
}

#project-detail-form {
  width: 90%;
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
</style>