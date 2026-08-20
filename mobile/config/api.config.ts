import { Platform } from "react-native";

import { LOCAL_DEV_IP } from "./env.config";

const LOCAL_IP = LOCAL_DEV_IP;

export const getApiUrl = (): string => {
  if (__DEV__) {
    return `http://${LOCAL_IP}:8000/api`;
  }
  return "https://api.ifmap.edu.br/api";
};

export const API_CONFIG = {
  baseURL: getApiUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};
