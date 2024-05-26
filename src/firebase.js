import { initializeApp } from 'firebase/app'; // Import initializeApp
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';


const firebaseConfig = {
  apiKey: "AIzaSyBEJ2c9AhPAviEKKZItTlKoJkPP7JvYPvg",
  authDomain: "ecommerce-app-f743c.firebaseapp.com",
  projectId: "ecommerce-app-f743c",
  storageBucket: "ecommerce-app-f743c.appspot.com",
  messagingSenderId: "344731972605",
  appId: "1:344731972605:android:5ee670305337ddffa59f94"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

