export enum QueryStatus {
  SENDING = "SENDING",
  CREATED = "CREATED",
  IN_PROGRESS = "IN_PROGRESS",
  SUCCEEDED = "SUCCEEDED",
  FAILED = "FAILED",
}

export interface ChatMessageSchema {
  query: string;
  queryId: string | null;
  response: string | null;
  responseId: string | null;
  status: QueryStatus;
}

export interface AskQueryResponseSchema {
  query_id: string;
  response_id: string;
  status: QueryStatus;
}

export interface ChatHistoryResponseSchema {
  query_id: string;
  query: string;
  response_id: string;
  response: string;
  status: QueryStatus;
}

export interface GetChatHistoryResponseSchema {
  chat_history: ChatHistoryResponseSchema[];
  is_last_page: boolean;
}
