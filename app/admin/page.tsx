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

  // Reusable wrapper for styling consistency
  const inputGroupClass = "flex flex-col md:flex-row md:items-center gap-2";
  const labelClass = "md:w-1/3 font-medium text-gray-700";
  const inputClass = "flex-1 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

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
          <div className={inputGroupClass}>
            <label htmlFor="name" className={labelClass}>
              Scholarship Name
            </label>
            <input
              id="name"
              name="name"
              placeholder="e.g. Tata Merit Scholarship"
              value={form.name}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Category */}
          <div className={inputGroupClass}>
            <label htmlFor="category" className={labelClass}>
              Category
            </label>
            <input
              id="category"
              name="category"
              placeholder="e.g. Merit, SC, ST, Girls"
              value={form.category}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* State */}
          <div className={inputGroupClass}>
            <label htmlFor="state" className={labelClass}>
              State / Region
            </label>
            <input
              id="state"
              name="state"
              placeholder="e.g. All India, Maharashtra"
              value={form.state}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Education */}
          <div className={inputGroupClass}>
            <label htmlFor="education" className={labelClass}>
              Education Level
            </label>
            <input
              id="education"
              name="education"
              placeholder="e.g. UG, PG, Class 11"
              value={form.education}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Income Limit */}
          <div className={inputGroupClass}>
            <label htmlFor="incomeLimit" className={labelClass}>
              Income Limit <span className="text-gray-400 text-sm font-normal">(Optional)</span>
            </label>
            <input
              id="incomeLimit"
              name="incomeLimit"
              placeholder="e.g. < 2.5 Lakhs"
              value={form.incomeLimit}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Provider */}
          <div className={inputGroupClass}>
            <label htmlFor="provider" className={labelClass}>
              Provider Name
            </label>
            <input
              id="provider"
              name="provider"
              placeholder="e.g. Govt of India, AICTE"
              value={form.provider}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Link */}
          <div className={inputGroupClass}>
            <label htmlFor="link" className={labelClass}>
              Application Link
            </label>
            <input
              id="link"
              name="link"
              type="url"
              placeholder="https://..."
              value={form.link}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Deadline */}
          <div className={inputGroupClass}>
            <label htmlFor="deadline" className={labelClass}>
              Application Deadline
            </label>
            <input
              id="deadline"
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition disabled:bg-blue-300"
            >
              {loading ? "Adding..." : "Add Scholarship"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}