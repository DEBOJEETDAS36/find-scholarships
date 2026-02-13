"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Not logged in
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl text-black font-bold mb-4">
          Welcome, {session.user?.name || session.user?.email}
        </h1>

        <button
          onClick={() => signOut({callbackUrl: "/login"})}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
