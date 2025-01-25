import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./view/layout/index";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import reportWebVitals from "./reportWebVitals.js";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
