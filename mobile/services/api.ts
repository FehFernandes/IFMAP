import axios from "axios";
import { API_CONFIG } from "../config/api.config";

const api = axios.create({
  ...API_CONFIG,
  validateStatus: (status) => status < 500,
  maxRedirects: 5,
});

export default api;
