/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../backend/firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";
import { TbCopy } from "react-icons/tb";
import { MdGroupAdd } from "react-icons/md";
import { AiFillSetting, AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import "animate.css";
import "react-toastify/dist/ReactToastify.css";
import {
  collection,
  query,
  where,
  getDoc,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import Friends from "./Chat Components/Friends";
import Messages from "./Chat Components/Messages";
import SendMessage from "./Chat Components/SendMessage";
import { v4 as uuid } from "uuid";
import { IoIosArrowBack } from "react-icons/io";
const Home = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");
  const [searchFriend, setSearchFriend] = useState({
    name: "",
    photo: "",
    uid: "",
    email: "",
  });
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    photo: "",
    uid: "",
  });
  const [selectedFrnd, setSelectedFrnd] = useState("");
  const [messages, setMessages] = useState();
  const [photoView, setPhotoView] = useState();
  const [photoDisplay, setPhotoDisplay] = useState(false);
  const [android, setAndroid] = useState(false);
  const [searchStart, setSearchStart] = useState(false);
  useEffect(() => {
    const getData = () => {
      const unsub = onSnapshot(doc(db, "userChats", userDetails.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    userDetails.uid && getData();
  }, [userDetails.uid]);

  useEffect(() => {
    var userAgent = navigator.userAgent.toLowerCase();
    var Android = userAgent.indexOf("android") > -1;
    if (Android) setAndroid(true);
  }, []);

  useEffect(() => {
    let combinedId =
      userDetails.uid > selectedFrnd.uid
        ? userDetails.uid + selectedFrnd.uid
        : selectedFrnd.uid + userDetails.uid;
    const unsub = onSnapshot(doc(db, "chats", combinedId), (doc) => {
      doc.exists() && setMessages(doc.data());
    });
    return () => {
      unsub();
    };
  }, [selectedFrnd.uid, userDetails.uid]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      } else {
        setUserDetails({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        });
      }
    });
  }, [navigate]);

  const userProfilePicClickHandler = () => {
    navigate("/user-details");
  };

  const handlerSearch = async () => {
    if (search !== userDetails.uid.slice(0, 6)) {
      setSearchStart(true);
      const q = query(
        collection(db, "users"),
        where("uniqueCode", "==", search)
      );
      console.log(q);
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log(querySnapshot);
        setSearchFriend({
          name: doc.data().username,
          email: doc.data().email,
          photo: doc.data().photo,
          uid: doc.data().UID,
        });
      });
    }
  };

  const addFriendToListHandler = async () => {
    setSearchStart(false);
    let combinedId =
      userDetails.uid > searchFriend.uid
        ? userDetails.uid + searchFriend.uid
        : searchFriend.uid + userDetails.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "userChats", userDetails.uid), {
          [combinedId + ".userInfo"]: {
            uid: searchFriend.uid,
            displayName: searchFriend.name,
            photo: searchFriend.photo,
          },
          [combinedId + ".lastMessage"]: "",
          [combinedId + ".date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "userChats", searchFriend.uid), {
          [combinedId + ".userInfo"]: {
            uid: userDetails.uid,
            displayName: userDetails.name,
            photo: userDetails.photo,
          },
          [combinedId + ".lastMessage"]: "",
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      setSearchFriend("");
      setSearchStart(false);
      setSearch("");
    } catch (error) {
      console.log(error);
    }
  };

  const copyUniqueCodeHandlerOur = () => {
    navigator.clipboard.writeText(userDetails.uid.slice(0, 6));
    toast.success("Unique Code Copied!", {
      position: "bottom-right",
      hideProgressBar: false,
      progress: undefined,
      theme: "dark",
      autoClose: 2000,
    });
  };

  const copyUniqueCodeHandlerFriend = () => {
    navigator.clipboard.writeText(selectedFrnd.uid.slice(0, 6));
    toast.success("Unique Code Copied!", {
      position: "bottom-right",
      hideProgressBar: false,
      progress: undefined,
      theme: "dark",
      autoClose: 2000,
    });
  };
  const selectFriendHandler = (data) => {
    setSelectedFrnd(data);
    setMessages("");
    if (android) {
      let cont1 = document.getElementById("friendListSection");
      cont1.style.display = "none";
      let cont3 = document.getElementById("friendListView");
      cont3.style.display = "none";
      let cont2 = document.getElementById("chatViewSection");
      cont2.style.display = "block";
      let cont4 = document.getElementById("chatNavbar");
      cont4.style.display = "none";
    }
  };

  const handlerSetting = () => {
    navigate("/settings");
  };
  const imageFullViewHandler = (e) => {
    setPhotoView(e.target.src);
    setPhotoDisplay(true);
  };
  const backToFriendListHandler = () => {
    let cont1 = document.getElementById("friendListSection");
    cont1.style.display = "block";
    let cont3 = document.getElementById("friendListView");
    cont3.style.display = "block";
    let cont2 = document.getElementById("chatViewSection");
    cont2.style.display = "none";
    let cont4 = document.getElementById("chatNavbar");
    cont4.style.display = "flex";
  };
  const handleKeyboardClickSearch = (e) => {
    e.code === "Enter" && handlerSearch();
  };
  return (
    <>
      <section className="homeSection">
        <section className={photoDisplay ? "displayViewSec" : "disable"}>
          <div
            className={
              android
                ? "imageDisplayCard"
                : "imageDisplayCard animate__animated animate__bounceIn"
            }
          >
            <div
              className="closeDisplayView"
              onClick={() => setPhotoDisplay(false)}
            >
              <AiOutlineClose />
            </div>
            <img src={photoView} alt="" />
          </div>
        </section>
        <div
          className={
            android
              ? "chatCard"
              : "chatCard animate__animated animate__bounceInDown"
          }
        >
          <div className="chatNavbar" id="chatNavbar">
            <div className="chatNavTitle" onClick={() => navigate("/home")}>
              Chatting App By Yash <small id="beta">(Beta Version) </small>
            </div>
            <div
              className="chatNavTitleAndroid"
              onClick={() => navigate("/home")}
            >
              Chatting App By Yash<small id="beta">(Beta Version)</small>
            </div>
            <div className="navProfileView" id="navProfileView">
              <div className="navDivider"></div>
              <div className="navProfileName">
                {userDetails.name !== null
                  ? userDetails.name.charAt(0).toUpperCase() +
                    userDetails.name.slice(1)
                  : "No Name"}
              </div>
              <div
                className="navProfileImage"
                onClick={userProfilePicClickHandler}
              >
                <img src={userDetails.photo} alt="" />
              </div>
              <button className="settingBtnIcon" onClick={handlerSetting}>
                <AiFillSetting />
              </button>
            </div>
          </div>
          <section className="mainChatSection">
            <section className="friendListSection" id="friendListSection">
              <div className="searchFriendMenu">
                <input
                  type="text"
                  className="searchFriendInput"
                  name="searchFriend"
                  onKeyDown={handleKeyboardClickSearch}
                  value={search}
                  maxLength="6"
                  placeholder="Enter Unique Code"
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="addFriendIcon" onClick={handlerSearch}>
                  <AiOutlineSearch />
                </button>
              </div>
              <span className="friendListSectionSeperator"></span>
              <div className="friendListView" id="friendListView">
                {searchStart === true && (
                  <div>
                    <p className="searchText">Search Result</p>
                    <div
                      className="resultCard"
                      onClick={addFriendToListHandler}
                    >
                      {searchFriend.photo !== "" ? (
                        <img
                          className="friendProfilePhoto"
                          src={searchFriend.photo}
                          alt=""
                        />
                      ) : (
                        <img
                          className="friendProfilePhoto"
                          src="https://firebasestorage.googleapis.com/v0/b/chatappbykrish.appspot.com/o/Assets%2Floading.png?alt=media&token=4dd6a46c-dcec-42f2-bac1-47b0b454090c"
                          alt=""
                        />
                      )}
                      <p className="friendName">{searchFriend.name}</p>
                      <span className="addResultIcon">
                        <MdGroupAdd />
                      </span>
                    </div>
                  </div>
                )}
                {Object.entries(chats)
                  ?.sort((a, b) => b[1].date - a[1].date)
                  .map((chat) => {
                    return (
                      <Friends
                        key={chat[0]}
                        chat={chat}
                        selectFriendHandler={selectFriendHandler}
                      />
                    );
                  })}
              </div>
              <div
                className="uniqueCodeView animate__animated animate__fadeInUp"
                onClick={copyUniqueCodeHandlerOur}
                id="uniqueCodeShow"
              >
                <p className="uniqueCodeLabel" title="Your Unique Code">
                  <span id="uniqueCode">
                    {"Your Unique Code : " + userDetails.uid.slice(0, 6)}
                  </span>
                  <span className="copyCodeIcon">
                    <TbCopy />
                  </span>
                </p>
              </div>
            </section>
            <span className="mainChatSectionSeperator"></span>
            {!selectedFrnd && (
              <div className="noSelectedChat">
                <ul>
                  <li className="noSelectedtitle">
                    Select Your Friend To Chat
                  </li>
                  <li className="noSelectedtitle">
                    Enter Friend's Unique Code To Add
                  </li>
                  <li className="noSelectedtitle">
                    Chats Are End To End Encrypted!
                  </li>
                  <li className="noSelectedtitle">We Respect Your Privacy!</li>
                  <li className="noSelectedtitle">For Support chat with unique code "yash"</li>
                </ul>
              </div>
            )}
            {selectedFrnd && (
              <section
                className="chatViewSection animate__animated animate__fadeIn"
                id="chatViewSection"
              >
                <div className="chatViewNavbar">
                  <div className="chatViewNavbarProfile">
                    {android && (
                      <div
                        className="backToListIcon"
                        onClick={backToFriendListHandler}
                      >
                        <IoIosArrowBack />
                      </div>
                    )}
                    <img
                      className="friendPhotoChatViewNav"
                      src={selectedFrnd.photo}
                      alt=""
                      onClick={imageFullViewHandler}
                    />
                    <p className="chatViewFrndName">
                      {android
                        ? selectedFrnd.displayName.split(" ")[0]
                        : selectedFrnd.displayName}
                    </p>
                    <p
                      title="Friend's Unique Code"
                      className="friendUniqueCode"
                      onClick={copyUniqueCodeHandlerFriend}
                    >
                      #{selectedFrnd.uid.slice(0, 6)}
                    </p>
                  </div>
                </div>
                <div
                  className="chattingSection animate__animated animate__fadeIn"
                  id="chattingSection"
                >
                  {messages &&
                    messages.messages.map((value) => {
                      if (value.senderId === userDetails.uid) {
                        return (
                          <Messages
                            key={uuid()}
                            messages={value}
                            uid={userDetails.uid}
                            imageFullViewHandler={imageFullViewHandler}
                            frndUid={selectedFrnd.uid}
                          />
                        );
                      } else {
                        return (
                          <Messages
                            key={uuid()}
                            messages={value}
                            uid={userDetails.uid}
                            imageFullViewHandler={imageFullViewHandler}
                            frndUid={selectedFrnd.uid}
                          />
                        );
                      }
                    })}
                </div>
                <SendMessage
                  userUid={userDetails.uid}
                  frndUid={selectedFrnd.uid}
                />
              </section>
            )}
          </section>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default Home;
