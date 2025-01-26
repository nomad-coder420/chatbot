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
  getChatHistory,
  getResponse,
} from "../../../redux/thunks/chat.thunk";

const ChatScreenHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
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
}: {
  query: string;
  response: string | null;
  status: QueryStatus;
}) => {
  return (
    <div className={classes.chatContainer}>
      <UserQuery query={query} />
      <AvaChatResponse response={response} status={status} />
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
  return <ChatBlock query={query} response={response} status={status} />;
};

const ChatHistory = ({
  chatHistory,
  chatContainerRef,
}: {
  chatHistory: Array<ChatMessageSchema>;
  chatContainerRef: React.RefObject<HTMLDivElement | null>;
}) => {
  console.log(chatHistory);
  // console.log("currentChat", currentChat);

  return (
    <div className={classes.chatHistory} ref={chatContainerRef}>
      {chatHistory &&
        chatHistory.map((chat, index) => {
          const status = chat.status;

          const isValidStatus = [
            QueryStatus.SUCCEEDED,
            QueryStatus.FAILED,
          ].includes(status);

          const validStatus = isValidStatus ? status : QueryStatus.FAILED;

          return (
            <ChatBlock
              key={index}
              query={chat.query}
              response={chat.response}
              status={validStatus}
            />
          );
        })}
    </div>
  );
};

const ChatScreen = () => {
  let chatContainerRef = useRef<HTMLDivElement>(null);
  let currentQueryRef = useRef<string | null>(null);
  let currentStatusRef = useRef<QueryStatus | null>(null);

  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [askingQuery, setAskingQuery] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessageSchema[]>([]);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>("");
  const [currentResponse, setCurrentResponse] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
      alert("Please login to continue");
    }

    const controller = new AbortController();

    const getHistory = async () => {
      setIsHistoryLoading(true);
      const response = await getChatHistory(null, controller.signal, navigate);

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
      setIsHistoryLoading(false);
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    };

    console.log("Get chat history");
    getHistory();

    return () => {
      console.log("Clean up chat history");
      controller.abort();
      setChatHistory([]);
    };
  }, []);

  console.log("component re-rendered");
  const setResponse = (response: string) => {
    console.log("setResponse", response);
    setCurrentResponse(response);
    currentStatusRef.current = QueryStatus.IN_PROGRESS;
  };

  const handleQueryResponseComplete = (response: string) => {
    setChatHistory([
      {
        query: currentQueryRef.current || "",
        response: response || "",
        status: QueryStatus.SUCCEEDED,
        queryId: null,
        responseId: null,
      },
      ...chatHistory,
    ]);

    setAskingQuery(false);
  };

  const handleQueryResponseFailed = () => {
    setChatHistory([
      {
        query: currentQueryRef.current || "",
        response: "",
        status: QueryStatus.FAILED,
        queryId: null,
        responseId: null,
      },
      ...chatHistory,
    ]);
    setAskingQuery(false);
  };

  const handleQuerySend = async () => {
    if (askingQuery || userQuery.length === 0) return;

    currentQueryRef.current = userQuery;
    currentStatusRef.current = QueryStatus.SENDING;

    setAskingQuery(true);
    setUserQuery("");

    const response = await askQuery(userQuery, navigate);

    if (!response) {
      handleQueryResponseComplete("");
      return;
    }

    await getResponse({
      queryId: response?.queryId,
      setResponseCallback: setResponse,
      onCompleteCallback: handleQueryResponseComplete,
      onErrorCallback: handleQueryResponseFailed,
      navigate,
    });
  };

  return (
    <div className={classes.chatScreen}>
      {isHistoryLoading ? (
        <div></div>
      ) : (
        <>
          <ChatScreenHeader />
          <div className={classes.chatHistoryContainer}>
            {chatHistory && chatHistory.length < 10 ? (
              <ChatScreenTitle />
            ) : null}
            <ChatHistory
              chatHistory={chatHistory}
              chatContainerRef={chatContainerRef}
            />
            {askingQuery && (
              <CurrentChat
                query={`CURRENT:: ${currentQueryRef.current || ""}`}
                response={currentResponse || ""}
                status={currentStatusRef.current || QueryStatus.SENDING}
              />
            )}
          </div>

          <ChatScreenInput
            userQuery={userQuery}
            setUserQuery={setUserQuery}
            handleQuerySend={handleQuerySend}
          />
        </>
      )}
    </div>
  );
};

export default ChatScreen;
