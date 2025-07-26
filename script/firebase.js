  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCeE9w53Xe3dJEUDqC5zUVE91mGfZLPwLc",
    authDomain: "namaz-tracking-app-22164.firebaseapp.com",
    projectId: "namaz-tracking-app-22164",
    storageBucket: "namaz-tracking-app-22164.firebasestorage.app",
    messagingSenderId: "709496611341",
    appId: "1:709496611341:web:8046fbec0d4eeee4726b44"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const db = getFirestore(app);

  const auth = getAuth();

  export{
    app, db, collection, addDoc, setDoc, doc, getDoc, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword
  }