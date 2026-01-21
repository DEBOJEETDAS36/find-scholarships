// import { scholarships } from "@/data/scholarships";
// import Link from "next/link";
// import { notFound } from "next/navigation";

// // Define the type for Next.js 15 dynamic params
// type PageProps = {
//   params: Promise<{ id: string }>;
// };

// export default async function ScholarshipDetails({ params }: PageProps) {
//   // 1. You MUST await params in Next.js 15
//   const { id } = await params;

//   // 2. Find the scholarship using the ID from the URL
//   const scholarship = scholarships.find((s) => s.id === id);

//   // 3. Trigger 404 if not found
//   if (!scholarship) {
//     notFound();
//   }

//   return (
//     <main className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-3xl mx-auto">
//         {/* Back Button */}
//         <Link 
//           href="/" 
//           className="text-blue-600 hover:underline mb-6 inline-block"
//         >
//           ← Back to Search
//         </Link>

//         <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
//           <h1 className="text-3xl font-bold text-gray-900 mb-6">
//             {scholarship.name}
//           </h1>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//             <div className="space-y-4">
//               <p><span className="font-semibold text-gray-700">Category:</span> {scholarship.category}</p>
//               <p><span className="font-semibold text-gray-700">State:</span> {scholarship.state}</p>
//             </div>
//             <div className="space-y-4">
//               <p><span className="font-semibold text-gray-700">Education:</span> {scholarship.education}</p>
//               <p><span className="font-semibold text-gray-700">Deadline:</span> {scholarship.deadline}</p>
//             </div>
//           </div>

//           <a
//             href={scholarship.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="block text-center bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
//           >
//             Apply on Official Website
//           </a>
//         </div>
//       </div>
//     </main>
//   );
// }


import Link from "next/link";
import { notFound } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ScholarshipDetails({ params }: PageProps) {
  // ✅ Next.js 15: params MUST be awaited
  const { id } = await params;

  const docRef = doc(db, "scholarships", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const scholarship = docSnap.data();

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-6 inline-block"
        >
          ← Back to Search
        </Link>

        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {scholarship.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <p>
                <span className="font-semibold text-gray-700">Category:</span>{" "}
                {scholarship.category}
              </p>
              <p>
                <span className="font-semibold text-gray-700">State:</span>{" "}
                {scholarship.state}
              </p>
            </div>
            <div className="space-y-4">
              <p>
                <span className="font-semibold text-gray-700">Education:</span>{" "}
                {scholarship.education}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Deadline:</span>{" "}
                {new Date(
                  scholarship.deadline.seconds * 1000
                ).toDateString()}
              </p>
            </div>
          </div>

          {scholarship.link && (
            <a
              href={scholarship.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
            >
              Apply on Official Website
            </a>
          )}
        </div>
      </div>
    </main>
  );
}

