import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC98xaAkPZR-0YNME-vg3DncBSTtPCHXVc",
  authDomain: "elite-advisor-tools.firebaseapp.com",
  projectId: "elite-advisor-tools",
  storageBucket: "elite-advisor-tools.appspot.com",
  messagingSenderId: "483063045766",
  appId: "1:483063045766:web:f98a09466990ea5dd6fb07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };