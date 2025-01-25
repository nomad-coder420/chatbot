import { urlConstants } from "../constants";
import apiClient from "./apiClient";

export const callLoginApi = async (authCode: string) => {
  const data = { code: authCode };

  const response = await apiClient.post(urlConstants.auth.login, data);

  return response.data;
};
