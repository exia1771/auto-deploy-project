import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';

const PUBLIC_USER_PATH = ROOT_SERVER_URL + "/user/public";

export async function doLogin(data) {
    return axios.post(PUBLIC_USER_PATH + "/login", data);
}

export async function doAutoLogin(token) {
    return axios.get(PUBLIC_USER_PATH + "/login?token=" + token);
}

export async function doSubmit(data) {
    return axios.post(PUBLIC_USER_PATH + "/submit", data);
}

export async function doCheckSameName(name) {
    return axios.get(PUBLIC_USER_PATH + "/check" + "?name=" + name);
}