// "use client";

// import { useState, useEffect } from "react";
// import { scholarships } from "@/data/scholarships";
// import Link from "next/link";

// export default function Home() {
//   const [searchTerm, setSearchTerm] = useState("");

//   const filteredScholarships = scholarships.filter((s) =>
//     s.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//   getScholarships().then(data => {
//     console.log("🔥 FIRESTORE DATA:", data);
//   });
// }, []);

//   return (
//     <main className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
//         Scholarship Finder
//       </h1>

//       {/* Search Bar */}
//       <div className="max-w-3xl mx-auto mb-6 text-blue-300">
//         <input
//           type="text"
//           placeholder="Search scholarships..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>

//       {/* Scholarship List */}
//       <div className="max-w-3xl mx-auto space-y-4">
//         {filteredScholarships.length > 0 ? (
//           filteredScholarships.map((s) => (
//             // <div
//             //   key={s.id}
//             //   className="bg-white p-4 rounded-lg shadow"
//             // >
//             //   <h2 className="text-xl text-black font-semibold">{s.name}</h2>
//             //   <p className="text-sm text-gray-600">
//             //     Category: {s.category} | State: {s.state}
//             //   </p>
//             //   <p className="text-sm text-gray-600">
//             //     Deadline: {s.deadline}
//             //   </p>
//             // </div>

//             <Link key = {s.id} href={`/scholarship/${s.id}`}>
//             <div 
//             className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
//               <h2 className="text-xl text-black font-semibold">{s.name}</h2>
//               <p className="text-sm text-gray-600">
//                 Category: {s.category} | State: {s.state}
//               </p>
//               <p className="text-sm text-gray-600">
//                 Deadline: {s.deadline}
//               </p>
//             </div>
//           </Link>
//           ))
//         ) : (
//           <p className="text-center text-gray-500">
//             No scholarships found
//           </p>
//         )}
//       </div>
//     </main>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getScholarships } from "@/lib/getScholarships";

type Scholarship = {
  id: string;
  name: string;
  category: string;
  state: string;
  deadline: string;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch data from Firestore
  useEffect(() => {
    getScholarships()
      .then((data: any) => {
        console.log("🔥 FIRESTORE DATA:", data);
        setScholarships(data as Scholarship[]);
      })
      .catch((err) => {
        console.error("❌ Firestore error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // 🔍 Search filter
  const filteredScholarships = scholarships.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Scholarship Finder
      </h1>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search scholarships..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-gray-500">Loading scholarships...</p>
      )}

      {/* Scholarship List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {!loading && filteredScholarships.length > 0 ? (
          filteredScholarships.map((s) => (
            <Link key={s.id} href={`/scholarship/${s.id}`}>
              <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                <h2 className="text-xl text-black font-semibold">{s.name}</h2>

                <div className="flex gap-2 mt-1">
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {s.category}
                  </span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {s.state}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  Deadline: {new Date(s.deadline).toDateString()}
                </p>
              </div>
            </Link>
          ))
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

