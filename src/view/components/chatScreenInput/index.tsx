import React from "react";
import classes from "./index.module.css";
import sendIcon from "../../../assets/svg/send.svg";

const ChatScreenInput = () => {
  return (
    <div className={classes.chatInputContainer}>
      <div className={classes.inputBoxContainer}>
        <input
          type="text"
          placeholder="Your question"
          className={classes.inputBox}
        />
      </div>
      <div className={classes.sendButtonContainer}>
        <img src={sendIcon} alt="sendIcon" className={classes.sendIcon} />
      </div>
    </div>
  );
};

export default ChatScreenInput;
