import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDrvX7n7g3ycb6mk3sMUHMo3HZtADlxeqs",
  authDomain: "univibe-3d790.firebaseapp.com",
  projectId: "univibe-3d790",
  storageBucket: "univibe-3d790.appspot.com",
  messagingSenderId: "1064028979551",
  appId: "1:1064028979551:web:30b46bd756db245ccbb6ea",
  measurementId: "G-5EE3JBJ5N1"
};

const app = initializeApp(firebaseConfig);

// ✅ Persistent login setup
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
