import React, { useState } from "react";
import "../Styles/Auth.css";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../backend/firebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "animate.css";
const Auth = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/home");
    }
  });
  const [status, setStatus] = useState("signin");
  const [block, setBlock] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const notifyAlert = (text, type) => {
    if (type === "error") {
      toast.error(text, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (type === "warn") {
      toast.warn(text, {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const signUpBtnClickHandler = async () => {
    if (email !== "" && password !== "") {
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/user-details");
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "auth/invalid-email")
            notifyAlert("Email Doesn't Exist!", "error");
          else if (error.code === "auth/weak-password")
            notifyAlert("Weak Password!", "warn");
          else if (error.code === "auth/wrong-password")
            notifyAlert("Wrong Password!", "error");
          else if (error.code === "auth/email-already-in-use")
            notifyAlert("Email Already In Use!", "warn");
          else if (error.code === "auth/user-disabled") setBlock(true);
        });
    }
  };
  const signinBtnClickHandler = () => {
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/home");
        })
        .catch((error) => {
          console.log(error);
          if (error.code === "auth/invalid-email")
            notifyAlert("Email Doesn't Exist!", "error");
          else if (error.code === "auth/weak-password")
            notifyAlert("Weak Password!", "warn");
          else if (error.code === "auth/wrong-password")
            notifyAlert("Wrong Password!", "error");
          else if (error.code === "auth/user-not-found")
            notifyAlert("User Not Found!", "error");
          else if (error.code === "auth/email-already-in-use")
            notifyAlert("Email Already In Use!", "warn");
          else if (error.code === "auth/user-disabled") setBlock(true);
        });
    }
  };

  const googleLoginEventHandler = () => {
    signInWithPopup(auth, provider)
      .then((userCredential) => {
        navigate("/user-details");
      })
      .then((error) => {
        console.log(error);
        if (error.code === "auth/invalid-email")
          notifyAlert("Email Doesn't Exist!", "error");
        else if (error.code === "auth/weak-password")
          notifyAlert("Weak Password!", "warn");
        else if (error.code === "auth/wrong-password")
          notifyAlert("Wrong Password!", "error");
        else if (error.code === "auth/email-already-in-use")
          notifyAlert("Email Already In Use!", "warn");
        else if (error.code === "auth/user-disabled") setBlock(true);
      });
  };

  const forgetPasswordHandler = () => {
    sendPasswordResetEmail(auth, email);
    notifyAlert(
      "Reset Link Send On Your Email (Check Spam If Not Found)",
      "warn"
    );
  };
  const mailToDeveloperHandler = () => {
    window.open(`mailto:jotaniyakrish07@gmail.com`, "_self");
  };
  return (
    <>
      <section className="authContainer">
        {block ? (
          <div className="blockCard">
            <p className="blockTitle">Account has been Blocked!</p>
            <button className="blockBtn" onClick={mailToDeveloperHandler}>
              Contact Developer
            </button>
          </div>
        ) : (
          <section className={block ? "disable" : ""}>
            <div
              className={
                status === "signup"
                  ? "signUpCard animate__animated animate__fadeInDown"
                  : "disable"
              }
            >
              <p className="cardTitle">Create New Account</p>
              <div className="inputWrapper">
                <label htmlFor="emailsu">Email Address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  id="emailsu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="inputWrapper">
                <label htmlFor="passwordsu">Password</label>
                <input
                  type="password"
                  name="password"
                  id="passwordsu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="buttonWrapper">
                <button
                  className="authBtns"
                  id="signUpBtn"
                  onClick={signUpBtnClickHandler}
                >
                  Sign Up
                </button>
              </div>
              <div className="dividerWrapper"></div>
              <div className="buttonWrapper">
                <button
                  className="googleSignIn"
                  onClick={googleLoginEventHandler}
                >
                  Sign In With Google
                </button>
              </div>
              <p className="AlreadyAccText" onClick={() => setStatus("signin")}>
                Already Have Account?{" "}
                <span id="signinPageRedirect">SIGN IN</span>
              </p>
            </div>
            <div
              className={
                status === "signin"
                  ? "signinCard animate__animated animate__fadeInDown"
                  : "disable"
              }
            >
              <p className="cardTitle">Sign In To Your Account</p>
              <div className="inputWrapper">
                <label htmlFor="emailsi">Email Address</label>
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  id="emailsi"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="inputWrapper">
                <label htmlFor="passwordsi">Password</label>
                <input
                  type="password"
                  name="password"
                  id="passwordsi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p className="forgetPass" onClick={forgetPasswordHandler}>
                Forget Password?
              </p>
              <div className="buttonWrapper">
                <button
                  className="authBtns"
                  id="signInBtn"
                  onClick={signinBtnClickHandler}
                >
                  Sign In
                </button>
              </div>
              <div className="dividerWrapper"></div>
              <div className="buttonWrapper">
                <button
                  className="googleSignIn"
                  onClick={googleLoginEventHandler}
                >
                  Sign In With Google
                </button>
              </div>
              <p className="AlreadyAccText" onClick={() => setStatus("signup")}>
                Don't Have Any Account?{" "}
                <span id="signinPageRedirect">CREATE ONE</span>
              </p>
            </div>
            <ToastContainer />
          </section>
        )}
      </section>
    </>
  );
};

export default Auth;
