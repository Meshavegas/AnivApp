// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAchco0weddOnvhQLPc_4rAfVPUxnNIaJA",
  authDomain: "maniv-a665b.firebaseapp.com",
  projectId: "maniv-a665b",
  storageBucket: "maniv-a665b.appspot.com",
  messagingSenderId: "833975597243",
  appId: "1:833975597243:web:a929faf6ba426278f7d19e",
  measurementId: "G-WTGKDNSFN9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
