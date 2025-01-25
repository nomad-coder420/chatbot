import * as React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginScreen from "../view/screens/login/";
import ChatScreen from "../view/screens/chat/";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={"/login"} />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/chat/" element={<ChatScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
