// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzrUfi7AN_xU8nRe3tPOC0aV4tw-evMJA",
  authDomain: "yourtube-aede5.firebaseapp.com",
  projectId: "yourtube-aede5",
  storageBucket: "yourtube-aede5.appspot.com",
  messagingSenderId: "210987017759",
  appId: "1:210987017759:web:e56843603b121ef3aa572a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig) ;
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
