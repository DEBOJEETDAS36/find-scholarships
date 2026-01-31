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
// AUTH IMPORTS - COMMENTED OUT FOR DIRECT ACCESS
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

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

  // AUTH STATE - COMMENTED OUT FOR DIRECT ACCESS
  // const [checkingAuth, setCheckingAuth] = useState(true);
  const [data, setData] = useState<Scholarship[]>([]);
  const [editing, setEditing] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔐 AUTH PROTECTION - COMMENTED OUT FOR DIRECT ACCESS
  // useEffect(() => {
  //   const unsub = onAuthStateChanged(auth, (user) => {
  //     if (!user || user.email !== "admin@example.com") {
  //       router.push("/admin/login");
  //     } else {
  //       setCheckingAuth(false);
  //     }
  //   });
  //   return () => unsub();
  // }, [router]);

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

  // AUTH LOADING CHECK - COMMENTED OUT FOR DIRECT ACCESS
  // if (checkingAuth) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-black">
  //       Checking admin access...
  //     </div>
  //   );
  // }

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
    try {
      await updateDoc(doc(db, "scholarships", editing.id), {
        ...editing,
        deadline: Timestamp.fromDate(new Date(editing.deadline)),
        lastVerified: Timestamp.now(),
      });

      setData(data.map((s) => (s.id === editing.id ? editing : s)));
      setEditing(null);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-700">
            Manage Scholarships
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/admin')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Add New
            </button>
            <button
              onClick={() => router.push('/admin/bulk')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Bulk Upload
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr className="text-black">
                <th className="p-3 border text-left">Name</th>
                <th className="p-3 border text-left">Category</th>
                <th className="p-3 border text-left">State</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 text-black">
                  <td className="p-3 border font-medium">{s.name}</td>
                  <td className="p-3 border">{s.category}</td>
                  <td className="p-3 border">{s.state}</td>
                  <td className="p-3 border text-center space-x-2">
                    <button
                      onClick={() => setEditing(s)}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✏️ EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-black border-bottom pb-2">Edit Scholarship</h2>

            <div className="space-y-3">
              {[
                { label: "Scholarship Name", key: "name" },
                { label: "Category", key: "category" },
                { label: "State", key: "state" },
                { label: "Education Level", key: "education" },
                { label: "Income Limit", key: "incomeLimit" },
                { label: "Provider", key: "provider" },
                { label: "Application Link", key: "link" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-xs font-bold text-gray-700 uppercase">{field.label}</label>
                  <input
                    className="w-full p-2 border border-gray-400 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                    value={(editing as any)[field.key]}
                    onChange={(e) =>
                      setEditing({ ...editing, [field.key]: e.target.value })
                    }
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Deadline</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-400 rounded text-black focus:ring-2 focus:ring-blue-500 outline-none"
                  value={
                    editing.deadline?.toDate
                      ? editing.deadline.toDate().toISOString().split("T")[0]
                      : editing.deadline || ""
                  }
                  onChange={(e) =>
                    setEditing({ ...editing, deadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 border border-gray-300 rounded text-black hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}