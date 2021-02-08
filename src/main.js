import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/element.js';
import JsonViewer from 'vue-json-viewer';

Vue.config.productionTip = false;
Vue.use(JsonViewer);


const vue = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

export default vue;