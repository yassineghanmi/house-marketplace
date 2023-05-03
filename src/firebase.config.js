import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBshuiAd7VYOv_7j65mkriuN0OmvVNEzDg",
  authDomain: "house-marketplace-app-f193f.firebaseapp.com",
  projectId: "house-marketplace-app-f193f",
  storageBucket: "house-marketplace-app-f193f.appspot.com",
  messagingSenderId: "299648670412",
  appId: "1:299648670412:web:cb5574fa88b5f4f2e68069",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
