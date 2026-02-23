"use client";

import { useState } from "react";
import Link from "next/link";

type Scholarship = {
  id: string;
  name: string;
  category: string;
  state: string;
  education: string;
  incomeLimit: string;
  provider: string;
  link: string;
  deadline: string;
  matchScore: number;
};

export default function AIPage() {
  const [form, setForm] = useState({
    educationLevel: "",
    state: "",
    category: "",
    familyIncome: "",
    gender: "",
    course: "",
  });

  const [results, setResults] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          familyIncome: form.familyIncome ? Number(form.familyIncome) : 0,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError("Failed to find matches. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 border-green-500 text-green-800";
    if (score >= 60) return "bg-blue-100 border-blue-500 text-blue-800";
    if (score >= 40) return "bg-yellow-100 border-yellow-500 text-yellow-800";
    return "bg-gray-100 border-gray-500 text-gray-800";
  };

  const getMatchLabel = (score: number) => {
    if (score >= 80) return "🎯 Excellent Match";
    if (score >= 60) return "✅ Good Match";
    if (score >= 40) return "👍 Fair Match";
    return "📋 Possible Match";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI Scholarship Matching
          </h1>
          <p className="text-gray-600">
            Fill in your details and let our intelligent system find the best scholarships for you
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🎓 Education Level
                </label>
                <select
                  name="educationLevel"
                  value={form.educationLevel}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Education Level</option>
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                  <option value="PhD">PhD/Doctorate</option>
                  <option value="Diploma">Diploma</option>
                  <option value="12th">12th Pass</option>
                  <option value="10th">10th Pass</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📍 State
                </label>
                <input
                  type="text"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="e.g., Maharashtra, Delhi, West Bengal"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📂 Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="SC">SC (Scheduled Caste)</option>
                  <option value="ST">ST (Scheduled Tribe)</option>
                  <option value="OBC">OBC (Other Backward Class)</option>
                  <option value="Minority">Minority</option>
                  <option value="Women">Women</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
              </div>

              {/* Family Income */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  💰 Annual Family Income (₹)
                </label>
                <input
                  type="number"
                  name="familyIncome"
                  value={form.familyIncome}
                  onChange={handleChange}
                  placeholder="e.g., 500000"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Course/Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📚 Course/Field of Study
                </label>
                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="e.g., Engineering, Medical, Arts"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⚙️</span> Finding Best Matches...
                </span>
              ) : (
                "🔍 Find My Scholarships"
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            ❌ {error}
          </div>
        )}

        {/* Results Section */}
        {searched && !loading && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {results.length > 0 ? `Found ${results.length} Matching Scholarships` : "No Matches Found"}
              </h2>
              {results.length > 0 && (
                <p className="text-sm text-gray-600">
                  Sorted by match score (highest first)
                </p>
              )}
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No scholarships match your criteria
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check back later for new opportunities
                </p>
                <button
                  onClick={() => {
                    setForm({
                      educationLevel: "",
                      state: "",
                      category: "",
                      familyIncome: "",
                      gender: "",
                      course: "",
                    });
                    setResults([]);
                    setSearched(false);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              results.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header with Match Score */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900 flex-1">
                        {scholarship.name}
                      </h3>
                      <div className={`px-4 py-2 rounded-full font-bold text-sm border-2 ${getMatchColor(scholarship.matchScore)}`}>
                        {scholarship.matchScore}% Match
                      </div>
                    </div>

                    {/* Match Label */}
                    <div className="mb-4">
                      <span className="text-sm font-semibold text-gray-700">
                        {getMatchLabel(scholarship.matchScore)}
                      </span>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-600">Category:</span>
                        <span className="text-sm px-2 py-1 bg-purple-50 text-purple-700 rounded-md font-medium">
                          {scholarship.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-600">State:</span>
                        <span className="text-sm px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium">
                          {scholarship.state}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-600">Education:</span>
                        <span className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                          {scholarship.education}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-600">Provider:</span>
                        <span className="text-sm text-gray-800 font-medium">
                          {scholarship.provider}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                        <span className="text-sm font-medium text-gray-600">Deadline:</span>
                        <span className="text-sm text-gray-800 font-semibold">
                          {scholarship.deadline}
                        </span>
                      </div>

                      {scholarship.incomeLimit && (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                          <span className="text-sm font-medium text-gray-600">Income Limit:</span>
                          <span className="text-sm text-gray-800 font-medium">
                            {scholarship.incomeLimit}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <a
                        href={scholarship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                      >
                        Apply Now →
                      </a>
                      <Link
                        href={`/scholarship/${scholarship.id}`}
                        className="px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
