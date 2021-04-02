import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';

export const PROJECT_CONTAINER_PATH = ROOT_SERVER_URL + "/project/container";


export function doFindRepositoryTags(projectId, keyword) {
    return axios.get(PROJECT_CONTAINER_PATH + `/tags/${projectId}?keyword=${keyword}`);
}

export function doSaveProjectContainer(projectContainer) {
    return axios.post(PROJECT_CONTAINER_PATH + "/save", projectContainer);
}

export function doFindPagedBySpecificFields(search) {
    return axios.post(PROJECT_CONTAINER_PATH + "/find", search);
}

export function doFindBuildLog(id) {
    return axios.get(PROJECT_CONTAINER_PATH + `/buildLog?id=${id}`);
}

export function doFindById(id) {
    return axios.get(PROJECT_CONTAINER_PATH + `/${id}`);
}

export function doSaveById(id) {
    return axios.post(PROJECT_CONTAINER_PATH + `/save/${id}`);
}

export function doStopBuild(id) {
    return axios.get(PROJECT_CONTAINER_PATH + `/stop/${id}`);
}

export function doFindContainerLog(id, since) {
    return axios.get(PROJECT_CONTAINER_PATH + `/log?id=${id}&since=${since}`);
}

export function doRestartContainer(id) {
    return axios.post(PROJECT_CONTAINER_PATH + `/restart/${id}`);
}

export function doGetContainerLogStream(id, since){
    return axios.post(PROJECT_CONTAINER_PATH + `/log?id=${id}&since=${since}`, null, {responseType:'blob'});
}