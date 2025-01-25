import React from "react";
import classes from "./index.module.css";

const UserQuery = ({ query }: { query: string }) => {
  return (
    <div className={classes.userQueryContainer}>
      <div className={classes.userQuery}>
        <p className={classes.userQueryText}>{query}</p>
      </div>
    </div>
  );
};

export default UserQuery;
