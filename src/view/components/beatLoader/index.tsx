import React from "react";
import classes from "./index.module.css";

const BeatLoader = ({
  width = 24,
  height = 24,
  margin = 2,
  color = "white",
  containerStyles = {},
}: {
  width?: number;
  height?: number;
  margin?: number;
  color?: string;
  containerStyles?: React.CSSProperties;
}) => {
  const dotStyle = (index: number): React.CSSProperties => {
    const delay = index * 0.3;

    return {
      width,
      height,
      backgroundColor: color,
      margin,
      animation: `${classes.beatLoaderAnimation} 0.9s ${delay}s infinite linear`,
    };
  };
  return (
    <div className={classes.loaderContainer} style={{ ...containerStyles }}>
      <span className={classes.loaderDot} style={{ ...dotStyle(0) }} />
      <span className={classes.loaderDot} style={{ ...dotStyle(1) }} />
      <span className={classes.loaderDot} style={{ ...dotStyle(2) }} />
    </div>
  );
};

export default BeatLoader;
