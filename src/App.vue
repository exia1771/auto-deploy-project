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
  --base: calc(100vw / 24);
}

img {
  display: block;
}

.box-shadow {
  box-shadow: 0px 2px 4px 3px rgba(0, 0, 0, 0.16);
}

:root {
  font-size: var(--base);
}

.max-height {
  height: 100%;
}

.max-width {
  width: 100%;
}
</style>