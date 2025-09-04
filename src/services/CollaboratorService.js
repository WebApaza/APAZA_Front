import axios from "axios";
import { getConfig } from "@/config/BasicConfig";

//const API_URL = getConfig().URL + "/collaborator/";
function getAPIUrl() {
  return getConfig().URL + "/collaborator/";
}

const defaultHeaders = {
  'withCredentials': false,
  'responseType': 'json'
};

function getCollaborators() {
  return axios.get(getAPIUrl(), defaultHeaders);
}

function getCollaborator(id) {
  return axios.get(getAPIUrl() + id, defaultHeaders);
}

function addCollaborator(collaborator) {
  const collaboratorData = new FormData();
  collaboratorData.append('title', collaborator.title);
  collaboratorData.append('description', collaborator.description);
  collaboratorData.append('image', collaborator.image);

  return axios.post(getAPIUrl(), collaboratorData);
}

function updateCollaborator(collaborator) {
  const collaboratorData = new FormData();
  collaboratorData.append('id', collaborator.id);
  collaboratorData.append('title', collaborator.title);
  collaboratorData.append('description', collaborator.description);
  collaboratorData.append('image', collaborator.image);
  collaboratorData.append('new-image', collaborator.newImage);

  return axios.put(getAPIUrl(), collaboratorData);
}

function deleteCollaborator(id) {
  return axios.delete(getAPIUrl() + id, defaultHeaders);
}


export { getCollaborators, getCollaborator, addCollaborator, deleteCollaborator, updateCollaborator };