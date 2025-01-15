// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebaseConfig";

import 'firebase/auth';
import { getFirestore } from "firebase/firestore";


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export function getCreatedApp() {
    return app;
}

export function getCreatedDb() {
    return db;
}