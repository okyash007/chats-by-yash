import React, { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../backend/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../Styles/Setting.css";
import {
  IoChevronBackOutline,
  IoPersonCircleSharp,
  IoBugSharp,
  IoPulseSharp,
  IoSettingsSharp,
  IoWarning,
} from "react-icons/io5";
const Setting = () => {
  const logoutHandlerClick = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        alert(error);
      });
  };
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
      }
    });
  }, [navigate]);
  const openDeveloperPage = () => {
    window.open("https://okyash007.vercel.app", "_blank");
  };
  return (
    <section className="settingContainer">
      <div className="settingList animate__animated animate__fadeInDown">
        <div className="settingTitle">
          Settings
          <span className="settingIconTitle">
            <IoSettingsSharp />
          </span>{" "}
        </div>
        <ul>
          <li onClick={() => navigate("/home")}>
            <span className="settingIcon">
              <IoChevronBackOutline />
            </span>{" "}
            <span className="settingText">Back To Chat</span>
          </li>
          <li onClick={() => navigate("/user-details")}>
            <span className="settingIcon">
              <IoPersonCircleSharp />
            </span>{" "}
            <span className="settingText">Update Profile</span>
          </li>
          <li onClick={() => navigate("/feedback")}>
            <span className="settingIcon">
              <IoBugSharp />
            </span>{" "}
            <span className="settingText">Feedbacks</span>
          </li>
          <li onClick={openDeveloperPage}>
            <span className="settingIcon">
              <IoPulseSharp />
            </span>{" "}
            <span className="settingText">Developer Details</span>
          </li>
          <li onClick={logoutHandlerClick}>
            <span className="settingIcon">
              <IoWarning />
            </span>{" "}
            <span className="settingText">Logout Account</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Setting;
