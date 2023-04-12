// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzZh2XqlBhvnLrCpFY8BQ9PCS8g4JWCFk",
  authDomain: "robo-rizz.firebaseapp.com",
  projectId: "robo-rizz",
  storageBucket: "robo-rizz.appspot.com",
  messagingSenderId: "284406233671",
  appId: "1:284406233671:web:d77f281f731f715a594f62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)