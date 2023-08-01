import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSfJFo-tlHyD61EGkjo_H_-EsL1FPWsUs",

  authDomain: "chats-by-yash.firebaseapp.com",

  projectId: "chats-by-yash",

  storageBucket: "chats-by-yash.appspot.com",

  messagingSenderId: "549488740275",

  appId: "1:549488740275:web:49a0670121eff88c6e2dc6"

};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
