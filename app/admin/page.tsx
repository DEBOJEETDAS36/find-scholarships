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
        ...form,
        deadline: Timestamp.fromDate(new Date(form.deadline)),
        createdAt: Timestamp.now(),
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
      alert("Error adding scholarship");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-200 p-6">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6 text-blue-600">
          Admin – Add Scholarship
        </h1>

        {success && (
          <p className="mb-4 text-green-600 font-semibold">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Scholarship Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="category"
            placeholder="Category (Merit / SC / Girls etc.)"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="state"
            placeholder="State (All India / Maharashtra etc.)"
            value={form.state}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="education"
            placeholder="Education (UG / PG / Class 11)"
            value={form.education}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="incomeLimit"
            placeholder="Income Limit"
            value={form.incomeLimit}
            onChange={handleChange}
            className="w-full p-3 border rounded"
          />

          <input
            name="provider"
            placeholder="Provider (Govt / AICTE / Tata)"
            value={form.provider}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            name="link"
            placeholder="Official Apply Link"
            value={form.link}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Adding..." : "Add Scholarship"}
          </button>
        </form>
      </div>
    </main>
  );
}
