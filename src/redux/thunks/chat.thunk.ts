import axios from "axios";
import { callAskQueryApi, callGetHistoryApi } from "../../service/chat";
import { getAccessToken } from "./auth.thunk";

export const askQuery = async (query: string) => {
  try {
    const token = getAccessToken();

    const response = await callAskQueryApi(query, token);

    return {
      queryId: response.query_id,
      responseId: response.response_id,
      status: response.status,
    };
  } catch (err) {
    console.error(err);
    alert("Something went wrong, please try again later");
    return;
  }
};

export const getChatHistory = async (
  lastQueryId: string | null = null,
  signal: AbortSignal
) => {
  try {
    const token = getAccessToken();

    const response = await callGetHistoryApi(lastQueryId, token, signal);

    return {
      chatHistory: response.chat_history,
      isLastPage: response.is_last_page,
    };
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("History request aborted");
      return; // Aborted request
    }
    console.error(err);
    alert("Something went wrong, please try again later");
    return;
  }
};
