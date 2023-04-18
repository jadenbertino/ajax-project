import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDzZh2XqlBhvnLrCpFY8BQ9PCS8g4JWCFk",
  authDomain: "robo-rizz.firebaseapp.com",
  projectId: "robo-rizz",
  storageBucket: "robo-rizz.appspot.com",
  messagingSenderId: "284406233671",
  appId: "1:284406233671:web:d77f281f731f715a594f62"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);