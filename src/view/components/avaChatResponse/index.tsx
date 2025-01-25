import React from "react";
import classes from "./index.module.css";
import avaImage from "../../../assets/images/ava.png";
import { QueryStatus } from "../../../constants/types";
import BeatLoader from "../beatLoader";

const AvaChatLoader = () => {
  return <BeatLoader width={12} height={12} color="#7d37ff" />;
};

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
          {status === QueryStatus.SENDING ? (
            <AvaChatLoader />
          ) : status === QueryStatus.FAILED ? (
            `STATUS:: ${status}`
          ) : (
            response
          )}
        </p>
      </div>
    </div>
  );
};

export default AvaChatResponse;
