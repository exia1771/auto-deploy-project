import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';
import { getToken, removeToken, setUser } from '../utils/auth';
import vue from '/src/main.js';
import { login } from "../router/route";

export const USER_PATH = ROOT_SERVER_URL + "/user";
export const PUBLIC_USER_PATH = USER_PATH + "/public";
export const INDEX_NAME = "Images";
export let PREVIOUS_ROUTE = {};

export async function doLogin(data) {
    return axios.post(PUBLIC_USER_PATH + "/login", data);
}

export async function doAutoLogin() {
    return axios.get(USER_PATH + "/login");
}

export async function autoLogin() {
    let isLogin = false;
    if (getToken() === null) {
        if (vue.$route.name !== "Login") {
            PREVIOUS_ROUTE.name = vue.$route.name;
            PREVIOUS_ROUTE.params = vue.$route.params;
            vue.$router.replace({ name: "Login" });
        }
        return isLogin;
    }
    await doAutoLogin().then((res) => {
        isLogin = true;
        setUser(res.data.data);
    }).catch(() => {
        PREVIOUS_ROUTE.name = vue.$route.name;
        PREVIOUS_ROUTE.params = vue.$route.params;
        removeToken();
        vue.$router.replace({ name: login.name });
    });
    return isLogin;
}

export async function doSubmit(data) {
    return axios.post(PUBLIC_USER_PATH + "/submit", data);
}

export async function doLogout() {
    return axios.get(USER_PATH + "/logout");
}

export async function doCheckSameName(name) {
    return axios.get(PUBLIC_USER_PATH + "/check" + "?name=" + name);
}

export function doFindUsersByDept(id) {
    return axios.get(USER_PATH + `/dept/${id}`);
}