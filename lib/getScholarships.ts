import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export async function getScholarships() {
  const snapshot = await getDocs(collection(db, "scholarships"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}
