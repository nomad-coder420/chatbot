import React from "react";
import classes from "./index.module.css";
import { QueryStatus } from "../../../constants/types";
import errorIcon from "../../../assets/svg/error.svg";

const UserQuery = ({
  query,
  status,
}: {
  query: string;
  status: QueryStatus;
}) => {
  return (
    <div className={classes.userQueryContainer}>
      {status === QueryStatus.FAILED && (
        <div className={classes.errorIconContainer}>
          <img src={errorIcon} alt="errorIcon" className={classes.errorIcon} />
        </div>
      )}
      <div className={classes.userQuery}>
        <p className={classes.userQueryText}>{query}</p>
      </div>
    </div>
  );
};

export default UserQuery;
