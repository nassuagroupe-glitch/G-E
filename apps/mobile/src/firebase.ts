// Firebase initialization — configured from EXPO_PUBLIC_* env vars (Expo
// inlines these at build time) so real credentials never live in source
// control. Copy .env.example to .env.local and fill in the values from the
// same Firebase project the web app uses.
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
// tsc resolves "firebase/auth" against its browser types (no "exports"-aware
// resolution under expo/tsconfig.base's moduleResolution: "node"), which omit
// this RN-only export — but Metro does honor the package's "react-native"
// export condition and resolves it fine at bundle/runtime.
// @ts-expect-error — see above
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const db = getFirestore(firebaseApp);
