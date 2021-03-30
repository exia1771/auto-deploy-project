import { ROOT_SERVER_URL } from '/config/global';
import axios from '../../config/asiox.config';


export const BUILD_TYPE_PATH = ROOT_SERVER_URL + "/buildType";

export function doFindAllBuildTypes() {
    return axios.get(BUILD_TYPE_PATH + "/all");
}