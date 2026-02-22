export function calculateMatchScore(student: any, scholarship: any) {
  let score = 0;

  // Hard filters
  if (scholarship.deadline && new Date(scholarship.deadline) < new Date())
    return 0;

  if (
    scholarship.incomeLimit &&
    student.familyIncome > scholarship.incomeLimit
  )
    return 0;

  if (
    scholarship.educationLevel &&
    !scholarship.educationLevel.includes(student.educationLevel)
  )
    return 0;

  // Soft scoring
  if (
    scholarship.eligibleStates?.includes("All India") ||
    scholarship.eligibleStates?.includes(student.state)
  )
    score += 20;

  if (
    scholarship.eligibleCategories?.includes(student.category)
  )
    score += 20;

  if (
    scholarship.course?.includes(student.course)
  )
    score += 15;

  if (scholarship.gender === student.gender)
    score += 10;

  if (student.familyIncome <= scholarship.incomeLimit)
    score += 20;

  if (
    scholarship.educationLevel?.includes(student.educationLevel)
  )
    score += 15;

  return score;
}