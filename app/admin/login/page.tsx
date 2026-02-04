"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

try {
  const cred = await signInWithEmailAndPassword(auth, email, password);

  if (cred.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    await auth.signOut();
    throw new Error("Unauthorized admin");
  }

  router.replace("/admin");
} catch (err: any) {
  console.group("🔥 FIREBASE LOGIN ERROR");
  console.error("Code:", err.code);
  console.error("Message:", err.message);
  console.error("Full error:", err);
  console.groupEnd();
  console.error("FIREBASE AUTH ERROR:", err.code, err.message);
  setError(err.code || "Login failed");
}


    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded text-black" // Added text-black here
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded text-black" // Added text-black here
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
