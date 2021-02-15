import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';


export const TEMPLATE_PATH = ROOT_SERVER_URL + "/template";

export function doPageAll(data) {
    return axios.post(TEMPLATE_PATH + "/pageAll", data);
}

export function doSaveTemplate(data) {
    return axios.post(TEMPLATE_PATH + "/save", data);
}

export function doPageByName(data) {
    return axios.post(TEMPLATE_PATH + "/pageByName", data);
}