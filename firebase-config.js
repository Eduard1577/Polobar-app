// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBAMq1ZT8_xB3in2fRwNw4rJzAB_z0mcrw",
  authDomain: "polobar-bfe39.firebaseapp.com",
  projectId: "polobar-bfe39",
  storageBucket: "polobar-bfe39.appspot.com",
  messagingSenderId: "778965477741",
  appId: "1:778965477741:web:c6984ca8f79f1d10851264",
  measurementId: "G-FLE09W55WR"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
