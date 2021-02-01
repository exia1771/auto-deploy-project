import Vue from 'vue';
import VueRouter from 'vue-router';
import { } from '../utils/auth';
import { routes } from './route';

Vue.use(VueRouter);


const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});


// 前置守卫
router.beforeEach((to, from, next) => {
	next();
});

// 后置守卫
router.afterEach(() => {

});


export default router;
