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

  // 🔐 Safe date converter
  const getValidDate = (deadline: any): Date | null => {
    if (!deadline) return null;
    if (deadline?.toDate) return deadline.toDate();
    const d = new Date(deadline);
    return isNaN(d.getTime()) ? null : d;
  };

  // 🟢🟡🔴 Deadline status
  const getStatus = (date: Date | null) => {
    if (!date) {
      return { color: "bg-gray-400", label: "No deadline" };
    }

    const today = new Date();
    const diffDays = Math.ceil(
      (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return { color: "bg-red-500", label: "Expired" };
    }

    if (diffDays <= 30) {
      return { color: "bg-yellow-400", label: "Closing soon" };
    }

    return { color: "bg-green-500", label: "Open" };
  };

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
        <p className="text-center text-gray-500">Loading scholarships...</p>
      )}

      <div className="max-w-3xl mx-auto space-y-4">
        {!loading && filteredScholarships.length > 0 ? (
          filteredScholarships.map((s) => {
            const date = getValidDate(s.deadline);
            const status = getStatus(date);

            return (
              <Link key={s.id} href={`/scholarship/${s.id}`}>
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                  <h2 className="text-xl font-semibold text-black">
                    {s.name}
                  </h2>

                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {s.category}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {s.state}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                    <span
                      className={`w-3 h-3 rounded-full ${status.color}`}
                      title={status.label}
                    />
                    <span>
                      {date ? date.toDateString() : "Deadline not specified"}
                    </span>
                  </div>
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
