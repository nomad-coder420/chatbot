import React, { useState } from "react";
import classes from "./index.module.css";
import { QueryStatus } from "../../../constants/types";
import errorIcon from "../../../assets/svg/error.svg";
import deleteIcon from "../../../assets/svg/delete.svg";
import editIcon from "../../../assets/svg/edit.svg";
import Loader from "../loader";

const UserQuery = ({
  query,
  status,
  isCurrentChat,
  deleteQuery,
  editQuery,
  isEditDeleteLoading,
}: {
  query: string;
  status: QueryStatus;
  isCurrentChat?: boolean;
  deleteQuery?: () => Promise<void>;
  editQuery?: () => Promise<void>;
  isEditDeleteLoading?: boolean;
}) => {
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteQuery) return;

    setIsLoading(true);
    await deleteQuery();
    setIsLoading(false);
  };

  const handleEdit = async () => {
    if (!editQuery) return;
    setIsLoading(true);
    await editQuery();
    setIsLoading(false);
  };

  return (
    <div
      className={classes.userQueryContainer}
      onMouseEnter={() => setShowEditDelete(true)}
      onMouseLeave={() => setShowEditDelete(false)}
    >
      {!isCurrentChat &&
        (!isEditDeleteLoading ? (
          <>
            <div className={classes.editDeleteIconContainer}>
              {showEditDelete && (
                <>
                  <img
                    src={deleteIcon}
                    alt="deleteIcon"
                    className={classes.deleteIcon}
                    onClick={() => {
                      handleDelete();
                    }}
                  />
                  <img
                    src={editIcon}
                    alt="editIcon"
                    className={classes.editIcon}
                    onClick={() => {
                      handleEdit();
                    }}
                  />
                </>
              )}
            </div>
            {status === QueryStatus.FAILED && (
              <div className={classes.errorIconContainer}>
                <img
                  src={errorIcon}
                  alt="errorIcon"
                  className={classes.errorIcon}
                />
              </div>
            )}
          </>
        ) : isLoading ? (
          <div className={classes.loaderContainer}>
            <Loader color="#7d37ff" />
          </div>
        ) : null)}
      <div className={classes.userQuery}>
        <p className={classes.userQueryText}>{query}</p>
      </div>
    </div>
  );
};

export default UserQuery;
