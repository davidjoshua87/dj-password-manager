import * as firebase from "firebase";

// Initialize Firebase
const config = {
  apiKey: "AIzaSyD0MdFa9n9cgIDdeEpe3gU4adfeuMY4WZ8",
  authDomain: "password-manager-95e36.firebaseapp.com",
  databaseURL: "https://password-manager-95e36.firebaseio.com",
  projectId: "password-manager-95e36",
  storageBucket: "password-manager-95e36.appspot.com",
  messagingSenderId: "103885407427",
  appId: "1:103885407427:web:2a8ed0601680a2f2bf8e76"
};
firebase.initializeApp(config);

const databaseRef = firebase.database().ref();
const usersRef = databaseRef.child("users");
const pwdRef = databaseRef.child("passwords");
export {usersRef, pwdRef};

 