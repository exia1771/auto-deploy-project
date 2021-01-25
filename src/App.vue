<template>
  <div id="app" class="max-height">
    <frame v-if="isLogin"></frame>
    <router-view v-else />
  </div>
</template>

<script>
import Frame from "./views/Frame";
import { getUsername } from "./utils/auth";

export default {
  components: {
    Frame,
  },
  computed: {
    isLogin() {
      return getUsername() !== null;
    },
  },
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.max-height {
  height: 100%;
}

.max-width {
  width: 100%;
}
</style>