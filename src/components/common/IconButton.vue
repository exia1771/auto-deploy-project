<template>
  <div id="icon-button-container" :style="css">
    <el-tooltip
      v-for="(item, index) in operations"
      :key="index"
      :effect="item.effect"
      :content="item.content"
      :placement="item.placement"
    >
      <slot name="other" v-if="item.custimize"> </slot>
      <el-button
        v-else
        plain
        circle
        @click="item.method(item.args)"
        :type="item.buttonType"
        :icon="item.icon"
      ></el-button>
    </el-tooltip>
  </div>
</template>


<script>
export default {
  name: "IconButton",
  props: {
    operations: {
      type: Array,
      default: () => [],
    },
    css: {
      type: Object,
      default: () => {},
    },
  },
};
</script>


<style scoped>
</style>