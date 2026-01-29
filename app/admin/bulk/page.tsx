"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";
import {
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";

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

  // 🔐 Admin protection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "admin@example.com") {
        router.push("/admin/login");
      }
    });
    return () => unsub();
  }, [router]);

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
                for (const row of results.data) {
                    // Basic validation
                    if (
                        !row.name ||
                        !row.category ||
                        !row.state ||
                        !row.education ||
                        !row.provider ||
                        !row.link ||
                        !row.deadline
                    ) {
                        continue;
                    }

                    await addDoc(collection(db, "scholarships"), {
                        name: row.name,
                        category: row.category,
                        state: row.state,
                        education: row.education,
                        incomeLimit: row.incomeLimit || "",
                        provider: row.provider,
                        link: row.link,
                        deadline: Timestamp.fromDate(new Date(row.deadline)),
                        createdAt: Timestamp.now(),
                        lastVerified: Timestamp.now(),
                        source: "CSV",
                    });
                }

                setMessage("✅ Scholarships uploaded successfully!");
            } catch (err: unknown) {
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
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Bulk Scholarship Upload (CSV)
        </h1>

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
          <div className="mt-4 p-3 bg-gray-50 border rounded text-sm">
            {message}
          </div>
        )}
      </div>
    </main>
  );
}
