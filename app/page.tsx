"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getScholarships } from "@/lib/getScholarships";

type Scholarship = {
  id: string;
  name: string;
  category: string;
  state: string;
  deadline: any;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getScholarships()
      .then((data: any) => setScholarships(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ✅ Safe Firestore date conversion
  const getValidDate = (deadline: any): Date | null => {
    if (!deadline) return null;
    if (deadline?.toDate) return deadline.toDate();

    const d = new Date(deadline);
    return isNaN(d.getTime()) ? null : d;
  };

  // ⭐ Clean status logic (NO emojis)
  const getDeadlineInfo = (date: Date | null) => {
    if (!date) {
      return {
        text: "No deadline",
        color: "bg-gray-400",
        expired: false,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(
      (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        text: "Expired",
        color: "bg-red-500",
        expired: true,
      };
    }

    if (diffDays === 0) {
      return {
        text: "Closing today",
        color: "bg-red-400",
        expired: false,
      };
    }

    if (diffDays === 1) {
      return {
        text: "Closing tomorrow",
        color: "bg-yellow-400",
        expired: false,
      };
    }

    if (diffDays <= 14) {
      return {
        text: `${diffDays} days left`,
        color: "bg-orange-400",
        expired: false,
      };
    }

    return {
      text: `${diffDays} days left`,
      color: "bg-green-500",
      expired: false,
    };
  };

  // 🔍 Filter + Sort
  const filteredScholarships = scholarships
    .filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const da = getValidDate(a.deadline);
      const db = getValidDate(b.deadline);

      if (!da) return 1;
      if (!db) return -1;

      return da.getTime() - db.getTime();
    });

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Scholarship Finder
      </h1>

      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search scholarships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && (
        <p className="text-center text-gray-500">
          Loading scholarships...
        </p>
      )}

      <div className="max-w-3xl mx-auto space-y-4">
        {!loading && filteredScholarships.length > 0 ? (
          filteredScholarships.map((s) => {
            const date = getValidDate(s.deadline);
            const deadlineInfo = getDeadlineInfo(date);

            return (
              <Link key={s.id} href={`/scholarship/${s.id}`}>
                <div
                  className={`p-4 rounded-lg shadow transition cursor-pointer
                  ${
                    deadlineInfo.expired
                      ? "bg-gray-100 opacity-70"
                      : "bg-white hover:shadow-xl"
                  }`}
                >
                  {/* ⭐ TOP ROW */}
                  <div className="flex justify-between items-start gap-4">

                    <h2 className="text-xl font-semibold text-black">
                      {s.name}
                    </h2>

                    {/* ✅ SINGLE DOT + TEXT */}
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${deadlineInfo.color}`}
                      />

                      <span className="text-sm font-semibold text-gray-700">
                        {deadlineInfo.text}
                      </span>
                    </div>
                  </div>

                  {/* TAGS */}
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {s.category}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {s.state}
                    </span>
                  </div>

                  {/* DATE */}
                  <p className="text-xs text-gray-500 mt-2">
                    {date
                      ? date.toDateString()
                      : "Deadline not specified"}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          !loading && (
            <p className="text-center text-gray-500">
              No scholarships found
            </p>
          )
        )}
      </div>
    </main>
  );
}
