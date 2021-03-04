import axios from 'axios'
import vue from '/src/main.js'
import { PUBLIC_USER_PATH } from "../src/service/login";
import { login } from "../src/router/route";

const CHECK_NAME_URL = PUBLIC_USER_PATH + "/check"
const UNAUTHORIZED = 401;
let HAS_UNAUTHORIZED = false;

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    return config;
});

axios.interceptors.response.use((res) => {
    HAS_UNAUTHORIZED = false;
    return Promise.resolve(res);
}, (error) => {
    // 注册时的校验取消消息提示
    if (error.response.config.url.includes(CHECK_NAME_URL)) {
        return Promise.reject(error);
    }

    if (error.response.status === UNAUTHORIZED) {
        vue.$router.push({ path: login.path });
        if (!HAS_UNAUTHORIZED) {
            showErrorMessage(error);
            HAS_UNAUTHORIZED = true;
        }
        return;
    } else {
        showErrorMessage(error);
    }
    return Promise.reject(error);
})

// 全局错误提示
function showErrorMessage(error) {
    vue.$message({
        showClose: true,
        message: error.response.data.message,
        type: "error",
    });
}

export function setLogin() {
    this.HAS_UNAUTHORIZED = false;
}

export default axios;