import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlU07ByXoX-qXfU3X4mnQa7e29fnpH1QE",
  authDomain: "scholarship-finder-566bc.firebaseapp.com",
  projectId: "scholarship-finder-566bc",
  storageBucket: "scholarship-finder-566bc.appspot.com",
  messagingSenderId: "730588818956",
  appId: "1:730588818956:web:9fbfd1c0aa57807ea38829",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
