//firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import Constants from "expo-constants";
/*
const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID
}; */
const firebaseConfig = {
    apiKey: "AIzaSyD3cb4xXnDBcz9xMgyxJSJG4oOLiHHMNnM",
    authDomain: "sp-5-dynamic-grocery-list.firebaseapp.com",
    databaseURL: "https://sp-5-dynamic-grocery-list-default-rtdb.firebaseio.com",
    projectId: "sp-5-dynamic-grocery-list",
    storageBucket: "sp-5-dynamic-grocery-list.appspot.com",
    messagingSenderId: "364998774267",
    appId: "1:364998774267:web:5b8573eaece8485e034f5e",
    measurementId: "G-58T7VH4HJ0"
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);

