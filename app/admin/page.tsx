"use client";

import { useState } from "react";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminPage() {
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
        name: form.name,
        category: form.category,
        state: form.state,
        education: form.education,
        incomeLimit: form.incomeLimit,
        provider: form.provider,
        link: form.link,

        // Firestore timestamps
        deadline: Timestamp.fromDate(new Date(form.deadline)),
        createdAt: Timestamp.now(),
        lastVerified: Timestamp.now(),

        // Metadata
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

  // Styling helpers
  const inputGroup =
    "flex flex-col md:flex-row md:items-center gap-2";
  const label =
    "md:w-1/3 font-medium text-gray-700";
  const input =
    "flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <main className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-4">
          Admin – Add Scholarship
        </h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 border border-green-200 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className={inputGroup}>
            <label className={label}>Scholarship Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={input}
              placeholder="Central Sector Scholarship"
            />
          </div>

          {/* Category */}
          <div className={inputGroup}>
            <label className={label}>Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={input}
              placeholder="Merit-based / SC / ST / Minority"
            />
          </div>

          {/* State */}
          <div className={inputGroup}>
            <label className={label}>State / Region</label>
            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              required
              className={input}
              placeholder="All India / Maharashtra"
            />
          </div>

          {/* Education */}
          <div className={inputGroup}>
            <label className={label}>Education Level</label>
            <input
              name="education"
              value={form.education}
              onChange={handleChange}
              required
              className={input}
              placeholder="UG / PG / Class 11"
            />
          </div>

          {/* Income Limit */}
          <div className={inputGroup}>
            <label className={label}>
              Income Limit <span className="text-gray-400">(optional)</span>
            </label>
            <input
              name="incomeLimit"
              value={form.incomeLimit}
              onChange={handleChange}
              className={input}
              placeholder="₹8,00,000"
            />
          </div>

          {/* Provider */}
          <div className={inputGroup}>
            <label className={label}>Provider</label>
            <input
              name="provider"
              value={form.provider}
              onChange={handleChange}
              required
              className={input}
              placeholder="Ministry of Education"
            />
          </div>

          {/* Link */}
          <div className={inputGroup}>
            <label className={label}>Application Link</label>
            <input
              name="link"
              type="url"
              value={form.link}
              onChange={handleChange}
              required
              className={input}
              placeholder="https://scholarships.gov.in"
            />
          </div>

          {/* Deadline */}
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

          {/* Submit */}
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
