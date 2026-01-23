// services/firebase.ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth" // getAuth පමණක් භාවිතා කරන්න

const firebaseConfig = {
  apiKey: "AIzaSyBlk6bNVJPeKIvNFZ0pXD6miSSiV_yMK1w",
  authDomain: "recipebox-fce1a.firebaseapp.com",
  projectId: "recipebox-fce1a",
  storageBucket: "recipebox-fce1a.firebasestorage.app",
  messagingSenderId: "492795796981",
  appId: "1:492795796981:web:2791619a335a331d8654bc",
  measurementId: "G-RVS3ZX533P"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app) // සරල getAuth
export const db = getFirestore(app)