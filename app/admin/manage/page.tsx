"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";

type Scholarship = {
  id: string;
  name: string;
  category: string;
  state: string;
  education: string;
  incomeLimit: string;
  provider: string;
  link: string;
  deadline: any;
};

export default function ManageScholarships() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [data, setData] = useState<Scholarship[]>([]);
  const [editing, setEditing] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔐 Admin Protection
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== "admin@example.com") {
        router.push("/admin/login");
      } else {
        setCheckingAuth(false);
      }
    });
    return () => unsub();
  }, [router]);

  // 📥 Fetch scholarships
  useEffect(() => {
    async function fetchData() {
      const snap = await getDocs(collection(db, "scholarships"));
      setData(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Scholarship, "id">),
        }))
      );
    }
    fetchData();
  }, []);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  // 🗑️ DELETE
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;
    await deleteDoc(doc(db, "scholarships", id));
    setData(data.filter((s) => s.id !== id));
  }

  // ✏️ UPDATE
  async function handleUpdate() {
    if (!editing) return;

    setLoading(true);
    await updateDoc(doc(db, "scholarships", editing.id), {
      ...editing,
      deadline: Timestamp.fromDate(new Date(editing.deadline)),
      lastVerified: Timestamp.now(),
    });

    setData(data.map((s) => (s.id === editing.id ? editing : s)));
    setEditing(null);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          Manage Scholarships
        </h1>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">State</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((s) => (
              <tr key={s.id}>
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.category}</td>
                <td className="p-2 border">{s.state}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => setEditing(s)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✏️ EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit Scholarship</h2>

            {[
              "name",
              "category",
              "state",
              "education",
              "incomeLimit",
              "provider",
              "link",
            ].map((field) => (
              <input
                key={field}
                className="w-full mb-3 p-2 border rounded"
                value={(editing as any)[field]}
                onChange={(e) =>
                  setEditing({ ...editing, [field]: e.target.value })
                }
              />
            ))}

            <input
              type="date"
              className="w-full mb-4 p-2 border rounded"
              value={
                editing.deadline?.toDate
                  ? editing.deadline.toDate().toISOString().split("T")[0]
                  : editing.deadline
              }
              onChange={(e) =>
                setEditing({ ...editing, deadline: e.target.value })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
