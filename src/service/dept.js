import { ROOT_SERVER_URL } from '/config/global';
import axios from '../../config/asiox.config';


export const DEPT_PATH = ROOT_SERVER_URL + "/dept";

export function doFindAll() {
    return axios.get(DEPT_PATH + "/all");
}