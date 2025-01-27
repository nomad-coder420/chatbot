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
  isCurrentChat,
}: {
  response: string | null;
  status: QueryStatus;
  isCurrentChat?: boolean;
}) => {
  if (status === QueryStatus.FAILED) return;

  const cleanedResponse = response?.replace(/\\n/g, "")?.replace("<end>", "");

  return (
    <div className={classes.avaChatResponseContainer}>
      <div className={classes.avaChatIconContainer}>
        <img src={avaImage} alt="ava" className={classes.avaChatIcon} />
      </div>
      <div className={classes.avaChatResponse}>
        {isCurrentChat &&
        [
          QueryStatus.SENDING,
          QueryStatus.CREATED,
          QueryStatus.IN_PROGRESS,
        ].includes(status) ? (
          <AvaChatLoader />
        ) : (
          <p className={classes.avaChatResponseText}>{cleanedResponse}</p>
        )}
      </div>
    </div>
  );
};

export default AvaChatResponse;
