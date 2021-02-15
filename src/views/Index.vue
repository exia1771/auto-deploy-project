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
          groupName: "工程",
          children: [
            {
              title: "模板",
              icon: "el-icon-takeaway-box",
              name: "Templates",
            },
          ],
        },
      ],
    };
  },
};
</script>


<style scoped>
</style>