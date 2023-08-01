import React, { useState } from "react";
import { TbUpload } from "react-icons/tb";
import { BiSend } from "react-icons/bi";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { db, storage } from "../../backend/firebaseConfig";
import {
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import CryptoJS from "crypto-js";
import { RiUploadCloud2Line } from "react-icons/ri";
const SendMessage = (props) => {
  const [sendMessage, setSendMessage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleKeyboardClickSend = (e) => {
    e.code === "Enter" && sendMessageHandlerClick();
  };
  const sendMessageHandlerClick = async () => {
    if (sendMessage !== "") {
      setSendMessage("");
      let combinedId =
        props.userUid > props.frndUid
          ? props.userUid + props.frndUid
          : props.frndUid + props.userUid;
      let encryptMessage = CryptoJS.AES.encrypt(
        sendMessage,
        combinedId
      ).toString();
      await updateDoc(doc(db, "chats", combinedId), {
        messages: arrayUnion({
          id: uuid(),
          text: encryptMessage,
          senderId: props.userUid,
          date: Timestamp.now(),
        }),
      });
      await updateDoc(doc(db, "userChats", props.userUid), {
        [combinedId + ".lastMessage"]: encryptMessage,
        [combinedId + ".date"]: serverTimestamp(),
      });
      await updateDoc(doc(db, "userChats", props.frndUid), {
        [combinedId + ".lastMessage"]: encryptMessage,
        [combinedId + ".date"]: serverTimestamp(),
      });
    }
  };
  const sendPhotoMessage = async (e) => {
    const metadata = {
      contentType: e.target.files[0].type,
    };
    const storageRef = ref(storage, `User Send Photos/${uuid()}`);
    const uploadTask = uploadBytesResumable(
      storageRef,
      e.target.files[0],
      metadata
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progress !== "" && setUploadStatus(progress.toString().slice(0, 4));
      },
      (error) => {
        alert(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          let combinedId =
            props.userUid > props.frndUid
              ? props.userUid + props.frndUid
              : props.frndUid + props.userUid;
          updateDoc(doc(db, "chats", combinedId), {
            messages: arrayUnion({
              id: uuid(),
              photo: downloadURL,
              senderId: props.userUid,
              date: Timestamp.now(),
            }),
          });
          setUploadStatus("");
        });
      }
    );
  };
  return (
    <div className="sendMessageSection animate__animated animate__fadeIn">
      <input
        type="text"
        id="message"
        value={sendMessage}
        className="inputMessage"
        placeholder="Enter Your Message Here"
        required
        autoComplete="off"
        onChange={(e) => setSendMessage(e.target.value)}
        onKeyDown={handleKeyboardClickSend}
      />
      <div className="sendMessageBtnsArea">
        {uploadStatus !== "" && (
          <span id="uploadPhotoMessageStatus">
            <span className="uploadIcon">
              <RiUploadCloud2Line />
            </span>
            {uploadStatus}%
          </span>
        )}
        <label htmlFor="sendPhotoMessage" className="uploadPhotoMessage">
          {uploadStatus === "" && (
            <span className="sendPhotoIcon">
              <TbUpload />
            </span>
          )}
        </label>
        <input
          className="disable"
          type="file"
          name="sendPhotoMessage"
          id="sendPhotoMessage"
          onChange={sendPhotoMessage}
        />
        <span className="sendIcon" onClick={sendMessageHandlerClick}>
          <BiSend />
        </span>
      </div>
    </div>
  );
};

export default SendMessage;
