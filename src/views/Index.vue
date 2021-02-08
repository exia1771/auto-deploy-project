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
      ],
    };
  },
};
</script>


<style scoped>
</style>