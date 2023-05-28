import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdLr7pPFxOuTS8n4n8ETX-4e8qi4JuCHc",
  authDomain: "flashback-31ad2.firebaseapp.com",
  databaseURL:
    "https://flashback-31ad2-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "flashback-31ad2",
  storageBucket: "flashback-31ad2.appspot.com",
  messagingSenderId: "997571286424",
  appId: "1:997571286424:web:d60b30e5a9a52e78eb07ed",
  measurementId: "G-ZD85XQ2YD6",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const database = getDatabase();
const storage = getStorage();

export { database, firebase, storage };
