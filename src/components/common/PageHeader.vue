<template>
  <div id="header-container" class="box-shadow max-width">
    <div id="header-logo-title-container">
      <div id="header-logo">
        <img :src="logo.path" />
      </div>
      <div id="header-title" class="center-items-container" @click="toIndex">
        <div>Auto Deploy Platform</div>
        <div :style="slotStyle">
          <slot name="title"></slot>
        </div>
      </div>
    </div>

    <div id="header-menu-avatar-container" v-show="isShow">
      <div id="header-menu" class="center-items-container"></div>
      <el-dropdown trigger="click">
        <div>
          <img
            v-if="user.avatarAddress"
            :src="fileServerURL + user.avatarAddress"
            class="avatar box-shadow"
            id="avatar-img"
          />
          <el-avatar v-else :size="50" icon="el-icon-user-solid"></el-avatar>
        </div>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <el-dropdown-item id="manage-account-item">
            <i class="el-icon-user icon-margin-right"></i>管理您的账号
          </el-dropdown-item>
          <el-dropdown-item id="logout-item">
            <i class="el-icon-switch-button icon-margin-right"></i>
            注销
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>


<script>
import { removeToken } from "../../utils/auth.js";
import { doLogout } from "../../service/login";
import { FILE_SERVER_URL } from "../../../config/global";
export default {
  name: "PageHeader",
  components: {},
  data() {
    return {
      logo: {
        path: require("/src/assets/logo.jpg"),
        style: {},
      },
      slotStyle: {
        color: "#000033",
        margin: "0 0 0 20px",
      },
      fileServerURL: FILE_SERVER_URL,
    };
  },
  methods: {
    changeSlotStyle(style) {
      this.slotStyle = style;
    },
    logout() {
      let that = this;
      let item = document.getElementById("logout-item");
      item.onclick = async function () {
        await doLogout().catch(() => {});
        removeToken();
        that.$router.replace({ name: "Login" });
      };
    },
    showProfile() {
      let that = this;
      let item = document.getElementById("manage-account-item");
      item.onclick = () => {
        let profile = that.$router.resolve({ name: "Account" });
        window.open(profile.href, "_blank");
      };
    },
    toIndex() {
      this.$router.push({ name: "Deploy" });
    },
  },
  mounted() {
    this.logout();
    this.showProfile();
  },
  computed: {
    isShow() {
      return this.$route.name != "Login";
    },
    user() {
      let user = this.$store.state.user;
      return user;
    },
  },
};
</script>


<style scoped>
#header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.center-items-container {
  display: flex;
  align-items: center;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

#header-logo-title-container {
  display: flex;
}

#header-menu-avatar-container {
  display: flex;
  margin-right: 0.4rem;
}

#header-title {
  margin-left: 0.4rem;
  font-size: 0.5rem;
  font-weight: 1000;
  color: #0099ff;
  cursor: pointer;
}

#header-avatar {
  justify-content: center;
}

.dropdown-menu {
  font-size: 0.3rem;
}

.icon-margin-right {
  margin-right: 0.4rem;
}
</style>