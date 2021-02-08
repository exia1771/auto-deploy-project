import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';


export const CONTAINER_PATH = ROOT_SERVER_URL + "/container";
export const IMAGE_PATH = ROOT_SERVER_URL + "/image";

export function doFindImage(data) {
    return axios.post(IMAGE_PATH + "/find", data);
}

export function doInspect(id) {
    return axios.get(IMAGE_PATH + "/inspect/" + id);
}