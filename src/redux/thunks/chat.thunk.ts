import axios, { AxiosError } from "axios";
import { NavigateFunction } from "react-router-dom";

import { callAskQueryApi, callGetHistoryApi } from "../../service/chat";
import { getAccessToken, removeAccessToken } from "./auth.thunk";
import { apiBaseUrl, urlConstants } from "../../constants";

export const askQuery = async (query: string, navigate: NavigateFunction) => {
  try {
    const token = getAccessToken();

    const response = await callAskQueryApi(query, token);

    return {
      queryId: response.query_id,
    };
  } catch (err) {
    console.error(err);

    if (err instanceof AxiosError) {
      if (err.response?.status === 498) {
        removeAccessToken();
        navigate("/login");
      }
    }

    alert("Something went wrong, please try again later");
    return;
  }
};

export const getChatHistory = async (
  lastQueryId: string | null = null,
  signal: AbortSignal,
  navigate: NavigateFunction
) => {
  try {
    const token = getAccessToken();

    const response = await callGetHistoryApi(lastQueryId, token, signal);

    return {
      chatHistory: response.chat_history,
      isLastPage: response.is_last_page,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 498) {
        removeAccessToken();
        navigate("/login");
      }
    }

    if (axios.isCancel(err)) {
      console.log("History request aborted");
      return; // Aborted request
    }

    alert("Something went wrong, please try again later");
    return;
  }
};

export const getResponse = async ({
  queryId,
  setResponseCallback,
  onCompleteCallback,
  navigate,
}: {
  queryId: string;
  setResponseCallback: (response: string) => void;
  onCompleteCallback: () => void;
  navigate: NavigateFunction;
}) => {
  try {
    const token = getAccessToken();
    const url = `${apiBaseUrl}${urlConstants.chat.getResponse}?query_id=${queryId}`;

    const fetchStream = async () => {
      const requestHeaders = new Headers();
      requestHeaders.append("Authorization", `Bearer ${token}`);

      const response = await fetch(url, {
        method: "GET",
        headers: requestHeaders,
      });

      // Access response headers
      const headers = response.headers;
      const responseHeaders: Record<string, string> = {};
      headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      console.log(
        "Response headers:",
        response.headers.get("Response_id"),
        responseHeaders,
        headers
      );

      if (!response.ok) {
        console.error("Failed to fetch stream");
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          console.log("Buffer:", buffer);
          setResponseCallback(buffer);
        }
      }
      onCompleteCallback();
    };

    fetchStream().catch(console.error);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response?.status === 498) {
        removeAccessToken();
        navigate("/login");
      }
    }

    alert("Something went wrong, please try again later");
    return;
  }
};
