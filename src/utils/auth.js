import Cookies from 'js-cookie';
import { doAutoLogin } from "../service/login";

export const TOKEN_KEY = 'Authorization';
export const USER_KEY = 'userid';


export function getToken() {
    const token = Cookies.get(TOKEN_KEY);
    if (token === undefined || token === null || token.trim().length === 0) {
        return null;
    }
    return token;
}

export function setToken(token) {
    Cookies.set(TOKEN_KEY, token);
}

export function removeToken() {
    Cookies.remove(TOKEN_KEY);
}


export function getUserId() {
    const userId = Cookies.get(USER_KEY);
    if (userId === undefined || userId === null || userId.length === 0) {
        doAutoLogin().then((res) => {
            setUserId(res.data.data.id);
            return res.data.data.id;
        });
    }
    return userId;
}

export function setUserId(user) {
    Cookies.set(USER_KEY, user);
}

export function removeUserId() {
    Cookies.remove(USER_KEY);
}