import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';

export const NAMESPACE_PATH = ROOT_SERVER_URL + "/namespace";

export function doFindAllNamespace() {
    return axios.get(NAMESPACE_PATH + "/list");
}

export function doFindNamespaceByKeyword(keyword) {
    return axios.get(NAMESPACE_PATH + `/${keyword}`);
}

export function doSaveNamespace(namespace) {
    return axios.post(NAMESPACE_PATH + "/save", namespace);
}