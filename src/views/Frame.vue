<template>
  <div id="frame-container" class="max-height">
    <div id="top-frame">
      <page-header></page-header>
    </div>

    <div id="bottom-frame">
      <div id="left-frame" @mousedown="sideBarSpread">
        <page-side-bar ref="sideBar" />
      </div>

      <div id="right-frame" @mousedown="sideBarCollapse" class="box-shadow">
        <section id="right-frame-content">
          <router-view />
        </section>
      </div>
    </div>
  </div>
</template>


<script>
import PageHeader from "../components/common/PageHeader";
import PageSideBar from "../components/common/PageSideBar";
import { getToken } from "../utils/auth";
import { doAutoLogin } from "../service/login.js";

export default {
  components: {
    PageSideBar,
    PageHeader,
  },
  data() {
    return {};
  },
  methods: {
    sideBarSpread() {
      this.$refs.sideBar.spread();
    },
    sideBarCollapse() {
      this.$refs.sideBar.collapse();
    },
    async autoLogin() {
      if (getToken() === null) {
        this.isLogin = false;
      } else {
        await doAutoLogin(getToken())
          .then(() => {
            this.isLogin = true;
          })
          .catch(() => {
            this.isLogin = false;
          });
        if (this.isLogin === false) {
          this.$router.push({ name: "Index" });
        }
      }
    },
  },
  async created() {
    await this.autoLogin();
  },
};
</script>


<style scoped>
#frame-container {
  display: flex;
  flex-direction: column;
}

#bottom-frame {
  margin-top: calc(var(--base) / 6);
  display: flex;
  flex: 1;
}

#right-frame {
  margin-left: calc(var(--base) / 6);
  flex: 1;
}
</style>