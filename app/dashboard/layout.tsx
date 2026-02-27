"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">

        <h2 className="text-2xl font-bold text-blue-600">
          Dashboard
        </h2>

        <nav className="flex flex-col gap-4 text-gray-700">

          <Link href="/dashboard" className="hover:text-blue-600">
            Overview
          </Link>

          <Link href="/dashboard/saved" className="hover:text-blue-600">
            Saved Scholarships
          </Link>

          <Link href="/dashboard/ai" className="hover:text-blue-600">
            AI Matches
          </Link>

          <Link href="/dashboard/tracking" className="hover:text-blue-600">
            Application Tracking
          </Link>

        </nav>

        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="mt-6 w-full px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all active:scale-[0.98]"
          >
            Sign Out
          </button>

      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}
