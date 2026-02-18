"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Overview() {
  const { data: session } = useSession();
  const [bookmarkCount, setBookmarkCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await fetch("/api/get-bookmarks");
        const scholarships = await res.json();

        // Count number of scholarship documents returned
        setBookmarkCount(scholarships.length);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchBookmarks();
    }
  }, [session]);

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold text-black">
        Welcome, {session?.user?.name}
      </h1>

      <div className="grid grid-cols-3 gap-6">

        {/* Saved Scholarships */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-black">
            Saved Scholarships
          </h3>

          <p className="text-2xl mt-2 font-bold text-black">
            {loading ? "--" : bookmarkCount}
          </p>
        </div>

        {/* AI Matches */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-black">
            AI Matches
          </h3>

          <p className="text-2xl mt-2 font-bold text-black">
            --
          </p>
        </div>

        {/* Applications */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-black">
            Applications
          </h3>

          <p className="text-2xl mt-2 font-bold text-black">
            --
          </p>
        </div>

      </div>

    </div>
  );
}
