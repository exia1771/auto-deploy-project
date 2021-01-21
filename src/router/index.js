import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./routes"

Vue.use(VueRouter);


const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

// 前置守卫
router.beforeEach((to, from, next) => {

});

// 后置守卫
router.afterEach(route => {

});


export default router;
