import * as React from "react";
import classes from "./index.module.css";
import AppRouter from "../../router/";

const App = () => {
  return (
    <div className={classes.layout}>
      <div className={classes.appContainer}>
        <AppRouter />
      </div>
    </div>
  );
};

export default App;
