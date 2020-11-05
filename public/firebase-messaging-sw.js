// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.0.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyB7e5Tpyt93PR7QHMWFyNqnpyyrV4txuKU",
    authDomain: "cinder-fd4b1.firebaseapp.com",
    databaseURL: "https://cinder-fd4b1.firebaseio.com",
    projectId: "cinder-fd4b1",
    storageBucket: "cinder-fd4b1.appspot.com",
    messagingSenderId: "274779676456",
    appId: "1:274779676456:web:00e63788068d767440ba1d",
    measurementId: "G-SDB5Z25SP0"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();