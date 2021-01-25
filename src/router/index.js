import Vue from 'vue';
import VueRouter from 'vue-router';
import { getUsername } from '../utils/auth';
import { routes, login, index } from './route'

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
});

// 前置守卫
router.beforeEach((to, from, next) => {
	if (getUsername() === null) {
		if (to.path === login.path) {
			next();
		} else {
			next(login.path);
		}
	} else {
		if (to.path === login.path) {
			next(index.path)
		} else {
			next();
		}
	}
});

// 后置守卫
router.afterEach(route => {

});


export default router;
