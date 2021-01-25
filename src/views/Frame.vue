<template>
  <div id="frame-container" class="max-height">
    <div id="frame" class="max-height">
      <section id="top-frame">
        <page-header></page-header>
      </section>

      <div id="bottom-frame" class="max-height">
        <section id="left-frame" @mousedown="sideBarSpread">
          <page-side-bar ref="sideBar" :collapseState="isCollapse" />
        </section>

        <section id="right-frame" @mousedown="sideBarCollapse">
          <section id="right-frame-content">
            <router-view />
          </section>
        </section>
      </div>
    </div>
  </div>
</template>


<script>
import PageHeader from "../components/common/PageHeader";
import PageSideBar from "../components/common/PageSideBar";

export default {
  components: {
    PageSideBar,
    PageHeader,
  },
  data() {
    return {
      isCollapse: true,
    };
  },
  methods: {
    sideBarSpread() {
      this.$refs.sideBar.spread();
    },
    sideBarCollapse() {
      this.$refs.sideBar.collapse();
    },
  },
};
</script>


<style scoped>
#frame {
  display: flex;
  flex-direction: column;
}

#top-frame {
  box-shadow: 0 2px 4px 0 var(--cb-color-shadow, rgba(0, 0, 0, 0.16));
  position: fixed;
  z-index: 1;
  width: 100%;
  top: 0;
}

#bottom-frame {
  display: flex;
}

#right-frame {
  flex: 1;
}
</style>