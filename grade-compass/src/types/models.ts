/**
 * Represents a course with its grade components and target grade
 */
export interface Course {
  id: string;
  name: string;
  components: GradeComponent[];
  targetGrade: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents a grade component (assignment, exam, etc.)
 */
export interface GradeComponent {
  id: string;
  name: string;
  weight: number; // Weight percentage (0-100)
  score: number | null; // Achieved score (null if not completed)
  maxScore: number; // Maximum possible score (default: 100)
  isCompleted: boolean; // Whether component is finished
}

/**
 * Results of grade calculations
 */
export interface CalculationResults {
  currentGrade: number | null;
  completedWeight: number;
  remainingWeight: number;
  requiredAverage: number | null;
  isAchievable: boolean;
  recommendations: string[];
}