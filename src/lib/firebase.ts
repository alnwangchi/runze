import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

export type FirebaseClient = {
  app: FirebaseApp;
  db: Firestore;
  storage: FirebaseStorage;
};

function readConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
}

export function isFirebaseConfigured() {
  const config = readConfig();
  return Boolean(config.apiKey && config.projectId && config.storageBucket && config.appId);
}

export function getFirebase(): FirebaseClient | null {
  if (!isFirebaseConfigured()) return null;
  const config = readConfig();
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  return {
    app,
    db: getFirestore(app),
    storage: getStorage(app),
  };
}
