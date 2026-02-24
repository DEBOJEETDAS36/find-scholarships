"use client";

import { useEffect, useState } from "react";
import { getScholarships } from "@/lib/getScholarships";
import Link from "next/link";

type Scholarship = {
  id: string;
  name: string;
  category: string;
  state: string;
  deadline: any;
};

export default function SavedScholarships() {
  const [saved, setSaved] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        // 1️⃣ Get bookmarked IDs
        const res = await fetch("/api/get-bookmarks");
        const bookmarkIds: string[] = await res.json();

        if (!bookmarkIds.length) {
          setSaved([]);
          setLoading(false);
          return;
        }

        // 2️⃣ Fetch all scholarships from Firebase
        const allScholarships = await getScholarships() as Scholarship[];

        // 3️⃣ Filter only bookmarked ones
        const filtered = allScholarships.filter((s) =>
          bookmarkIds.includes(s.id)
        );

        setSaved(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaved();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Saved Scholarships
      </h1>

      {loading && (
        <p className="text-gray-500">Loading...</p>
      )}

      {!loading && saved.length === 0 && (
        <p className="text-gray-500">
          You haven't bookmarked any scholarships yet.
        </p>
      )}

      <div className="space-y-4">
        {saved.map((s) => (
          <Link key={s.id} href={`/scholarship/${s.id}`}>
            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <h2 className="text-lg font-semibold text-black">
                {s.name}
              </h2>

              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {s.category}
                </span>

                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  {s.state}
                </span>
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {s.deadline?.toDate
                  ? s.deadline.toDate().toDateString()
                  : "Deadline not specified"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
