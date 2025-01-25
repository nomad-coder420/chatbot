import { callLoginApi } from "../../service/auth";

export const loginUser = async (authCode: string) => {
  try {
    const response = await callLoginApi(authCode);

    console.log(response);

    return response;
  } catch (err) {
    console.log(err);
    alert("Something went wrong, please try again later");
    return;
  }
};
