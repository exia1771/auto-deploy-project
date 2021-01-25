export const login = {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
};

export const index = {
    path: "/index",
    name: "Index",
    component: () => import("../views/Index.vue")
};

export const routes = [
    {
        path: "/",
        redirect: index.path
    },
    login,
    index,
    {
        path: "*",
        name: "NotFound",
        component: () => import("../views/404.vue")
    }
];