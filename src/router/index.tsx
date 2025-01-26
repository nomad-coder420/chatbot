import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "../view/screens/login/";
import ChatScreen from "../view/screens/chat/";
import { getAccessToken } from "../redux/thunks/auth.thunk";

const AppRouter = () => {
  const access = getAccessToken();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            access ? <Navigate to={"/chat"} /> : <Navigate to={"/login"} />
          }
        />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/chat" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
