import { scholarships } from "../data/scholarships";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Scholarship Finder
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">
        {scholarships.map((s) => (
          <div
            key={s.id}
            className="bg-white p-4 rounded-lg shadow"
          >
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="text-sm text-gray-600">
              Category: {s.category} | State: {s.state}
            </p>
            <p className="text-sm text-gray-600">
              Deadline: {s.deadline}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
