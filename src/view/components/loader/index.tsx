import React from "react";
import classes from "./index.module.css";

const Loader = ({
  width = 24,
  height = 24,
  color = "white",
}: {
  width?: number;
  height?: number;
  color?: string;
}) => {
  return (
    <span
      className={classes.loader}
      style={{
        width,
        height,
        borderTopColor: color,
        borderLeftColor: color,
        borderRightColor: color,
      }}
    />
  );
};

export default Loader;
