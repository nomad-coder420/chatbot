import React, { useEffect, useRef, useState } from "react";
import classes from "./index.module.css";
import avaImage from "../../../assets/images/ava.png";
import logoutIcon from "../../../assets/svg/logout.svg";
import { useNavigate } from "react-router-dom";
import UserQuery from "../../components/userQuery";
import AvaChatResponse from "../../components/avaChatResponse";
import ChatScreenInput from "../../components/chatScreenInput";
import { getAccessToken, logoutUser } from "../../../redux/thunks/auth.thunk";
import { ChatMessageSchema, QueryStatus } from "../../../constants/types";
import { askQuery, getChatHistory } from "../../../redux/thunks/chat.thunk";

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

const ChatHistory = ({
  chatHistory,
}: {
  chatHistory: Array<ChatMessageSchema>;
}) => {
  console.log(chatHistory);
  return (
    <div className={classes.chatHistory}>
      {chatHistory &&
        chatHistory.map((chat, index) => {
          return (
            <div key={index} className={classes.chatContainer}>
              <UserQuery query={chat.query} />
              {chat.response && <AvaChatResponse response={chat.response} status={chat.status} />}
            </div>
          );
        })}
    </div>
  );
};

const ChatScreen = () => {
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [askingQuery, setAskingQuery] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessageSchema[]>([]);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [userQuery, setUserQuery] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      alert("Please login to continue");
      navigate("/login");
    }

    const controller = new AbortController();

    const getHistory = async () => {
      setIsHistoryLoading(true);
      const response = await getChatHistory(null, controller.signal);

      if (response) {
        setChatHistory([
          ...response.chatHistory.reverse().map((chat) => {
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
    };

    console.log("Get chat history");
    getHistory();

    return () => {
      console.log("Clean up chat history");
      controller.abort();
      setChatHistory([]);
    };
  }, []);

  const handleQuerySend = async () => {
    if (askingQuery || userQuery.length === 0) return;

    setAskingQuery(true);
    setChatHistory([
      ...chatHistory,
      {
        query: userQuery,
        queryId: null,
        response: null,
        responseId: null,
        status: QueryStatus.SENDING,
      },
    ]);
    setUserQuery("");

    const response = await askQuery(userQuery);

    setChatHistory((prevHistory) => {
      const updatedHistory = [...prevHistory];
      const lastItem = prevHistory[prevHistory.length - 1];

      updatedHistory[updatedHistory.length - 1] = {
        ...lastItem,
        queryId: response?.queryId || null,
        responseId: response?.responseId || null,
        status: response?.status || QueryStatus.FAILED,
      };

      return updatedHistory;
    });
    setAskingQuery(false);
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
            <ChatHistory chatHistory={chatHistory} />
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
