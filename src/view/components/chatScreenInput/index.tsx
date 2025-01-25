import React, { useState } from "react";
import classes from "./index.module.css";
import sendIcon from "../../../assets/svg/send.svg";

const ChatScreenInput = ({
  userQuery,
  setUserQuery,
  handleQuerySend,
  disabled = false,
}: {
  userQuery: string;
  setUserQuery: (query: string) => void;
  handleQuerySend: () => void;
  disabled?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(true);

  const isValidLength = userQuery.length === 0;
  const isSendDisabled = disabled || isValidLength;

  const handleSend = () => {
    if (isSendDisabled) return;
    handleQuerySend();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className={classes.chatInputContainer}
      style={{
        borderTop: isFocused ? "1px solid #7d37ff" : "1px solid #d9d9d9",
      }}
    >
      <div className={classes.inputBoxContainer}>
        <input
          type="text"
          placeholder="Your question"
          className={classes.inputBox}
          value={userQuery}
          onChange={(e) => {
            setUserQuery(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          autoFocus
        />
      </div>
      <div
        className={classes.sendButtonContainer}
        onClick={() => {
          handleSend();
        }}
        style={{
          opacity: isSendDisabled ? 0.5 : 1,
          cursor: isSendDisabled ? "not-allowed" : "pointer",
        }}
      >
        <img src={sendIcon} alt="sendIcon" className={classes.sendIcon} />
      </div>
    </div>
  );
};

export default ChatScreenInput;
