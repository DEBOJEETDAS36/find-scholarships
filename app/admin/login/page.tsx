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
      const res = await signInWithEmailAndPassword(auth, email, password);

      // HARD ADMIN CHECK (IMPORTANT)
      if (res.user.email !== "admin@example.com") {
        throw new Error("Not authorized");
      }

      router.push("/admin");
    } catch (err: any) {
      setError("Invalid credentials or not authorized");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow w-full max-w-md space-y-5"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded">{error}</p>
        )}

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
