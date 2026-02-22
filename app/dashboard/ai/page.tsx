"use client";

import { useState } from "react";

export default function AIPage() {
  const [form, setForm] = useState({
    educationLevel: "",
    state: "",
    category: "",
    familyIncome: "",
    gender: "",
    course: "",
  });

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        familyIncome: Number(form.familyIncome),
      }),
    });

    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        AI Scholarship Matching
      </h1>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <input name="educationLevel" placeholder="Education Level" onChange={handleChange} className="border p-2"/>
        <input name="state" placeholder="State" onChange={handleChange} className="border p-2"/>
        <input name="category" placeholder="Category" onChange={handleChange} className="border p-2"/>
        <input name="familyIncome" placeholder="Family Income" onChange={handleChange} className="border p-2"/>
        <input name="gender" placeholder="Gender" onChange={handleChange} className="border p-2"/>
        <input name="course" placeholder="Course" onChange={handleChange} className="border p-2"/>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Matching..." : "Find Matches"}
      </button>

      <div className="mt-6 space-y-4">
        {results.map((sch, i) => (
          <div key={i} className="border p-4 rounded">
            <h2 className="font-bold">{sch.name}</h2>
            <p>Match Score: {sch.matchScore}</p>
          </div>
        ))}
      </div>
    </div>
  );
}