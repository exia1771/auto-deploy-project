export const login = {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue")
};

export const deploy = "/deploy/";


export const routes = [
    {
        path: "/",
        redirect: login.path
    },
    login,
    {
        path: "/deploy",
        name: "Deploy",
        redirect: "/deploy/images",
        component: () => import("../views/Index.vue"),
        children: [
            {
                path: "images",
                name: "Images",
                component: () => import("../views/index/Images.vue")
            },
            {
                path: "templates",
                name: "Templates",
                component: () => import("../views/index/Templates.vue")
            },
            {
                path: "projects",
                name: "Projects",
                component: () => import("../views/index/Projects.vue"),
            },
            {
                path: "project/detail/:id",
                name: "ProjectsDetail",
                component: () => import("../views/project/ProjectDetail.vue")
            },
            {
                path: "project/setting/:id",
                name: "ProjectsSetting",
                component: () => import("../views/project/ProjectSetting.vue")
            }
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
            },
            {
                path: "safety",
                name: "Safety",
                component: () => import("../views/account/Safety.vue")
            }
        ]
    },
    {
        path: "*",
        name: "NotFound",
        component: () => import("../views/404.vue")
    },
];