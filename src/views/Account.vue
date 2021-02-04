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
          groupName: "账号信息",
          children: [
            {
              title: "个人",
              icon: "el-icon-user-solid",
              name: "Profile",
            },
            {
              title: "安全",
              icon: "el-icon-lock",
              name: "Safety",
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