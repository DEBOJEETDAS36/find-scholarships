import { NextResponse } from "next/server";
import { calculateMatchScore } from "@/lib/matchingEngine";
import { getScholarships } from "@/lib/firebase"; // your function
import { getStudent } from "@/lib/mongo"; // your function

export async function POST(req: Request) {
  const body = await req.json();
  const student = body;

  const scholarships = await getScholarships();

  const matches = scholarships
    .map((sch: any) => ({
      ...sch,
      matchScore: calculateMatchScore(student, sch),
    }))
    .filter((sch: any) => sch.matchScore > 40)
    .sort((a: any, b: any) => b.matchScore - a.matchScore);

  return NextResponse.json(matches.slice(0, 20));
}