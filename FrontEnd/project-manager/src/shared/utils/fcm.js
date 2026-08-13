import { getMessaging, getToken } from "firebase/messaging";
import api from '@/api/apiClient'
import { useAuthStore } from '@/stores/authStore'
import { initializeApp } from "firebase/app";
import { getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const requestAndSaveFcmToken = async () => {
  try {
    // 0. Initialize Firebase only once
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }

    // 1. Check if browser supports notifications
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notifications.");
      return;
    }

    // 2. Check if browser supports service workers
    if (!("serviceWorker" in navigator)) {
      console.warn("This browser does not support Service Workers.");
      return;
    }

    // 3. Request permission from user
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return;
    }

    // 4. Register service worker and wait for it to be ready
    let registration;
    try {
      registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
        scope: "/"
      });
      // console.log("Service Worker registered for FCM:", registration);
      
      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
      // console.log("Service Worker is ready");
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw new Error(`Failed to register service worker: ${error.message}`);
    }

    // 5. Initialize Firebase Cloud Messaging (FCM)
    const messaging = getMessaging(app);

    // 6. Small delay to ensure service worker is fully activated
    await new Promise(resolve => setTimeout(resolve, 500));

    // 7. Get token from Firebase
    const currentToken = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!currentToken) {
      console.warn("No registration token available.");
      return;
    }

    // console.log("FCM Token obtained:", currentToken);

    // 8. Post token to backend
    await api.post(`fcm-device/`, {registration_id: currentToken, type: "web"});

    useAuthStore.getState().setFCMToken(currentToken);
  } catch (error) {
    console.error("Error setting up FCM token:", error);
  }
};