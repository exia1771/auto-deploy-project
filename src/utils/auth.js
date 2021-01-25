import Cookies from 'js-cookie';

const TOKEN_KEY = 'Authorization';

export function getToken() {
    const token = Cookies.get(TOKEN_KEY);
    if (token === undefined || token === null) {
        return null;
    }
    return token;
}

export function getUsername() {
    return "null";
}

export function setToken(token) {
    Cookies.set(TOKEN_KEY, token);
}

export function removeToken() {
    Cookies.remove(TOKEN_KEY);
}
