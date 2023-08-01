import React from "react";
import Auth from "./Components/Auth";
import Home from "./Components/Home";
import "./Styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserInfo from "./Components/UserInfo";
import Setting from "./Components/Setting";
import Feedback from "./Components/Feedback";
import Error from "./Components/Error";
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Auth />} />
          <Route path="/user-details" element={<UserInfo />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/*" element={<Error />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
