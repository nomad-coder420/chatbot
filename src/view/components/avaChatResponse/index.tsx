import React from "react";
import classes from "./index.module.css";
import avaImage from "../../../assets/images/ava.png";

const AvaChatResponse = ({ response }: { response: string }) => {
  return (
    <div className={classes.avaChatResponseContainer}>
      <div className={classes.avaChatIconContainer}>
        <img src={avaImage} alt="ava" className={classes.avaChatIcon} />
      </div>
      <div className={classes.avaChatResponse}>
        <p className={classes.avaChatResponseText}>{response}</p>
      </div>
    </div>
  );
};

export default AvaChatResponse;
