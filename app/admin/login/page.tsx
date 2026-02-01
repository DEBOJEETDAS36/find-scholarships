"use client";

import { signIn } from "next-auth/react";

export default function AdminLogin() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          Admin Login
        </h1>

        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 text-white px-6 py-3 rounded font-bold hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
