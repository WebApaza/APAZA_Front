import axios from "axios";
import { getConfig } from "@/config/BasicConfig";

//const API_URL = getConfig().URL + "/event/";
function getAPIUrl() {
  return getConfig().URL + "/event/";
}

const defaultHeaders = {
  'withCredentials': false,
  'responseType': 'json'
};

function getEvents() {
  return axios.get(getAPIUrl(), defaultHeaders);
}

function getEvent(id) {
  return axios.get(getAPIUrl() + id, defaultHeaders);
}

function addEvent(event) {
  const eventData = new FormData();
  eventData.append('title', event.title);
  eventData.append('description', event.description);
  eventData.append('date', event.date);
  eventData.append('type', event.type);
  eventData.append('image', event.image);

  return axios.post(getAPIUrl(), eventData);
}

function updateEvent(event) {
  const eventData = new FormData();
  eventData.append('id', event.id);
  eventData.append('title', event.title);
  eventData.append('description', event.description);
  eventData.append('date', event.date);
  eventData.append('type', event.type);
  eventData.append('image', event.image);
  eventData.append('new-image', event.newImage);

  return axios.put(getAPIUrl(), eventData);
}

function deleteEvent(id) {
  return axios.delete(getAPIUrl() + id, defaultHeaders);
}


export { getEvents, getEvent, addEvent, deleteEvent, updateEvent };