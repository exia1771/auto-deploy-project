import { ROOT_SERVER_URL } from '/config/global';
import axios from '../../config/asiox.config';


export const PROJECT_USER_PATH = ROOT_SERVER_URL + "/projectUser";

export function doBatchUpdate(projectId, userIdList) {
    return axios.post(PROJECT_USER_PATH + `/project/${projectId}`, userIdList);
}

export function doFindUsersByProjectId(id) {
    return axios.get(PROJECT_USER_PATH + `/project/${id}`);
}