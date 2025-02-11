"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GPACircle } from "@/components/gpa-circle"
import { calculateGPA, calculateGPAWithPrevious, GradeEntry, type Grade, type Semester } from "../../utils/calculateGPA"
import { cn } from "@/lib/utils"
import { Pencil, Trash2, Calculator, School } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { usePathname } from "next/navigation"


interface GPACalculatorProps {
  previousGPA?: number
  previousCredits?: number
}

export default function GPACalculator({ previousGPA, previousCredits }: GPACalculatorProps) {
  const [semesters, setSemesters] = useState<Semester[]>([{ name: "Semester 1", grades: [] }])
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const showPreviousButton = pathname !== "/previous-gpa"
  // Move localStorage logic to useEffect
  useEffect(() => {
    const loadData = async () => {
      try {
        const saved = localStorage.getItem('gpa-semesters')
        if (saved) {
          setSemesters(JSON.parse(saved))
        }
        setIsInitialized(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Save data effect
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('gpa-semesters', JSON.stringify(semesters))
    }
  }, [semesters, isInitialized])

  const [editingSemester, setEditingSemester] = useState<number | null>(null)

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-emerald-500 dark:text-emerald-400"
    if (grade.startsWith("B")) return "text-blue-500 dark:text-blue-400"
    if (grade.startsWith("C")) return "text-yellow-500 dark:text-yellow-400"
    return "text-red-500 dark:text-red-400"
  }

  const addCourse = (semesterIndex: number) => {
    const updatedSemesters = [...semesters]
    updatedSemesters[semesterIndex].grades.push(["A+" as Grade, 3])
    setSemesters(updatedSemesters)
  }

  const updateGrade = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    const updatedSemesters = [...semesters]
    updatedSemesters[semesterIndex].grades[courseIndex][0] = grade
    setSemesters(updatedSemesters)
  }

  const updateCredits = (semesterIndex: number, courseIndex: number, credits: number) => {
    if (credits < 0 || credits > 99) {
      alert('Credit hours must be between 0 and 99')
      return
    }
    const updatedSemesters = [...semesters]
    updatedSemesters[semesterIndex].grades[courseIndex][1] = credits
    setSemesters(updatedSemesters)
  }

  const addSemester = () => {
    setSemesters([...semesters, { name: `Semester ${semesters.length + 1}`, grades: [] }])
  }

  const [gpa] = previousGPA !== undefined && previousCredits !== undefined
    ? calculateGPAWithPrevious(semesters, previousGPA, previousCredits)
    : calculateGPA(semesters)

  const updateSemesterName = (index: number, name: string) => {
    const updatedSemesters = [...semesters]
    updatedSemesters[index].name = name
    setSemesters(updatedSemesters)
  }

  const removeSemester = (index: number) => {
    if (window.confirm('Are you sure you want to delete this semester? This action cannot be undone.')) {
      setSemesters(semesters.filter((_, i) => i !== index))
    }
  }

   const removeCourse = (semesterIndex: number, courseIndex: number) => {
    const updatedSemesters = [...semesters]
    updatedSemesters[semesterIndex].grades.splice(courseIndex, 1)
    setSemesters(updatedSemesters)
  }

  const calculateSemesterGPA = (grades: GradeEntry[]): number => {
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

    grades.forEach(([grade, hours]) => {
      totalPoints += gradePoints[grade] * hours
      totalCredits += hours
    })

    return totalCredits > 0 ? Number((totalPoints / totalCredits).toFixed(2)) : 0.0
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <School className="h-12 w-12 text-primary animate-bounce mx-auto" />
          <p className="text-muted-foreground">Loading your GPA data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2">
                <Calculator className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                GPA Calculator
              </h1>
              <p className="text-muted-foreground mt-1">For MAMM 📚✨</p>
            </div>
            {showPreviousButton && (
              <Link href="/previous-gpa" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto h-9 sm:h-10">
                  Calculate with Previous GPA
                </Button>
              </Link>
            )}
          </div>
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <AnimatePresence mode="popLayout">
              {semesters.map((semester, semesterIndex) => (
                <motion.div
                  key={semesterIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="overflow-hidden border-t-4 border-t-primary">
                    <CardHeader className="pb-4 bg-muted/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <School className="h-5 w-5 text-primary" />
                          {editingSemester === semesterIndex ? (
                            <Input
                              className="h-7 w-[200px]"
                              value={semester.name}
                              onChange={(e) => updateSemesterName(semesterIndex, e.target.value)}
                              onBlur={() => setEditingSemester(null)}
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg font-medium">{semester.name}</CardTitle>
                              <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
        onClick={() => setEditingSemester(semesterIndex)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
                            </div>
                          )}
                        </div>
                        <Button
        variant="ghost"
        size="icon"
        onClick={() => removeSemester(semesterIndex)}
        className="h-8 w-8 hover:bg-red-500/10 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-6">
                      {semester.grades.map(([grade, credits], courseIndex) => (
                        <motion.div
                          key={courseIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="grid grid-cols-12 gap-2 sm:gap-3 items-center"
                        >
                          <Input 
                            className="col-span-12 sm:col-span-5 text-sm" 
                            placeholder="Course name" 
                          />
                          <Select
                            value={grade}
                            onValueChange={(value: Grade) => updateGrade(semesterIndex, courseIndex, value)}
                          >
                            <SelectTrigger className={cn("col-span-7 sm:col-span-3 text-sm", getGradeColor(grade))}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {["A+", "A", "B+", "B", "C+", "C", "D+", "D"].map((g) => (
                                <SelectItem key={g} value={g} className={cn(getGradeColor(g))}>
                                  {g}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={credits}
                            onChange={(e) => updateCredits(semesterIndex, courseIndex, Number(e.target.value))}
                            className="col-span-4 sm:col-span-3 text-sm"
                            min={0}
                            max={99}
                          />
                          <Button
        variant="ghost"
        size="icon"
        onClick={() => removeCourse(semesterIndex, courseIndex)}
        className="col-span-1 hover:bg-red-500/10 hover:text-red-500 transition-colors"
      >
        <X className="h-4 w-4" />
      </Button>
                        </motion.div>
                      ))}
                      <Button
        variant="outline"
        size="sm"
        className="w-full bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 transition-all"
        onClick={() => addCourse(semesterIndex)}
      >
        <Plus className="h-4 w-4 mr-2 text-primary" />
        Add Course
      </Button>
                      {/* // Update the semester GPA display section */}
                      {semester.grades.length > 0 && (
                        <div className="pt-4 border-t">
                          <p className="text-sm flex items-center justify-between">
                            <span className="text-muted-foreground">{semester.name} GPA:</span>
                            <span className={cn("font-medium text-lg", getGradeColor(calculateSemesterGPA(semester.grades).toFixed(1)))}>
                              {calculateSemesterGPA(semester.grades).toFixed(2)}
                            </span>
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button
        variant="outline"
        className="w-full bg-gradient-to-r from-blue-500/10 to-primary/5 hover:from-blue-500/20 hover:to-primary/10 transition-all"
        onClick={addSemester}
      >
        <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform text-blue-500" />
        Add Semester
      </Button>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-4 sm:p-6 border-t-4 border-t-primary">
                <div className="flex justify-center">
                  <GPACircle gpa={gpa} size={200} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

