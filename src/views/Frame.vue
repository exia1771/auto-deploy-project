<template>
  <div id="frame-container" class="max-height">
    <div id="top-frame">
      <page-header>
        <template v-slot:title>
          <div>{{ headerTitle }}</div>
        </template>
      </page-header>
    </div>

    <div id="bottom-frame">
      <div id="left-frame" @mousedown="sideBarSpread">
        <page-side-bar :list="menuList" ref="sideBar" />
      </div>

      <div id="right-frame" @mousedown="sideBarCollapse" class="box-shadow">
        <section id="right-frame-content" class="max-height">
          <router-view />
        </section>
      </div>
    </div>
  </div>
</template>


<script>
import PageHeader from "../components/common/PageHeader";
import PageSideBar from "../components/common/PageSideBar";
import { autoLogin } from "../service/login.js";

export default {
  components: {
    PageSideBar,
    PageHeader,
  },
  data() {
    return {};
  },
  props: {
    menuList: {
      type: Array,
      default: function () {
        return [];
      },
    },
    headerTitle: {
      type: String,
      default: "",
    },
  },
  methods: {
    sideBarSpread() {
      this.$refs.sideBar.spread();
    },
    sideBarCollapse() {
      this.$refs.sideBar.collapse();
    },
    async login() {
      if (this.$route.params.fromLogin === true) {
        return;
      }
      await autoLogin();
    },
  },
  created() {
    this.login();
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
  overflow: hidden;
}

#right-frame-content {
  padding: 5px;
}
</style>