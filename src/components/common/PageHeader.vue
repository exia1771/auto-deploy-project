<template>
  <div id="header-container" class="box-shadow">
    <div id="header-logo-title-container">
      <div id="header-logo">
        <img :src="logo.path" />
      </div>
      <div id="header-title" class="center-items-container">
        <div>Auto Deploy Platform</div>
        <div :style="slotStyle">
          <slot name="title"></slot>
        </div>
      </div>
    </div>

    <div id="header-menu-avatar-container" v-show="username !== null">
      <div id="header-menu" class="center-items-container"></div>
      <el-dropdown trigger="click">
        <el-avatar
          id="header-avatar"
          class="center-items-container"
          icon="el-icon-user-solid"
        >
        </el-avatar>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <el-dropdown-item>
            <i class="el-icon-user icon-margin-right"></i>管理您的账号
          </el-dropdown-item>
          <el-dropdown-item>
            <i class="el-icon-switch-button icon-margin-right"></i>注销
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>


<script>
import { getUsername } from "../../utils/auth";
export default {
  name: "PageHeader",
  data() {
    return {
      logo: {
        path: require("/src/assets/logo.jpg"),
        style: {},
      },
      slotStyle: {},
    };
  },
  methods: {
    changeSlotStyle(style) {
      this.slotStyle = style;
    },
  },
  computed: {
    username() {
      return getUsername();
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