import { initializeApp } from "firebase/app";
import {getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCuREe6xZzQfPV0pF4st8LQSzwbX_vnlZU",
  authDomain: "react-prj-65462.firebaseapp.com",
  projectId: "react-prj-65462",
  storageBucket: "react-prj-65462.firebasestorage.app",
  messagingSenderId: "1035269465530",
  appId: "1:1035269465530:web:14940e9f883ad058cc6983",
  databaseURL: "https://react-prj-65462-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);     // ← Add this line

const db = getFirestore(app);
const storage = getStorage(app);
export { app,auth,db,storage};