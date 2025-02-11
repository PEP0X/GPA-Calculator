"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { GPACircle } from "@/components/gpa-circle"
import { ThemeToggle } from "@/components/theme-toggle"
import GPACalculator from "../gpa-calculator"

export default function PreviousGPACalculator() {
  const [previousGPA, setPreviousGPA] = useState<number>(0)
  const [totalCredits, setTotalCredits] = useState<number>(0)
  const [showCalculator, setShowCalculator] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (previousGPA < 0 || previousGPA > 4) {
      alert("GPA must be between 0 and 4")
      return
    }
    if (totalCredits < 0) {
      alert("Total credits cannot be negative")
      return
    }
    setShowCalculator(true)
  }

  if (showCalculator) {
    return <GPACalculator previousGPA={previousGPA} previousCredits={totalCredits} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Calculator className="h-8 w-8 text-primary" />
              Previous GPA Calculator
            </h1>
            <p className="text-muted-foreground mt-1">Continue from your previous GPA</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Previous GPA</label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4"
                      value={previousGPA}
                      onChange={(e) => setPreviousGPA(Number(e.target.value))}
                      placeholder="Enter your previous GPA"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Total Credits Completed</label>
                    <Input
                      type="number"
                      min="0"
                      value={totalCredits}
                      onChange={(e) => setTotalCredits(Number(e.target.value))}
                      placeholder="Enter total credits completed"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Continue to Calculator
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6 border-t-4 border-t-primary">
                <div className="flex justify-center">
                  <GPACircle gpa={previousGPA} size={240} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}