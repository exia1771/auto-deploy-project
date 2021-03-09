<template>
  <div>Detail</div>
</template>


<script>
export default {
  name: "ProjectsDetail",
  data() {
    return {
      project: {},
    };
  },
  created() {
    this.project = {
      id: this.$route.params.id,
      name: this.$route.params.name,
    };
  },
};
</script>


<style scoped>
</style>