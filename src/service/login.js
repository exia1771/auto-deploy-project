import axios from 'axios';
import { ROOT_SERVER_URL } from '/config/global';

const LOGIN_PATH = ROOT_SERVER_URL + "/user";

export async function doLogin(data) {
    return axios.post(LOGIN_PATH + "", data);
}

export async function doSubmit(data) {
    return axios.post(LOGIN_PATH + "/submit", data);
}

export async function doCheckSameName(name) {
    return axios.get(LOGIN_PATH + "/check" + "?name=" + name);
}