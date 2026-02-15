"use client";

import { useEffect, useState } from "react";

export default function SavedScholarships() {
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/get-bookmarks")
      .then(res => res.json())
      .then(data => setSaved(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Saved Scholarships
      </h1>

      {saved.length === 0 ? (
        <p>No saved scholarships yet.</p>
      ) : (
        <div className="space-y-4">
          {saved.map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow">
              {s.scholarshipId}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
