import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyC6tokLrAP24fxkWhnmQ1bscsFJteFSv80",
    authDomain: "phongtrosinhvien-95275.firebaseapp.com",
    projectId: "phongtrosinhvien-95275",
    storageBucket: "phongtrosinhvien-95275.appspot.com",
    messagingSenderId: "109327096463",
    appId: "1:109327096463:web:7fbc06567e2356d73a6efa"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);