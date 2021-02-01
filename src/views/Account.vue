<template>
  <div id="account-container" class="max-height">
    <frame :headerTitle="headerTitle" :menuList="menuList"></frame>
  </div>
</template>


<script>
import Frame from "./Frame";
export default {
  name: "Account",
  components: {
    Frame,
  },
  data() {
    return {
      headerTitle: "账号",
      menuList: [
        {
          title: "基本信息",
          children: [
            {
              title: "个人",
              icon: "el-icon-user-solid",
              type: "component",
              name: "Profile",
            },
            {
              title: "安全",
              icon: "el-icon-user-solid",
              type: "component",
              name: "Profile",
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