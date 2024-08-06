import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./authPages/LoginPage/LoginPage";
import RegisterPage from "./authPages/RegisterPage/RegisterPage";
import Dashboard from "./Dashboard/Dashboard";
import AlertNotification from "./shared/components/AlertNotification";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <AlertNotification />
    </>
  );
};

export default App;
