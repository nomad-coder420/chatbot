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
  response: string | null;
  status: QueryStatus;
}) => {
  if (status === QueryStatus.SUCCEEDED && !response) return;

  return (
    <div className={classes.avaChatResponseContainer}>
      <div className={classes.avaChatIconContainer}>
        <img src={avaImage} alt="ava" className={classes.avaChatIcon} />
      </div>
      <div className={classes.avaChatResponse}>
        {status === QueryStatus.SENDING || status === QueryStatus.CREATED ? (
          <AvaChatLoader />
        ) : status === QueryStatus.FAILED ? (
          `STATUS:: ${status}`
        ) : (
          <p className={classes.avaChatResponseText}>{response}</p>
        )}
      </div>
    </div>
  );
};

export default AvaChatResponse;
