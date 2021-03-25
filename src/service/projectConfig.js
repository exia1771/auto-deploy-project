import axios from '../../config/asiox.config';
import { ROOT_SERVER_URL } from '/config/global';

export const CONFIG_PATH = ROOT_SERVER_URL + "/config";

export function doSaveProjectConfig(projectConfig) {
    return axios.post(CONFIG_PATH + "/save", projectConfig);
}

export function doFindProjectConfigById(id) {
    return axios.get(CONFIG_PATH + `/${id}`);
}

export function doFindByProjectIdAndNamespaceId(projectId, namespaceId) {
    return axios.get(CONFIG_PATH + `?projectId=${projectId}&namespaceId=${namespaceId}`);
}