"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  Timestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
// AUTH IMPORTS - COMMENTED OUT FOR DIRECT ACCESS
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

type CsvRow = {
  name: string;
  category: string;
  state: string;
  education: string;
  incomeLimit: string;
  provider: string;
  link: string;
  deadline: string;
};

export default function BulkUploadPage() {
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔐 AUTH PROTECTION - COMMENTED OUT FOR DIRECT ACCESS
  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     if (!user || user.email !== "admin@example.com") {
  //       router.push("/admin/login");
  //     }
  //   });
  //   return () => unsub();
  // }, [router]);

  async function handleUpload() {
    if (!file) {
      alert("Please select a CSV file");
      return;
    }

    setUploading(true);
    setMessage("");

    interface PapaParseError {
      code: string;
      message: string;
      row: number;
    }

    interface PapaParseMeta {
      delimiter: string;
      linebreak: string;
      aborted: boolean;
      truncated: boolean;
      cursor: number;
      fields?: string[];
    }

    interface PapaParseResult<T> {
      data: T[];
      errors: PapaParseError[];
      meta: PapaParseMeta;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: PapaParseResult<CsvRow>) => {
        try {
          let added = 0;
          let skipped = 0;

          for (const row of results.data) {
            // ✅ Basic validation
            if (
              !row.name ||
              !row.category ||
              !row.state ||
              !row.education ||
              !row.provider ||
              !row.link ||
              !row.deadline
            ) {
              skipped++;
              continue;
            }

            // ✅ Strong normalization (prevents sneaky duplicates)
            const normalizedName = row.name
              .trim()
              .toLowerCase()
              .replace(/\s+/g, "-");

            const scholarshipRef = doc(
              db,
              "scholarships",
              normalizedName
            );

            // ✅ HARD DUPLICATE CHECK
            const existingDoc = await getDoc(scholarshipRef);

            if (existingDoc.exists()) {
              skipped++;
              continue; // 🔥 DO NOT overwrite
            }

            // Safe date parsing
            const parsedDate = new Date(row.deadline);

            if (isNaN(parsedDate.getTime())) {
              skipped++;
              continue;
            }

            await setDoc(scholarshipRef, {
              name: row.name.trim(),
              category: row.category.trim(),
              state: row.state.trim(),
              education: row.education.trim(),
              incomeLimit: row.incomeLimit?.trim() || "",
              provider: row.provider.trim(),
              link: row.link.trim(),
              deadline: Timestamp.fromDate(parsedDate),
              createdAt: Timestamp.now(),
              lastVerified: Timestamp.now(),
              source: "CSV",
            });

            added++;
          }

          setMessage(
            `✅ Upload complete.\nAdded: ${added}\nSkipped (duplicates/invalid): ${skipped}`
          );
        } catch (err) {
          console.error(err);
          setMessage("❌ Upload failed. Check console.");
        } finally {
          setUploading(false);
        }
      },
      error: (err: PapaParseError) => {
        console.error(err);
        setMessage("❌ CSV parsing error");
        setUploading(false);
      },
    });
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-blue-600">
            Bulk Scholarship Upload (CSV)
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/admin')}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
            >
              Add Single
            </button>
            <button
              onClick={() => router.push('/admin/manage')}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
            >
              Manage
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Upload a CSV file containing scholarship data.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
        >
          {uploading ? "Uploading..." : "Upload CSV"}
        </button>

        {message && (
          <div className="mt-4 p-3 bg-gray-50 border rounded text-sm whitespace-pre-line">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
