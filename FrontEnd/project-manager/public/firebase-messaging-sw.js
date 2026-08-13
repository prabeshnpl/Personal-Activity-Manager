// public/firebase-messaging-sw.js

// 1. Import Firebase scripts for Service Workers from CDN
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

// 2. Initialize Firebase inside the Service Worker
// For service workers, embed the config during build or fetch from API
firebase.initializeApp({
  apiKey: self.firebaseConfig?.apiKey || "AIzaSyC3LkWhi_QD3rc16Hv0gIFSZ1IJQYnqulk",
  authDomain: self.firebaseConfig?.authDomain || "organization-manager-32d43.firebaseapp.com",
  projectId: self.firebaseConfig?.projectId || "organization-manager-32d43",
  storageBucket: self.firebaseConfig?.storageBucket || "organization-manager-32d43.firebasestorage.app",
  messagingSenderId: self.firebaseConfig?.messagingSenderId || "769433819228",
  appId: self.firebaseConfig?.appId || "1:769433819228:web:5a752540e1b540a23cae99",
});

// 3. Initialize Firebase Messaging
const messaging = firebase.messaging();

// 4. Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message:", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico", // Path to your app's icon in public/
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});