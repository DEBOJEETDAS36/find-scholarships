import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "scholarship-finder-566bc.firebaseapp.com",
  projectId: "scholarship-finder-566bc",
  storageBucket: "scholarship-finder-566bc.appspot.com",
  messagingSenderId: "730588818956",
  appId: "1:730588818956:web:9fbfd1c0aa57807ea38829",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
