import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';
import { getToken, removeToken, removeUserId } from '../utils/auth';

export const USER_PATH = ROOT_SERVER_URL + "/user";
export const PUBLIC_USER_PATH = USER_PATH + "/public";

export async function doLogin(data) {
    return axios.post(PUBLIC_USER_PATH + "/login", data);
}

export async function doAutoLogin() {
    return axios.get(USER_PATH + "/login");
}

export async function autoLogin() {
    let isLogin = false;
    if (getToken() === null) {
        return isLogin;
    }
    await doAutoLogin().then(() => {
        isLogin = true;
    }).catch(() => {
        isLogin = false;
        removeToken();
        removeUserId();
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