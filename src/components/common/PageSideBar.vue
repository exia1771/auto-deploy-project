<template>
  <div class="max-height box-shadow">
    <el-menu
      id="side-bar-menu"
      default-active="1-4-1"
      class="el-menu-vertical-demo max-height"
      :style="sideBarMenuStyle"
    >
      <el-menu-item index="3">
        <i class="el-icon-document"></i>
        <span slot="title" v-show="!isCollapse">导航三</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>


<script>
export default {
  name: "PageSideBar",

  data() {
    return {
      isCollapse: this.collapseState,
      sideBarMenuStyle: {
        width: this.menuWidthStyle.base + this.menuWidthStyle.base.unit,
      },
    };
  },
  props: {
    collapseState: {
      type: Boolean,
      default: true,
    },
    menuWidthStyle: {
      type: Object,
      default: function () {
        return { base: 0.8, unit: "rem" };
      },
    },
  },
  mounted() {
    const sideBarMenu = document.getElementById("side-bar-menu");
    sideBarMenu.style.width =
      this.menuWidthStyle.base + this.menuWidthStyle.unit;
    const liNodes = document.querySelectorAll("#side-bar-menu li");
    liNodes.forEach((element) => {
      element.style = "";
    });
  },
  methods: {
    spread() {
      this.isCollapse = false;
      this.sideBarMenuStyle.width =
        this.menuWidthStyle.base * 2 + this.menuWidthStyle.unit;
    },
    collapse() {
      this.isCollapse = true;
      this.sideBarMenuStyle.width =
        this.menuWidthStyle.base + this.menuWidthStyle.unit;
    },
  },
};
</script>


<style scoped>
#side-bar-menu {
  transition: all 0.3s;
}

#side-bar-menu li {
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>