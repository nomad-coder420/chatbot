import React, { useEffect, useState, useRef } from "react";
import classes from "./index.module.css";
import avaImage from "../../../assets/images/ava.png";
import logoutIcon from "../../../assets/svg/logout.svg";
import { useNavigate } from "react-router-dom";
import UserQuery from "../../components/userQuery";
import AvaChatResponse from "../../components/avaChatResponse";
import ChatScreenInput from "../../components/chatScreenInput";
import { getAccessToken, logoutUser } from "../../../redux/thunks/auth.thunk";
import { ChatMessageSchema, QueryStatus } from "../../../constants/types";
import {
  askQuery,
  deleteChatQuery,
  getChatHistory,
  getResponse,
} from "../../../redux/thunks/chat.thunk";
import Loader from "../../components/loader";

const ChatScreenHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser(navigate);
  };

  return (
    <div className={classes.chatHeaderContainer}>
      <div className={classes.headerIconContainer}></div>
      <div className={classes.headerImageContainer}>
        <img src={avaImage} alt="ava" className={classes.avaImage} />
      </div>
      <div className={classes.headerIconContainer}>
        <div
          className={classes.logoutIconContainer}
          onClick={() => {
            handleLogout();
          }}
        >
          <img
            src={logoutIcon}
            alt="logoutIcon"
            className={classes.logoutIcon}
          />
        </div>
      </div>
    </div>
  );
};

const ChatScreenTitle = () => {
  return (
    <div className={classes.chatScreenTitleContainer}>
      <p className={classes.chatScreenHeading}>Hey 👋, I'm Ava</p>
      <p className={classes.chatScreenSubHeading}>
        Ask me anything or pick a place to start
      </p>
    </div>
  );
};

const ChatBlock = ({
  query,
  response,
  status,
  isCurrentChat,
  deleteQuery,
  editQuery,
  isEditDeleteLoading,
}: {
  query: string;
  response: string | null;
  status: QueryStatus;
  isCurrentChat?: boolean;
  deleteQuery?: () => Promise<void>;
  editQuery?: () => Promise<void>;
  isEditDeleteLoading?: boolean;
}) => {
  return (
    <div className={classes.chatContainer}>
      <UserQuery
        query={query}
        status={status}
        isCurrentChat={isCurrentChat}
        deleteQuery={deleteQuery}
        editQuery={editQuery}
        isEditDeleteLoading={isEditDeleteLoading}
      />
      <AvaChatResponse
        response={response}
        status={status}
        isCurrentChat={isCurrentChat}
      />
    </div>
  );
};

const CurrentChat = ({
  query,
  response,
  status,
}: {
  query: string;
  response: string | null;
  status: QueryStatus;
}) => {
  return (
    <ChatBlock
      query={query}
      response={response}
      status={status}
      isCurrentChat
    />
  );
};

const ChatHistory = ({
  chatHistory,
  deleteQuery,
  editQuery,
  isEditDeleteLoading,
}: {
  chatHistory: Array<ChatMessageSchema>;
  deleteQuery: (queryId: string) => Promise<void>;
  editQuery: (queryId: string, currentQuery: string) => Promise<void>;
  isEditDeleteLoading: boolean;
}) => {
  return (
    <div className={classes.chatHistory}>
      {chatHistory &&
        chatHistory.map((chat, index) => {
          const status = chat.status;
          const response = chat.response;

          const isValidStatus = [
            QueryStatus.SUCCEEDED,
            QueryStatus.FAILED,
          ].includes(status);
          const isValidResponse = response && response.length > 0;

          const validStatus =
            isValidStatus && isValidResponse ? status : QueryStatus.FAILED;

          return (
            <ChatBlock
              key={index}
              query={chat.query}
              response={chat.response}
              status={validStatus}
              deleteQuery={() => deleteQuery(chat.queryId)}
              editQuery={() => editQuery(chat.queryId, chat.query)}
              isEditDeleteLoading={isEditDeleteLoading}
            />
          );
        })}
    </div>
  );
};

