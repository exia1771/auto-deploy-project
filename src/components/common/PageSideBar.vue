<template>
  <div class="max-height box-shadow">
    <el-menu
      id="side-bar-menu"
      class="el-menu-vertical-demo max-height"
      :style="sideBarMenuStyle"
    >
      <el-menu-item-group v-for="(item, i) in list" :key="i">
        <template slot="title">
          <span slot="title" v-show="!isCollapse">{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="(menu, j) in item.children"
          :key="j"
          :class="getCurrentIndex(i, j) === currentIndex ? 'active' : ''"
          @click="to(menu.name, i, j)"
        >
          <i :class="menu.icon"></i>
          <span slot="title" v-show="!isCollapse">{{ menu.title }}</span>
        </el-menu-item>
      </el-menu-item-group>
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
      currentIndex: 0,
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
        return { base: 1, unit: "rem" };
      },
    },
    list: {
      type: Array,
      default: function () {
        return [];
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
    to(routeName, i, j) {
      if (this.$route.name !== routeName) {
        this.$router.push({ name: routeName });
      }
      this.currentIndex = this.getCurrentIndex(i, j);
    },
    getCurrentIndex(i, j) {
      let result = 0;
      for (let index = 0; index < i; index++) {
        result += this.list[index].length;
      }
      return result + j;
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

.active {
  background: rgb(0, 162, 255, 0.2);
}
</style>