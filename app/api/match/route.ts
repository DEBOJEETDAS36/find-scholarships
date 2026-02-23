import { NextRequest, NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type MatchRequest = {
  educationLevel: string;
  state: string;
  category: string;
  familyIncome: number;
  gender: string;
  course: string;
};

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

// Rule-based matching algorithm
function calculateMatchScore(scholarship: Scholarship, userProfile: MatchRequest): number {
  let score = 0;
  let maxScore = 0;

  // Education Level Match (Weight: 30 points)
  maxScore += 30;
  if (scholarship.education && userProfile.educationLevel) {
    if (scholarship.education.toLowerCase() === userProfile.educationLevel.toLowerCase()) {
      score += 30;
    } else if (scholarship.education.toLowerCase().includes(userProfile.educationLevel.toLowerCase()) ||
               userProfile.educationLevel.toLowerCase().includes(scholarship.education.toLowerCase())) {
      score += 15;
    }
  }

  // State Match (Weight: 25 points)
  maxScore += 25;
  if (scholarship.state && userProfile.state) {
    if (scholarship.state.toLowerCase() === userProfile.state.toLowerCase()) {
      score += 25;
    } else if (scholarship.state.toLowerCase() === "india" || scholarship.state.toLowerCase() === "all india") {
      score += 20; // National scholarships get high score
    } else if (scholarship.state.toLowerCase().includes(userProfile.state.toLowerCase()) ||
               userProfile.state.toLowerCase().includes(scholarship.state.toLowerCase())) {
      score += 12;
    }
  }

  // Category Match (Weight: 25 points)
  maxScore += 25;
  if (scholarship.category && userProfile.category) {
    if (scholarship.category.toLowerCase() === userProfile.category.toLowerCase()) {
      score += 25;
    } else if (scholarship.category.toLowerCase() === "general" || scholarship.category.toLowerCase() === "all") {
      score += 15; // General category scholarships available to all
    } else if (scholarship.category.toLowerCase().includes(userProfile.category.toLowerCase()) ||
               userProfile.category.toLowerCase().includes(scholarship.category.toLowerCase())) {
      score += 12;
    }
  }

  // Income Limit Match (Weight: 20 points)
  maxScore += 20;
  if (scholarship.incomeLimit && userProfile.familyIncome) {
    const incomeLimitStr = scholarship.incomeLimit.replace(/[^0-9]/g, "");
    const incomeLimit = parseInt(incomeLimitStr);
    
    if (!isNaN(incomeLimit)) {
      if (userProfile.familyIncome <= incomeLimit) {
        score += 20;
      } else if (userProfile.familyIncome <= incomeLimit * 1.2) {
        score += 10; // Close to limit
      }
    } else if (scholarship.incomeLimit.toLowerCase().includes("no limit") || 
               scholarship.incomeLimit.toLowerCase().includes("any")) {
      score += 20;
    }
  }

  // Gender Match (Bonus: 10 points if applicable)
  if (userProfile.gender) {
    const scholarshipName = scholarship.name.toLowerCase();
    const genderLower = userProfile.gender.toLowerCase();
    
    if (scholarshipName.includes("women") || scholarshipName.includes("girl")) {
      if (genderLower === "female" || genderLower === "woman") {
        score += 10;
        maxScore += 10;
      }
    } else if (scholarshipName.includes("men") || scholarshipName.includes("boy")) {
      if (genderLower === "male" || genderLower === "man") {
        score += 10;
        maxScore += 10;
      }
    } else {
      // Gender neutral scholarship
      score += 5;
      maxScore += 5;
    }
  }

  // Course/Field Match (Bonus: 10 points if applicable)
  if (userProfile.course) {
    const scholarshipName = scholarship.name.toLowerCase();
    const courseLower = userProfile.course.toLowerCase();
    
    if (scholarshipName.includes(courseLower) ||
        (courseLower.includes("engineering") && scholarshipName.includes("engineering")) ||
        (courseLower.includes("medical") && scholarshipName.includes("medical")) ||
        (courseLower.includes("science") && scholarshipName.includes("science")) ||
        (courseLower.includes("arts") && scholarshipName.includes("arts"))) {
      score += 10;
      maxScore += 10;
    }
  }

  // Calculate percentage score
  const percentageScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  
  return percentageScore;
}

export async function POST(request: NextRequest) {
  try {
    const userProfile: MatchRequest = await request.json();

    // Validate input
    if (!userProfile.educationLevel && !userProfile.state && !userProfile.category) {
      return NextResponse.json(
        { error: "Please provide at least education level, state, or category" },
        { status: 400 }
      );
    }

    // Fetch all scholarships from Firestore
    const scholarshipsRef = collection(db, "scholarships");
    const snapshot = await getDocs(scholarshipsRef);
    
    const scholarships: Scholarship[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<Scholarship, "id">
    }));

    // Calculate match scores for each scholarship
    const matchedScholarships = scholarships.map(scholarship => ({
      ...scholarship,
      matchScore: calculateMatchScore(scholarship, userProfile),
      deadline: scholarship.deadline?.toDate ? 
        scholarship.deadline.toDate().toISOString().split('T')[0] : 
        scholarship.deadline
    }));

    // Filter scholarships with score > 30% and sort by score
    const filteredResults = matchedScholarships
      .filter(s => s.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json(filteredResults);
  } catch (error) {
    console.error("Match API Error:", error);
    return NextResponse.json(
      { error: "Failed to match scholarships" },
      { status: 500 }
    );
  }
}
