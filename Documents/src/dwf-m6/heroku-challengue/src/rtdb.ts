import firebase from "firebase";

const app = firebase.initializeApp({
    apiKey: "co85OdAXq9aPuYkJXe1LKHZk2KBXStTReXR1MyWK",
    databaseURL: "https://apx-dwf-m6-674e5-default-rtdb.firebaseio.com",
    authDomain: "apx-dwf-m6-674e5.firebaseapp.com"
});

const rtdb = firebase.database();

export { rtdb }