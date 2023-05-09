// firebase.js
import firebase from "firebase/app";
import "firebase/auth"; // If you plan to use Firebase authentication
import "firebase/firestore"; // If you plan to use Firestore
import "firebase/storage"; // If you plan to use Firebase storage
import "firebase/database"; // If you plan to use Firebase Realtime Database
import firebaseConfig from "./firebaseConfig";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

export default firebase;
