// google auth from firebase

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrm6nPZ6PVbt9uzDgJhSBVO0h5x5iBZhk",
  authDomain: "giftgiver-b88d3.firebaseapp.com",
  projectId: "giftgiver-b88d3",
  storageBucket: "giftgiver-b88d3.firebasestorage.app",
  messagingSenderId: "655312984380",
  appId: "1:655312984380:web:8367c3cc2aa4ee247fa639",
  measurementId: "G-J2WKH2RBR0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);