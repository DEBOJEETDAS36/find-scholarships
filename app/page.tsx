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


