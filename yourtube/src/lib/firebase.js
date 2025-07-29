// firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzrUfi7AN_xU8nRe3tPOC0aV4tw-evMJA",
  authDomain: "yourtube-aede5.firebaseapp.com",
  projectId: "yourtube-aede5",
  storageBucket: "yourtube-aede5.appspot.com", // ✅ Corrected typo here!
  messagingSenderId: "210987017759",
  appId: "1:210987017759:web:48c6761fd43c536daa572a",
};

// ✅ Prevent re-initializing Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
