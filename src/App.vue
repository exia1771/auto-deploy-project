<template>
  <div id="app" class="max-height">
    <router-view />
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
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

@media screen and (max-width: 1024px) {
  body,
  html {
    min-width: 1024px;
    --base: 42.67px;
  }
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