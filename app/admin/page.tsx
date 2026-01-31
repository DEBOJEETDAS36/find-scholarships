"use client";

// AUTH IMPORTS - COMMENTED OUT FOR DIRECT ACCESS
// import { signOut } from "firebase/auth";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "@/lib/firebase";

import { useState, useEffect } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";

export default function AdminPage() {
  const router = useRouter();

  // 🔐 AUTH STATE - COMMENTED OUT FOR DIRECT ACCESS
  // const [checkingAuth, setCheckingAuth] = useState(true);

  // 📝 FORM STATE (MUST BE DECLARED BEFORE ANY RETURN)
  const [form, setForm] = useState({
    name: "",
    category: "",
    state: "",
    education: "",
    incomeLimit: "",
    provider: "",
    link: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // 🔐 AUTH PROTECTION - COMMENTED OUT FOR DIRECT ACCESS
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (!user || user.email !== "admin@example.com") {
  //       router.push("/admin/login");
  //     } else {
  //       setCheckingAuth(false);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [router]);

  // ⏳ SHOW LOADING WHILE CHECKING AUTH - COMMENTED OUT FOR DIRECT ACCESS
  // if (checkingAuth) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
  //       Checking admin access...
  //     </div>
  //   );
  // }

  // LOGOUT FUNCTION - COMMENTED OUT FOR DIRECT ACCESS
  // async function handleLogout() {
  //   await signOut(auth);
  //   window.location.href = "/admin/login";
  // }


  // ======================
  // HANDLERS
  // ======================
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    try {
      await addDoc(collection(db, "scholarships"), {
        ...form,
        deadline: Timestamp.fromDate(new Date(form.deadline)),
        createdAt: Timestamp.now(),
        lastVerified: Timestamp.now(),
        source: "Admin",
      });

      setSuccess("Scholarship added successfully ✅");

      setForm({
        name: "",
        category: "",
        state: "",
        education: "",
        incomeLimit: "",
        provider: "",
        link: "",
        deadline: "",
      });
    } catch (error) {
      console.error(error);
      alert("❌ Error adding scholarship");
    }

    setLoading(false);
  }

  // ======================
  // UI
  // ======================
  const inputGroup =
    "flex flex-col md:flex-row md:items-center gap-2";
  const label =
    "md:w-1/3 font-medium text-gray-700";
  const input =
    "flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Admin Dashboard
          </h1>

          {/* LOGOUT BUTTON - COMMENTED OUT FOR DIRECT ACCESS */}
          {/* <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Logout
          </button> */}
          
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/admin/manage')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Manage Scholarships
            </button>
            <button
              onClick={() => router.push('/admin/bulk')}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Bulk Upload
            </button>
          </div>
        </div>


        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {Object.entries({
            name: "Scholarship Name",
            category: "Category",
            state: "State / Region",
            education: "Education Level",
            incomeLimit: "Income Limit",
            provider: "Provider",
            link: "Application Link",
          }).map(([key, labelText]) => (
            <div key={key} className={inputGroup}>
              <label className={label}>{labelText}</label>
              <input
                name={key}
                value={(form as any)[key]}
                onChange={handleChange}
                className={input}
                required={key !== "incomeLimit"}
              />
            </div>
          ))}

          <div className={inputGroup}>
            <label className={label}>Deadline</label>
            <input
              name="deadline"
              type="date"
              value={form.deadline}
              onChange={handleChange}
              required
              className={input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? "Adding..." : "Add Scholarship"}
          </button>
        </form>
      </div>
    </main>
  );
}
