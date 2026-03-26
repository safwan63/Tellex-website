import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD52AmHmxJNRTKTaC90J5X-c40L3hJLUnA",
    authDomain: "tellex-bb122.firebaseapp.com",
    projectId: "tellex-bb122",
    storageBucket: "tellex-bb122.firebasestorage.app",
    messagingSenderId: "883948562667",
    appId: "1:883948562667:web:8b591bfeed1ab4362a76ae",
    measurementId: "G-XPEEDX64FY"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics can only run in the browser
export const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
