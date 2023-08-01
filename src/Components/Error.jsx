import React from "react";
import { Link } from "react-router-dom";
import "../Styles/Error.css";
const Error = () => {
  document.title = "404 Error - Chat App";
  return (
    <section className="errorSec">
      <div className="errorCard">
        <p className="errorTitle">404 Error - Chat App</p>
        <p className="errorSubTitle"> Page Not Found</p>
        <img
          className="errorImg"
          src="https://firebasestorage.googleapis.com/v0/b/chatappbykrish.appspot.com/o/Assets%2Ferror-Image.png?alt=media&token=d2f2f0df-229f-48b9-8aaf-8a0e23650598"
          alt=""
        />
        <button className="errorHomeBtn">
          <Link to="/">Go To Home Page</Link>
        </button>
      </div>
    </section>
  );
};

export default Error;
