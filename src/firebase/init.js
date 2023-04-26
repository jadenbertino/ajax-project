import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDDyFpcj2L_BtFrqNTP-_fFv3NnhKT4STs",
  authDomain: "dates-on-demand.firebaseapp.com",
  projectId: "dates-on-demand",
  storageBucket: "dates-on-demand.appspot.com",
  messagingSenderId: "839932759957",
  appId: "1:839932759957:web:3d23cf246ce6cfec3b709c"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);