"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ⭐ SIGNUP FLOW
      if (isSignup) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
            name,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }
      }

      // ⭐ LOGIN FLOW
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Invalid credentials");
      }

      router.push("/dashboard");

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        {/* Logo / Title */}
        <h1 className="text-3xl font-bold text-center text-blue-600">
          Scholarship Finder
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-6">
          {isSignup
            ? "Create your student account"
            : "Welcome back, student"}
        </p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleAuth} className="space-y-4">

          {isSignup && (
            <input
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading
              ? "Please wait..."
              : isSignup
              ? "Create Account"
              : "Login"}
          </button>
        </form>

        {/* TOGGLE */}
        <p className="text-center text-sm mt-6">
          {isSignup
            ? "Already have an account?"
            : "New student?"}

          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
            className="ml-2 text-blue-600 font-semibold hover:underline"
          >
            {isSignup ? "Login" : "Create one"}
          </button>
        </p>

      </div>
    </main>
  );
}