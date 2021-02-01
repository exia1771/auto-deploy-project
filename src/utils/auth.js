import Cookies from 'js-cookie';
import vue from '/src/main.js';

export const TOKEN_KEY = 'Authorization';
export const TOKEN_PREFIX = 'Bearer ';
export const USER_KEY = 'userid';

const DOMAIN = "localhost";
const PATH = "/";

export function getToken() {
    const token = Cookies.get(TOKEN_KEY, { domain: DOMAIN, path: PATH });
    if (token === undefined || token === null || token.trim().length === 0) {
        return null;
    }
    return token;
}

export function setToken(token) {
    Cookies.set(TOKEN_KEY, TOKEN_PREFIX + token, { domain: DOMAIN, path: PATH });
}


export function removeToken() {
    Cookies.remove(TOKEN_KEY, { domain: DOMAIN, path: PATH });
}


export function getUser() {
    return vue.$store.state.user;
}

export function setUser(user) {
    vue.$store.commit("setUser", user);
}