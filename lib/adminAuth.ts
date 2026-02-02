import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function requireAdmin(
  onSuccess: () => void,
  onFail: () => void
) {
  return onAuthStateChanged(auth, (user) => {
    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      onFail();
    } else {
      onSuccess();
    }
  });
}
