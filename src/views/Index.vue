<template>
  <div id="index-container" class="max-height">
    <frame :headerTitle="headerTitle" :menuList="menuList"></frame>
  </div>
</template>


<script>
import Frame from "./Frame";
export default {
  name: "Index",
  components: {
    Frame,
  },
  data() {
    return {
      headerTitle: "主页",
      menuList: [
        {
          groupName: "Docker",
          children: [
            {
              title: "镜像",
              icon: "el-icon-box",
              name: "Images",
            },
          ],
        },
        {
          groupName: "项目",
          children: [
            {
              title: "模板",
              icon: "el-icon-takeaway-box",
              name: "Templates",
            },
            {
              title: "工程",
              icon: "el-icon-suitcase-1",
              name: "Projects",
            },
          ],
        },
      ],
    };
  },
  created() {
    document.title = "个人综合管理";
  },
};
</script>


<style scoped>
</style>