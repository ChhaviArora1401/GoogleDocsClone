// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIazgulFXpMRW2suBHp3nDp012DMwAyp8",
  authDomain: "docs-fad22.firebaseapp.com",
  projectId: "docs-fad22",
  storageBucket: "docs-fad22.appspot.com",
  messagingSenderId: "378035217549",
  appId: "1:378035217549:web:7863a5b066c4d006d5aec4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//init services
export const database = getFirestore(app);
