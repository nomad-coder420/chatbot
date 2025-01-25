import React from "react";
import classes from "./index.module.css";
import loginImage from "../../../assets/images/loginImage.png";
import { Link } from "react-router-dom";

const LoginScreen: React.FC = () => {
  return (
    <div className={classes.loginScreenContainer}>
      <div>
        <div className={classes.loginImageContainer}>
          <img
            src={loginImage}
            alt="loginImage"
            className={classes.loginImage}
          />
        </div>
        <div>
          <p className={classes.loginHeading}>Hey 👋, I'm Ava</p>
          <p className={classes.loginSubHeading}>Login to continue</p>
        </div>
      </div>
      <div className={classes.loginFormContainer}>
        <Link to="/chat">
          <button className={classes.loginButton} onClick={() => {}}>
            <div className={classes.loginButtonContainer}>
              <div className={classes.loginButtonTextContainer}>
                <p className={classes.loginButtonText}>Login with Google</p>
              </div>
              <div className={classes.loginButtonIcon}>
                <p>G</p>
              </div>
            </div>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
