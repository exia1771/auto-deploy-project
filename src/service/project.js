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

export function doDeleteById(id) {
    return axios.delete(TEMPLATE_PATH + "/delete/" + id);
}

export function doFindDistinctTemplateName() {
    return axios.get(TEMPLATE_PATH + "/name");
}

export function doFindTemplateNameByKeyword(keyword) {
    return axios.get(TEMPLATE_PATH + "/name/" + keyword);
}

export function doFindTagsByTemplateName(templateName) {
    return axios.get(TEMPLATE_PATH + "/tag/" + templateName);
}

export function doFindTemplateIdByTemplateNameAndTag(templateName, tag) {
    return axios.get(TEMPLATE_PATH + "/id?" + "templateName=" + templateName + "&templateTag=" + tag);
}


export const PROJECT_PATH = ROOT_SERVER_URL + "/project";

export function doSaveProject(data) {
    return axios.post(PROJECT_PATH + "/save", data);
}

export function doFindListByCurrentUser() {
    return axios.get(PROJECT_PATH + "/list");
}