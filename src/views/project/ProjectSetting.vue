<template>
  <div id="setting-container">
    <el-divider content-position="left">基础配置</el-divider>
    <div>a</div>
    <el-divider content-position="left">项目配置</el-divider>
    <div>a</div>
  </div>
</template>


<script>
export default {
  name: "ProjectsSetting",
  data() {
    return {
      project: {},
    };
  },
  created() {
    this.project = {
      id: this.$route.params.id,
      name: this.$route.params.name,
    };
  },
  methods: {},
};
</script>


<style scoped lang="scss">
@import "../../utils/globla.scss";
.el-divider__text {
  @extend .divider-text;
}
</style>