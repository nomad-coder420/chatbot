import axios from "axios";
import { apiBaseUrl } from "../constants";

const apiInstance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const apiClient = {
  get: async (url: string) => {
    const response = await apiInstance.get(url);

    if (response.status === 200) {
      return Promise.resolve(response);
    }

    return Promise.reject(response);
  },
  authGet: async (url: string, token: string) => {
    const response = await apiInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return Promise.resolve(response);
    }

    return Promise.reject(response);
  },
  post: async (url: string, data: any) => {
    const response = await apiInstance.post(url, data);

    if (response.status === 200) {
      return Promise.resolve(response);
    }

    return Promise.reject(response);
  },
  authPost: async (url: string, data: any, token: string) => {
    const response = await apiInstance.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return Promise.resolve(response);
    }

    return Promise.reject(response);
  },
  put: async (url: string, data: any) => {
    const response = await apiInstance.put(url, data);
    return response;
  },
  delete: async (url: string) => {
    const response = await apiInstance.delete(url);
    return response;
  },
};

export default apiClient;
