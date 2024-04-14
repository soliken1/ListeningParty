import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8s5VgKTksUB9gZ0kQZ17q6lVu162FuOI",
  authDomain: "listening-party-420313.firebaseapp.com",
  projectId: "listening-party-420313",
  storageBucket: "listening-party-420313.appspot.com",
  messagingSenderId: "951502328345",
  appId: "1:951502328345:web:21fd7736687f4d128d5088",
  measurementId: "G-W0HZS36YFZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
