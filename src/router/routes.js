const routes = [
    {
        path: "/",
        name: "Login",
        component: () => import("../views/Login.vue")
    }
];

export { routes };