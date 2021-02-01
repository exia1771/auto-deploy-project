export const login = {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
};

export const deploy = "/deploy/";

export const index = {
    path: "index",
    name: "Index",
    component: () => import("../views/Index.vue")
};

export const routes = [
    {
        path: "/",
        redirect: login.path
    },
    login,
    {
        path: "/deploy",
        name: "Deploy",
        redirect: "index",
        component: () => import("../views/Frame.vue"),
        children: [
            index
        ]
    },
    {
        path: "/account",
        name: "Account",
        redirect: "/account/profile",
        component: () => import("../views/Account.vue"),
        children: [
            {
                path: "profile",
                name: "Profile",
                component: () => import("../views/account/Profile.vue")
            }
        ]
    },
    {
        path: "*",
        name: "NotFound",
        component: () => import("../views/404.vue")
    },
];