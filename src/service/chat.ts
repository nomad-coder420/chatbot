import { urlConstants } from "../constants";
import {
  AskQueryResponseSchema,
  GetChatHistoryResponseSchema,
} from "../constants/types";
import apiClient from "./apiClient";

export const callAskQueryApi = async (
  query: string,
  token: string | null
): Promise<AskQueryResponseSchema> => {
  const data = { query };

  const response = await apiClient.authPost(
    urlConstants.chat.askQuery,
    data,
    token
  );

  return response.data;
};

export const callGetHistoryApi = async (
  lastQueryId: string | null = null,
  token: string | null,
  signal: AbortSignal
): Promise<GetChatHistoryResponseSchema> => {
  const data = { last_query_id: lastQueryId };

  const response = await apiClient.authPost(
    urlConstants.chat.getHistory,
    data,
    token,
    signal
  );

  return response.data;
};
