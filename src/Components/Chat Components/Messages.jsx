import React, { useRef, useEffect } from "react";
import CryptoJS from "crypto-js";

const Messages = (props) => {
  const refe = useRef();
  const sendReceiveMessage = (text) => {
    let cid =
      props.uid > props.frndUid
        ? props.uid + props.frndUid
        : props.frndUid + props.uid;
    let lMessage = CryptoJS.AES.decrypt(text, cid);
    return lMessage.toString(CryptoJS.enc.Utf8);
  };
  useEffect(() => {
    refe.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.messages]);

  if (props.uid === props.messages.senderId) {
    return (
      <>
        <div className="senderMessageShow" ref={refe} key={props.messages.id}>
          {props.messages.photo === undefined ? (
            <p className="userSRMessage">
              {sendReceiveMessage(props.messages.text)}
            </p>
          ) : (
            <img
              onClick={props.imageFullViewHandler}
              className="sendPhotoMessage"
              src={props.messages.photo}
              alt="message display"
            />
          )}
          <small className="messageTimestamp">
            {props.messages.date
              .toDate()
              .toString()
              .replace(" GMT+0530 (India Standard Time)", "")}
          </small>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="receiverMessageShow" ref={refe} key={props.messages.id}>
          {props.messages.photo === undefined ? (
            <p className="userSRMessage">
              {sendReceiveMessage(props.messages.text)}
            </p>
          ) : (
            <img
              onClick={props.imageFullViewHandler}
              className="sendPhotoMessage"
              src={props.messages.photo}
              alt="message display"
            />
          )}
          <small className="messageTimestamp">
            {props.messages.date
              .toDate()
              .toString()
              .replace(" GMT+0530 (India Standard Time)", "")}
          </small>
        </div>
      </>
    );
  }
};

export default Messages;
