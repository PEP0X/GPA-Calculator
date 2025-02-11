"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GPACircleProps {
  gpa: number
  size?: number
  strokeWidth?: number
}

export function GPACircle({ gpa, size = 200, strokeWidth = 8 }: GPACircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = (gpa / 4.0) * circumference

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-emerald-500 dark:text-emerald-400" // A+, A
    if (gpa >= 3.0) return "text-blue-500 dark:text-blue-400" // B+, B
    if (gpa >= 2.4) return "text-yellow-500 dark:text-yellow-400" // C+, C
    return "text-red-500 dark:text-red-400" // D+, D
  }

  const getGPAGrade = (gpa: number) => {
    if (gpa >= 4.0) return "A+"
    if (gpa >= 3.7) return "A"
    if (gpa >= 3.3) return "B+"
    if (gpa >= 3.0) return "B"
    if (gpa >= 2.7) return "C+"
    if (gpa >= 2.4) return "C"
    if (gpa >= 2.2) return "D+"
    if (gpa >= 2.0) return "D"
    return "F"
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(getGPAColor(gpa))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className={cn("text-4xl font-bold", getGPAColor(gpa))}>{gpa.toFixed(2)}</span>
        <span className="text-sm text-muted-foreground">Grade: {getGPAGrade(gpa)}</span>
        <span className="text-xs text-muted-foreground mt-1">Cumulative GPA</span>
      </div>
      <div className="absolute bottom-0 left-0 text-xs text-muted-foreground">0.0</div>
      <div className="absolute bottom-0 right-0 text-xs text-muted-foreground">4.0</div>
    </div>
  )
}

