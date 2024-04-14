import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfEzxeGnIJbts4FHFmrvfptwm4A9viJ5I",
  authDomain: "listening-party-24129.firebaseapp.com",
  projectId: "listening-party-24129",
  storageBucket: "listening-party-24129.appspot.com",
  messagingSenderId: "421254522575",
  appId: "1:421254522575:web:7d707cac8fa70c4cb3b9ba",
  measurementId: "G-94JS4EHR2H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
