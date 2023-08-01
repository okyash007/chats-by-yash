import React from "react";
import { BsChatRight } from "react-icons/bs";
import CryptoJS from "crypto-js";
const Friends = (props) => {
  const sendReceiveMessage = (text) => {
    let cid = props.chat[0];
    let lMessage = CryptoJS.AES.decrypt(text, cid);
    return lMessage.toString(CryptoJS.enc.Utf8);
  };
  return (
    <div
      className="friendCard animate__animated animate__fadeIn"
      onClick={() => props.selectFriendHandler(props.chat[1].userInfo)}
    >
      <img
        className="friendProfilePhoto"
        src={props.chat[1].userInfo.photo}
        alt=""
      />
      <div className="nameAndLastMessageDiv">
        <p className="friendName">{props.chat[1].userInfo.displayName}</p>
        <small className="lastMessage">
          {sendReceiveMessage(props.chat[1].lastMessage) !== ""
            ? sendReceiveMessage(props.chat[1].lastMessage).slice(0, 40)
            : sendReceiveMessage(props.chat[1].lastMessage)}
        </small>
      </div>
      <span className="chatIcon">
        <BsChatRight />
      </span>
    </div>
  );
};

export default Friends;
