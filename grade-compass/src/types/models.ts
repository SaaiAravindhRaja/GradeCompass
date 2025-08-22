export interface Assessment {
  id: string;
  name: string;
  weight: number;
  grade: number | null; // null if not yet graded
}

export interface Course {
  id: string;
  name: string;
  credits: number;
  assessments: Assessment[];
}
