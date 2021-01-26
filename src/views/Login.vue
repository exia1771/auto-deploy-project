<template>
  <div id="login-container">
    <page-header ref="pageHeader">
      <template v-slot:title>
        <div>登录</div>
      </template>
    </page-header>
    <div id="image-poster">
      <img :src="posterPath" />
    </div>
    <div id="login-grid" class="box-shadow">
      <div id="login-grid-header">
        <div
          id="login-grid-login"
          :class="
            active.login === true
              ? 'login-header-flex active'
              : 'login-header-flex'
          "
          @click="changeGridContent('LoginComponent')"
        >
          <div>
            <i class="el-icon-user"></i>
          </div>
          <div class="">登录</div>
        </div>
        <div
          id="login-grid-submit"
          :class="
            active.submit === true
              ? 'login-header-flex active'
              : 'login-header-flex'
          "
          @click="changeGridContent('SubmitComponent')"
        >
          <div>
            <i class="el-icon-s-custom"></i>
          </div>
          <div>注册</div>
        </div>
      </div>
      <div id="login-grid-content">
        <keep-alive>
          <component :is="componentId"></component>
        </keep-alive>
      </div>
    </div>
  </div>
</template>


<script>
import PageHeader from "../components/common/PageHeader.vue";
import LoginComponent from "../components/login/LoginComponent";
import SubmitComponent from "../components/login/SubmitComponent";

export default {
  components: { PageHeader, LoginComponent, SubmitComponent },
  name: "Login",
  data() {
    return {
      componentId: "LoginComponent",
      posterPath: require("../../src/assets/poster.png"),
      active: {
        login: true,
        submit: false,
      },
    };
  },
  methods: {
    changeGridContent(id) {
      this.componentId = id;
      if (id === "LoginComponent") {
        this.active.login = true;
        this.active.submit = false;
      } else if (id === "SubmitComponent") {
        this.active.login = false;
        this.active.submit = true;
      }
    },
  },
  mounted() {
    this.$refs.pageHeader.changeSlotStyle({
      color: "#000033",
      margin: "0 0 0 20px",
    });
  },
};
</script>


<style scoped>
#login-grid {
  position: fixed;
  right: 10%;
  top: 15%;
  display: grid;
  width: 7.5rem;
  height: 7rem;
  grid-template-rows: 10% 90%;
}

#login-grid-header {
  display: flex;
  border-bottom: 1px solid #dddddd;
  font-size: 0.3rem;
  color: #666666;
  cursor: pointer;
}

.active {
  color: #0099ff;
  border-bottom: 1px solid #0099ff;
}

#login-grid-header :hover {
  color: #0099ff;
}

#login-grid-login {
  flex: 1;
  border-right: 1px solid #dddddd;
}

#login-grid-submit {
  flex: 1;
}

.login-header-flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-header-flex div i {
  margin-right: 8px;
}

#image-poster {
  position: fixed;
  top: 25%;
  left: 15%;
}

#image-poster img {
  width: 6.25rem;
  height: 3.75rem;
}
</style>