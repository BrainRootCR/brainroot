// Configuración Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

const firebaseConfig = {
   apiKey: "AIzaSyDRVyUoL67VArRnvWU4RgcwnHfr3GiiXfU",
  authDomain: "brainroot-c2adb.firebaseapp.com",
  projectId: "brainroot-c2adb",
  storageBucket: "brainroot-c2adb.firebasestorage.app",
  messagingSenderId: "110853360073",
  appId: "1:110853360073:web:6d4d76d5f0ad33fb628018"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
