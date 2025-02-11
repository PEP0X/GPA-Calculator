export type Grade = "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D"
export type GradeEntry = [Grade, number]
export type Semester = {
  name: string
  grades: GradeEntry[]
}

export function calculateGPA(semesters: Semester[]): [number, string] {
  const gradePoints: Record<Grade, number> = {
    "A+": 4.0,
    A: 3.7,
    "B+": 3.3,
    B: 3.0,
    "C+": 2.7,
    C: 2.4,
    "D+": 2.2,
    D: 2.0,
  }

  let totalPoints = 0
  let totalCredits = 0

  semesters.forEach((semester) => {
    semester.grades.forEach(([grade, hours]) => {
      totalPoints += gradePoints[grade] * hours
      totalCredits += hours
    })
  })

  const gpa = totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0.0

  let finalGrade: string
  if (gpa >= 3.7) finalGrade = "A"
  else if (gpa >= 3.3) finalGrade = "B+"
  else if (gpa >= 3.0) finalGrade = "B"
  else if (gpa >= 2.7) finalGrade = "C+"
  else finalGrade = "C"

  return [gpa, finalGrade]
}

