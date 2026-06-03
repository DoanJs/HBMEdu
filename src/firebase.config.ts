import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// config for hoabanmaiedu-mobile
const firebaseConfig = {
  apiKey: "AIzaSyBneelps2P-qPFG5h3VSPYTwJRtx0u4n80",
  authDomain: "hoabanmaiedu-mobile.firebaseapp.com",
  projectId: "hoabanmaiedu-mobile",
  storageBucket: "hoabanmaiedu-mobile.firebasestorage.app",
  messagingSenderId: "465303174037",
  appId: "1:465303174037:web:c9ab7e49f2105a5a86149c",
  measurementId: "G-P113B6FJ95"
};

// setLogLevel("debug");
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const functions = getFunctions(app, "asia-southeast1");
// const analytics = getAnalytics(app);
export { auth, db, functions };
