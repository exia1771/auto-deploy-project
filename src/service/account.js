import { USER_PATH } from "./login";
import axios from '../../config/asiox.config';

export function doUpdateBasicInfo(data) {
    return axios.put(USER_PATH + "/update", data);
}

export function doChangePassword(data) {
    return axios.put(USER_PATH + "/password", data);
}