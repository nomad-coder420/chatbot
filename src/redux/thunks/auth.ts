import { callLoginApi } from "../../service/auth";

export const setAccessToken = (token: string) => {
  localStorage.setItem("accessToken", token);
};

export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};

export const removeAccessToken = () => {
  localStorage.removeItem("accessToken");
};

export const loginUser = async (authCode: string) => {
  try {
    const response = await callLoginApi(authCode);

    const accessToken = response.access_token;

    if (accessToken) {
      setAccessToken(accessToken);
      return true;
    }

    return false;
  } catch (err) {
    console.log(err);
    alert("Something went wrong, please try again later");
    return;
  }
};

export const logoutUser = () => {
  removeAccessToken();
};
