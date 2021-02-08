import Vue from 'vue';
import VueRouter from 'vue-router';
import { getToken } from '../utils/auth';
import { routes, login } from './route';

Vue.use(VueRouter);


const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});


// 前置守卫
router.beforeEach((to, from, next) => {
	if (getToken() === null && from.name != login.name && to.name != login.name) {
		next(login.path);
	}
	next();
});

// 后置守卫
router.afterEach(() => {

});


export default router;
