import React from "react";
import classes from "./index.module.css";
import avaImage from "../../../assets/images/ava.png";
import { QueryStatus } from "../../../constants/types";

const AvaChatResponse = ({
  response,
  status,
}: {
  response: string;
  status: QueryStatus;
}) => {
  return (
    <div className={classes.avaChatResponseContainer}>
      <div className={classes.avaChatIconContainer}>
        <img src={avaImage} alt="ava" className={classes.avaChatIcon} />
      </div>
      <div className={classes.avaChatResponse}>
        <p className={classes.avaChatResponseText}>
          {[
            QueryStatus.SENDING,
            QueryStatus.FAILED,
          ].includes(status)
            ? `STATUS:: ${status}`
            : response}
        </p>
      </div>
    </div>
  );
};

export default AvaChatResponse;
