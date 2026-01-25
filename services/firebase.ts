import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";  // Add this for platform detection
// @ts-ignore  // Keep this if TypeScript complains about types
import { initializeAuth, getReactNativePersistence, indexedDBLocalPersistence } from "firebase/auth";  // Added indexedDBLocalPersistence for web

const firebaseConfig = {
  apiKey: "AIzaSyBlk6bNVJPeKIvNFZ0pXD6miSSiV_yMK1w",
  authDomain: "recipebox-fce1a.firebaseapp.com",
  projectId: "recipebox-fce1a",
  storageBucket: "recipebox-fce1a.firebasestorage.app",
  messagingSenderId: "492795796981",
  appId: "1:492795796981:web:2791619a335a331d8654bc",
  measurementId: "G-RVS3ZX533P"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: Platform.OS === 'web' 
    ? indexedDBLocalPersistence  // Use this for web (secure, supports offline)
    : getReactNativePersistence(AsyncStorage)  // Use this for native iOS/Android
});

export const db = getFirestore(app);