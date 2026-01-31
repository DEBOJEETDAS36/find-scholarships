// "use client";

// import { useState } from "react";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase";
// import { useRouter } from "next/navigation";

// export default function AdminLogin() {
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   async function handleLogin(e: React.FormEvent) {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const res = await signInWithEmailAndPassword(auth, email, password);

//       // HARD ADMIN CHECK (IMPORTANT)
//       if (res.user.email !== "admin@example.com") {
//         throw new Error("Not authorized");
//       }

//       router.push("/admin");
//     } catch (err: any) {
//         console.error("🔥 FIREBASE AUTH ERROR:", err);
//         setError(err.code || err.message);
//     }


//     setLoading(false);
//   }

//   return (
//     <main className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleLogin}
//         className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-5"
//       >
//         <h1 className="text-2xl font-bold text-center text-blue-600">
//           Admin Login
//         </h1>

//         {error && (
//           <p className="text-red-600 bg-red-50 p-3 rounded">{error}</p>
//         )}

//         <input
//           type="email"
//           placeholder="Admin Email"
//           // Added text-black here
//           className="w-full p-3 border rounded text-black"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           // Added text-black here
//           className="w-full p-3 border rounded text-black"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button
//           disabled={loading}
//           className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </main>
//   );
// }

"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "yourgmail@gmail.com"; // 👈 CHANGE THIS

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleGoogleLogin() {
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const email = result.user.email;

      if (email !== ADMIN_EMAIL) {
        await auth.signOut();
        setError("Unauthorized admin account");
        return;
      }

      router.push("/admin");
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message || "Login failed");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}

