import React from "react";
import classes from "./index.module.css";
import avaImage from "../../../assets/images/ava.png";
import logoutIcon from "../../../assets/svg/logout.svg";
import { Link } from "react-router-dom";
import UserQuery from "../../components/userQuery";
import AvaChatResponse from "../../components/avaChatResponse";
import ChatScreenInput from "../../components/chatScreenInput";

const ChatScreenHeader = () => {
  return (
    <div className={classes.chatHeaderContainer}>
      <div className={classes.headerIconContainer}></div>
      <div className={classes.headerImageContainer}>
        <img src={avaImage} alt="ava" className={classes.avaImage} />
      </div>
      <div className={classes.headerIconContainer}>
        <div className={classes.logoutIconContainer}>
          <Link to="/login">
            <img
              src={logoutIcon}
              alt="logoutIcon"
              className={classes.logoutIcon}
            />
          </Link>
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

const ChatHistory = () => {
  return (
    <div className={classes.chatHistory}>
      <AvaChatResponse response="The capital of France is Paris." />
      <UserQuery query="What is the capital of France?" />
      <AvaChatResponse response="The capital of France is Paris." />
    </div>
  );
};

const ChatScreen = () => {
  return (
    <div className={classes.chatScreen}>
      <ChatScreenHeader />

      <div className={classes.chatHistoryContainer}>
        <ChatScreenTitle />
        <ChatHistory />
      </div>

      <ChatScreenInput />
    </div>
  );
};

export default ChatScreen;
