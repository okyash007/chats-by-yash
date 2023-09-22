import React, { useState } from "react";
// import "../Styles/Auth.css";
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
      <section className="authContainer flex justify-center items-center bg-[#333333] h-screen ">
        {block ? (
          <div className="blockCard">
            <p className="blockTitle">Account has been Blocked!</p>
            <button className="blockBtn" onClick={mailToDeveloperHandler}>
              Contact Developer
            </button>
          </div>
        ) : (
          <section className={block ? "disable" : " w-[30%] "}>
            <div
              className={
                status === "signup"
                  ? "bg-[#333333] rounded-lg flex flex-col backdrop-blur-[5px] p-5 py-10 signUpCard animate__animated animate__fadeInDown"
                  : "disable"
              }
            >
              <p className="cardTitle pb-2 text-6xl text-white">
                Create New Account
              </p>

              <div class="input-container mb-2">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="input-field text-white text-2xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="input-highlight"></span>
              </div>

              <div class="input-container mb-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field text-white text-2xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-highlight"></span>
              </div>

              <div className="buttonWrapper flex ">
                <button
                  className="authBtns w-full bg-[#3c3c3c] text-white rounded-lg p-2 mr-1 mb-2 text-xl from-neutral-100"
                  id="signUpBtn"
                  onClick={signUpBtnClickHandler}
                >
                  Sign Up
                </button>

                <button
                  className="googleSignIn w-full bg-[#3c3c3c] p-2 ml-1 rounded-lg mb-2 text-xl"
                  onClick={googleLoginEventHandler}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png"
                    className="h-9 inline-block"
                    alt=""
                  />
                </button>
              </div>
              <p
                className="AlreadyAccText text-sm text-[#979797]"
                onClick={() => setStatus("signin")}
              >
                Already Have Account?{" "}
                <span id="signinPageRedirect">
                  <p className="inline-block text-white text-lg cursor-pointer hover:underline">
                    SIGN IN
                  </p>{" "}
                </span>
              </p>
            </div>
            <div
              className={
                status === "signin"
                  ? " bg-[#333333] rounded-lg flex flex-col backdrop-blur-[5px] p-5 py-10 signinCard animate__animated animate__fadeInDown"
                  : "disable"
              }
            >
              <p className="cardTitle pb-2 text-6xl text-white">
                Sign In To Your Account
              </p>

              <div class="input-container mb-2">
                <input
                  type="email"
                  placeholder="E-mail"
                  className="input-field text-white text-2xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="input-highlight"></span>
              </div>

              <div class="input-container mb-2">
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field text-white text-2xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-highlight"></span>
              </div>

              <p
                className="forgetPass text-white text-lg py-2"
                onClick={forgetPasswordHandler}
              >
                Forget Password?
              </p>
              <div className="buttonWrapper flex">
                <button
                  className="authBtns w-full bg-[#3c3c3c] text-white rounded-lg p-2 mr-1 mb-2 text-xl"
                  id="signInBtn"
                  onClick={signinBtnClickHandler}
                >
                  Sign In
                </button>
                <button
                  className="googleSignIn w-full bg-[#3c3c3c] text-white rounded-lg p-2 mr-1 mb-2 text-xl"
                  onClick={googleLoginEventHandler}
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png"
                    className="h-9 inline-block"
                    alt=""
                  />
                </button>
              </div>
              <p className="AlreadyAccText text-sm text-[#979797]" onClick={() => setStatus("signup")}>
                Don't Have Any Account?{" "}
                <span id="signinPageRedirect"><p className="inline-block text-white text-lg cursor-pointer hover:underline"> CREATE ONE</p> </span>
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
