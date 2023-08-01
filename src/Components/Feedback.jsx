import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../backend/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
const Feedback = () => {
  const navigate = useNavigate();
  const notifySuccess = () => {
    toast.success("Form Submitted Successfully!", {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };
  const notifyAlert = () => {
    toast.warn("Enter Fields Correctly!", {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const [data, setData] = useState({
    fullname: "",
    email: "",
    message: "",
  });
  let name, value;
  const getUserData = (event) => {
    name = event.target.name;
    value = event.target.value;
    setData({ ...data, [name]: value });
  };
  const { fullname, email, message } = data;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "feedbacks"), {
        fullname: fullname,
        email: email,
        message: message,
        created: Timestamp.now(),
      });
      notifySuccess();
    } catch (err) {
      notifyAlert();
    }
  };
  return (
    <React.StrictMode>
      <section className="feedbackContainer">
        <section className="feedbackCard animate__animated animate__fadeInDown">
          <div className="titlaFeedbackArea">
            <h1 className="contTitle">Feedback/ Report Bug</h1>
            <div
              className="closeFeedback"
              onClick={() => navigate("/settings")}
            >
              <AiOutlineClose />
            </div>
          </div>
          <div className="formInputWrapper">
            <label htmlFor="fname">Full Name</label>
            <input
              onChange={getUserData}
              value={data.fullname}
              type="text"
              id="fname"
              name="fullname"
              required
            />
          </div>
          <div className="formInputWrapper">
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              onChange={getUserData}
              value={data.email}
            />
          </div>
          <div className="formInputWrapper">
            <label htmlFor="message">Your Message/ BUG Report</label>
            <textarea
              onChange={getUserData}
              value={data.message}
              name="message"
              id="message"
              rows="4"
              required
            ></textarea>
          </div>

          <button id="submitBtn" onClick={handleSubmit}>
            Submit Now
          </button>
        </section>
        <ToastContainer />
      </section>
    </React.StrictMode>
  );
};

export default Feedback;