const ChatScreen = () => {
  let chatContainerRef = useRef<HTMLDivElement | null>(null);
  let chatInputRef = useRef<HTMLInputElement | null>(null);
  let currentQueryRef = useRef<string | null>(null);
  let currentQueryIdRef = useRef<string | null>(null);
  let currentStatusRef = useRef<QueryStatus | null>(null);

  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [isPrevHistoryLoading, setIsPrevHistoryLoading] = useState(false);
  const [isEditDeleteLoading, setIsEditDeleteLoading] = useState(false);
  const [askingQuery, setAskingQuery] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessageSchema[]>([]);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>("");

  const navigate = useNavigate();

  const loadChatHistory = async (
    lastQueryId: string | null = null,
    signal: AbortSignal
  ) => {
    const response = await getChatHistory(lastQueryId, signal, navigate);

    if (response) {
      setChatHistory([
        ...chatHistory,
        ...response.chatHistory.map((chat) => {
          return {
            query: chat.query,
            queryId: chat.query_id,
            response: chat.response,
            responseId: chat.response_id,
            status: chat.status,
          };
        }),
      ]);
      setIsLastPage(response.isLastPage);
    }
  };

  const resetChatHistory = async (signal: AbortSignal) => {
    const response = await getChatHistory(null, signal, navigate);
    if (response) {
      setChatHistory([
        ...response.chatHistory.map((chat) => {
          return {
            query: chat.query,
            queryId: chat.query_id,
            response: chat.response,
            responseId: chat.response_id,
            status: chat.status,
          };
        }),
      ]);
      setIsLastPage(response.isLastPage);
    }
  };

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      logoutUser(navigate);
    }

    const controller = new AbortController();

    const getHistory = async () => {
      setIsHistoryLoading(true);
      await resetChatHistory(controller.signal);
      setIsHistoryLoading(false);
    };

    console.log("Get chat history");
    getHistory();

    return () => {
      console.log("Clean up chat history");

      controller.abort();
      setChatHistory([]);
      chatContainerRef.current = null;
      currentQueryRef.current = null;
      currentStatusRef.current = null;
      currentQueryIdRef.current = null;
      setAskingQuery(false);
      setUserQuery("");
      setCurrentResponse("");
      setIsHistoryLoading(false);
    };
  }, []);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  console.log("component re-rendered");
  const setResponse = (response: string) => {
    setCurrentResponse(response);
    if (currentStatusRef?.current !== QueryStatus.IN_PROGRESS) {
      currentStatusRef.current = QueryStatus.IN_PROGRESS;
    }
    scrollToBottom();
  };

  const handleQueryResponseComplete = (response: string) => {
    setChatHistory([
      {
        query: currentQueryRef.current || "",
        response: response || "",
        status: QueryStatus.SUCCEEDED,
        queryId: currentQueryIdRef.current || "",
        responseId: null,
      },
      ...chatHistory,
    ]);

    setAskingQuery(false);
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  };

  const handleQueryResponseFailed = () => {
    setChatHistory([
      {
        query: currentQueryRef.current || "",
        response: "",
        status: QueryStatus.FAILED,
        queryId: currentQueryIdRef.current || "",
        responseId: null,
      },
      ...chatHistory,
    ]);
    setAskingQuery(false);
    scrollToBottom();
  };

  const handleQuerySend = async () => {
    if (askingQuery || userQuery.length === 0) return;

    currentQueryRef.current = userQuery;
    currentStatusRef.current = QueryStatus.SENDING;

    setAskingQuery(true);
    setUserQuery("");

    const response = await askQuery(userQuery, navigate);

    scrollToBottom();

    if (!response) {
      handleQueryResponseComplete("");
      return;
    }

    currentQueryIdRef.current = response.queryId;

    await getResponse({
      queryId: response?.queryId,
      setResponseCallback: setResponse,
      onCompleteCallback: handleQueryResponseComplete,
      onErrorCallback: handleQueryResponseFailed,
      navigate,
    });
  };

  const loadOlderMessages = async () => {
    setIsPrevHistoryLoading(true);

    const controller = new AbortController();
    await loadChatHistory(
      chatHistory[chatHistory.length - 1].queryId,
      controller.signal
    );

    setIsPrevHistoryLoading(false);
  };

  const deleteQuery = async (queryId: string) => {
    const controller = new AbortController();

    setIsEditDeleteLoading(true);
    const response = await deleteChatQuery(queryId, navigate);

    await resetChatHistory(controller.signal);
    setIsEditDeleteLoading(false);
  };

  const editQuery = async (queryId: string, currentQuery: string) => {
    const controller = new AbortController();

    setIsEditDeleteLoading(true);
    if (askingQuery) return;

    const response = await deleteChatQuery(queryId, navigate);

    await resetChatHistory(controller.signal);

    setUserQuery(currentQuery);

    setIsEditDeleteLoading(false);

    if (chatInputRef.current) {
      console.log("Focusing input", chatInputRef.current);
      chatInputRef.current.focus();
    }
  };

  return (
    <div className={classes.chatScreen}>
      {isHistoryLoading ? (
        <div></div>
      ) : (
        <>
          <ChatScreenHeader />
          <div className={classes.chatHistoryContainer} ref={chatContainerRef}>
            {askingQuery && (
              <CurrentChat
                query={currentQueryRef.current || ""}
                response={currentResponse || ""}
                status={currentStatusRef.current || QueryStatus.SENDING}
              />
            )}
            <ChatHistory
              chatHistory={chatHistory}
              deleteQuery={deleteQuery}
              editQuery={editQuery}
              isEditDeleteLoading={isEditDeleteLoading}
            />
            {chatHistory && chatHistory.length < 10 ? (
              <ChatScreenTitle />
            ) : null}
            {!isLastPage &&
              (isPrevHistoryLoading ? (
                <div className={classes.loaderContainer}>
                  <Loader color="#7d37ff" />
                </div>
              ) : (
                <div className={classes.loadMoreContainer}>
                  <div
                    className={classes.loadMoreButton}
                    onClick={() => {
                      loadOlderMessages();
                    }}
                  >
                    <p>See older messages</p>
                  </div>
                </div>
              ))}
          </div>

          <ChatScreenInput
            userQuery={userQuery}
            setUserQuery={setUserQuery}
            handleQuerySend={handleQuerySend}
            disabled={askingQuery || isEditDeleteLoading}
            chatInputRef={chatInputRef}
          />
        </>
      )}
    </div>
  );
};

export default ChatScreen;
