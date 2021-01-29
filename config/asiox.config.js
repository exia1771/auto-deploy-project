import axios from 'axios'
import vue from '/src/main.js'
import { getToken, TOKEN_KEY } from "../src/utils/auth";

const CHECK_NAME_URL = "http://localhost:8081/user/check"

axios.interceptors.request.use((config) => {
    config.headers[TOKEN_KEY] = "Bearer " + getToken();
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
    return Promise.reject(error);
})


export default axios;