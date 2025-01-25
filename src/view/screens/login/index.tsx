import React, { useState } from "react";
import classes from "./index.module.css";
import loginImage from "../../../assets/images/loginImage.png";
import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import Loader from "../../components/loader";
import { loginUser } from "../../../redux/thunks/auth";

const LoginScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSuccess = async (credentialResponse: CodeResponse) => {
    await loginUser(credentialResponse.code);
    setIsLoading(false);
  };

  const handleLoginError = (error: any) => {
    console.error(error);
    setIsLoading(false);
  };

  const login = useGoogleLogin({
    onSuccess: (response: CodeResponse) => {
      handleLoginSuccess(response);
    },
    onError: (error) => {
      handleLoginError(error);
    },
    flow: "auth-code",
  });

  const handleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    login();
  };

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
        <button
          className={classes.loginButton}
          onClick={() => {
            handleLogin();
          }}
          disabled={isLoading}
          style={{
            opacity: isLoading ? "0.7" : "1",
          }}
        >
          {isLoading ? (
            <div className={classes.loaderContainer}>
              <Loader />
            </div>
          ) : (
            <div className={classes.loginButtonContainer}>
              <div className={classes.loginButtonTextContainer}>
                <p className={classes.loginButtonText}>Login with Google</p>
              </div>
              <div className={classes.loginButtonIcon}>
                <p>G</p>
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
