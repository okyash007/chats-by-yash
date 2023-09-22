/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../backend/firebaseConfig";
import { useNavigate } from "react-router-dom";
// import "../Styles/UserInfo.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { AiOutlineClose } from "react-icons/ai";
const UserInfo = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState(
    "https://firebasestorage.googleapis.com/v0/b/chatappbykrish.appspot.com/o/Assets%2Fno%20profile.png?alt=media&token=93d37c13-7c77-4aa2-b5e1-c372b9e4fc34"
  );
  const [email, setEmail] = useState("Loading..");
  const [UID, setUID] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [changeNameCount, setChangeNameCount] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("change") === false) {
      setChangeNameCount(false);
    } else {
      setChangeNameCount(true);
    }
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/");
      } else {
        await setDoc(doc(db, "users", user.uid), {
          username: user.displayName,
          photo: user.photoURL,
          email: user.email,
          UID: user.uid,
          uniqueCode: user.uid.slice(0, 6),
        });
        const res = await getDoc(doc(db, "userChats", user.uid));
        if (!res.exists()) await setDoc(doc(db, "userChats", user.uid), {});
        setEmail(user.email);
        setUsername(user.displayName);
        setUID(user.uid);
        setProfile(user.photoURL);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const uploadFile = () => {
      const storageRef = ref(storage, `User Profile Photos/${UID}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      toast.info("Uploading Your Profile!", {
        position: "bottom-right",
        hideProgressBar: false,
        progress: undefined,
        theme: "dark",
      });
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
            setProfile(downloadURL);
          });
          toast.success("Profile Photo Uploaded!", {
            position: "bottom-right",
            hideProgressBar: true,
            progress: undefined,
            theme: "dark",
          });
          updateProfileClickHandler("photo");
        }
      );
    };
    file && uploadFile();
  }, [file]);

  const closeButton = () => {
    navigate("/home");
  };
  const updateProfileClickHandler = async (type) => {
    sessionStorage.setItem("change", false);
    await setDoc(doc(db, "users", UID), {
      username,
      photo: profile,
      email,
      UID,
      uniqueCode: UID.slice(0, 6),
    });
    updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: profile,
    })
      .then(() => {
        if (type !== "photo") {
          toast.success("Profile Uploaded!", {
            position: "bottom-right",
            hideProgressBar: true,
            progress: undefined,
            theme: "dark",
          });
        }
      })
      .catch(() => {
        toast.warn("Try Again Later!", {
          position: "bottom-right",
          hideProgressBar: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };
  const setUsernameHandler = (e) => {
    setUsername(e.target.value);
  };
  return (
    <>
      <section className="userInformation bg-[#333333] h-screen flex justify-center items-center">
        <div className="infoCard flex flex-col relative items-center p-7">
          <button
            id="exitInfoMenu"
            className="absolute right-0 top-0 p-2 rounded-full bg-[#444444]"
            onClick={closeButton}
          >
            <AiOutlineClose />
          </button>
          
          <div className="informationSection flex">
            <div className="imageSection rounded pr-9">
              <div className=" flex flex-col justify-center items-center">
                <img
                  className="userProfile rounded-full w-28"
                  src={
                    profile === null || profile === ""
                      ? "https://firebasestorage.googleapis.com/v0/b/chatappbykrish.appspot.com/o/Assets%2Fno%20profile.png?alt=media&token=93d37c13-7c77-4aa2-b5e1-c372b9e4fc34"
                      : profile
                  }
                  alt="No Profile"
                />
                <small
                  className={
                    uploadStatus !== "" ? "uploadPhotoStatus" : "disable"
                  }
                >
                  Upload Status: {uploadStatus + "%"}
                </small>
                <label
                  htmlFor="uploadProfile"
                  className="uploadPhoto text-white p-2 px-5 rounded-full mt-1 text-sm cursor-pointer hover:underline bg-[#424242]"
                >
                  Upload Photo
                </label>
              </div>

              <input
                className="disable"
                type="file"
                name="uploadProfile"
                id="uploadProfile"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>
            <div className="informationEditSection">
              <div className="inputWrapperUser">
                {changeNameCount ? (
                  <>
                    <div class="input-container mb-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        className="input-field text-white text-2xl"
                        value={username}
                        onChange={setUsernameHandler}
                      />
                      <span className="input-highlight"></span>
                    </div>
                  </>
                ) : (
                  <p className="username" title="Display Name (Disabled)">
                    {username}
                  </p>
                )}
              </div>
              <div
                className="inputWrapperUser"
                title="Email Address (Disabled)"
              >
                <p className="emailAddress text-white pl-[10px] text-xl">{email}</p>
              </div>
              <div className="buttonsArea">
                <button
                  className="saveChangesBtn m-3 text-white p-2 px-4 rounded-full bg-[#424242] hover:underline text-sm"
                  onClick={updateProfileClickHandler}
                >
                  Save Changes
                </button>
              </div>
              <div className="alertMessage ml-3 text-white text-xs">
                Always Save Changes After Profile Photo Update.<br/>Name Can Be
                Changed Only Once.
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default UserInfo;
