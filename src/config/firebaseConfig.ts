// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnh5kHLhuDjeSi6DjXxTvNK3Sdd1GamtU",
  authDomain: "react-native-ec5ec.firebaseapp.com",
  projectId: "react-native-ec5ec",
  storageBucket: "react-native-ec5ec.firebasestorage.app",
  messagingSenderId: "908217469412",
  appId: "1:908217469412:web:9e409830186514503a5ff1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export { app };