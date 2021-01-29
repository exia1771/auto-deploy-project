import axios from 'axios'
import vue from '/src/main.js'
import { getToken, setToken, TOKEN_KEY } from "../src/utils/auth";
import { PUBLIC_USER_PATH } from "../src/service/login";

const CHECK_NAME_URL = PUBLIC_USER_PATH + "/check"

axios.interceptors.request.use((config) => {
    if (getToken() != null) {
        config.headers[TOKEN_KEY] = "Bearer " + getToken();
    }
    return config;
});

axios.interceptors.response.use((res) => {
    const tokenInRes = res.headers[TOKEN_KEY.toLowerCase()];
    if (tokenInRes != null || tokenInRes != undefined) {
        setToken(tokenInRes);
    }
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