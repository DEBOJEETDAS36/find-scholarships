"use client";

import { useSession } from "next-auth/react";

export default function Overview() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">
        Welcome, {session?.user?.name}
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Saved Scholarships</h3>
          <p className="text-2xl mt-2 font-bold">--</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">AI Matches</h3>
          <p className="text-2xl mt-2 font-bold">--</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold">Applications</h3>
          <p className="text-2xl mt-2 font-bold">--</p>
        </div>

      </div>

    </div>
  );
}
