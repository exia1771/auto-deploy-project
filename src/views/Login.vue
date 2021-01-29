<template>
  <div id="login-container">
    <page-header ref="pageHeader">
      <template v-slot:title>
        <div>登录</div>
      </template>
    </page-header>
    <div id="login-bottom">
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
  </div>
</template>


<script>
import PageHeader from "../components/common/PageHeader.vue";
import LoginComponent from "../components/login/LoginComponent";
import SubmitComponent from "../components/login/SubmitComponent";
import { autoLogin } from "../service/login.js";

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
    async login() {
      if ((await autoLogin()) === true) {
        this.$router.replace({ name: "Index" });
      }
    },
  },
  created() {
    this.login();
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
#login-bottom {
  display: flex;
  margin-top: 1.5rem;
}

#login-grid {
  display: grid;
  margin-left: 3rem;
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
  margin-top: 1.4rem;
  margin-left: 3rem;
}

#image-poster img {
  width: 6.25rem;
  height: 3.75rem;
}
</style>