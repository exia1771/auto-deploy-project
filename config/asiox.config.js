import axios from 'axios'
import vue from '/src/main.js'
import { PUBLIC_USER_PATH } from "../src/service/login";
import { login } from "../src/router/route";

const CHECK_NAME_URL = PUBLIC_USER_PATH + "/check"
const UNAUTHORIZED = 401;

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    return config;
});

axios.interceptors.response.use((res) => {
    return Promise.resolve(res);
}, (error) => {
    // 注册时的校验取消消息提示
    if (error.response.config.url.includes(CHECK_NAME_URL)) {
        return Promise.reject(error);
    }


    // 全局错误提示
    vue.$message({
        showClose: true,
        message: error.response.data.message,
        type: "error",
    });

    if (error.response.status === UNAUTHORIZED) {
        vue.$router.push({ path: login.path });
        return;
    }
    return Promise.reject(error);
})


export default axios;