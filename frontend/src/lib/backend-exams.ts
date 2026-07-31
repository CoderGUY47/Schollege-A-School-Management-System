// ============================================================
// backend-exams.ts
// Exam results data for use in Next.js API routes.
// Per AGENTS.md, data resides in frontend/src/lib/.
// ============================================================

export interface ExamResultRecord {
  serial: number;
  subjectCode: string;
  subjectName: string;
  fullMarks: number;
  theoryMarks: number;    // written exam portion
  practicalMarks: number; // practical / MCQ portion
  marksObtained: number | null;
  isAbsent?: boolean;
}

export interface MarkDistribution {
  category: string;
  fullMarks: number;
  passMark: number;
  description: string;
}

// Mark distribution breakdown per paper (NCTB standard)
export const SCHOLLEGE_MARK_DISTRIBUTION: MarkDistribution[] = [
  { category: "Written / Creative Questions (CQ)", fullMarks: 70, passMark: 23, description: "Structured long-form answers from syllabus chapters" },
  { category: "Multiple Choice Questions (MCQ)", fullMarks: 30, passMark: 10, description: "30 objective questions, 1 mark each, OMR sheet" },
  { category: "Practical / Lab Work", fullMarks: 25, passMark: 8, description: "Lab notebook, viva, and practical performance (where applicable)" },
  { category: "Internal / Class Assessment", fullMarks: 25, passMark: 8, description: "Class tests, attendance marks, assignment participation" },
];
export const SCH_MARK_DISTRIBUTION = SCHOLLEGE_MARK_DISTRIBUTION;

// Mid-Term Exam 2026 Results
const MID_TERM_RESULTS: ExamResultRecord[] = [
  { serial: 1,  subjectCode: "BNG-101", subjectName: "Bangla (Paper I)",               fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 82 },
  { serial: 2,  subjectCode: "BNG-102", subjectName: "Bangla (Paper II)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 78 },
  { serial: 3,  subjectCode: "ENG-101", subjectName: "English (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 75 },
  { serial: 4,  subjectCode: "ENG-102", subjectName: "English (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 71 },
  { serial: 5,  subjectCode: "PHY-201", subjectName: "Physics (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 88 },
  { serial: 6,  subjectCode: "PHY-202", subjectName: "Physics (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 85 },
  { serial: 7,  subjectCode: "CHM-201", subjectName: "Chemistry (Paper I)",            fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 91 },
  { serial: 8,  subjectCode: "CHM-202", subjectName: "Chemistry (Paper II)",           fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 87 },
  { serial: 9,  subjectCode: "MTH-201", subjectName: "Higher Mathematics (Paper I)",   fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 93 },
  { serial: 10, subjectCode: "MTH-202", subjectName: "Higher Mathematics (Paper II)",  fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 90 },
  { serial: 11, subjectCode: "BIO-201", subjectName: "Biology (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 76 },
  { serial: 12, subjectCode: "BIO-202", subjectName: "Biology (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 79 },
  { serial: 13, subjectCode: "ICT-101", subjectName: "Information & Comm. Technology", fullMarks: 100, theoryMarks: 50, practicalMarks: 50, marksObtained: 95 },
  { serial: 14, subjectCode: "REL-101", subjectName: "Islam & Moral Education",        fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 84 },
];

// Final Term Exam 2025 Results
const FINAL_TERM_RESULTS: ExamResultRecord[] = [
  { serial: 1,  subjectCode: "BNG-101", subjectName: "Bangla (Paper I)",               fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 77 },
  { serial: 2,  subjectCode: "BNG-102", subjectName: "Bangla (Paper II)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 73 },
  { serial: 3,  subjectCode: "ENG-101", subjectName: "English (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 68 },
  { serial: 4,  subjectCode: "ENG-102", subjectName: "English (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 65 },
  { serial: 5,  subjectCode: "PHY-201", subjectName: "Physics (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 81 },
  { serial: 6,  subjectCode: "PHY-202", subjectName: "Physics (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 79 },
  { serial: 7,  subjectCode: "CHM-201", subjectName: "Chemistry (Paper I)",            fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 86 },
  { serial: 8,  subjectCode: "CHM-202", subjectName: "Chemistry (Paper II)",           fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 83 },
  { serial: 9,  subjectCode: "MTH-201", subjectName: "Higher Mathematics (Paper I)",   fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 89 },
  { serial: 10, subjectCode: "MTH-202", subjectName: "Higher Mathematics (Paper II)",  fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 84 },
  { serial: 11, subjectCode: "BIO-201", subjectName: "Biology (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 70 },
  { serial: 12, subjectCode: "BIO-202", subjectName: "Biology (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 74 },
  { serial: 13, subjectCode: "ICT-101", subjectName: "Information & Comm. Technology", fullMarks: 100, theoryMarks: 50, practicalMarks: 50, marksObtained: 92 },
  { serial: 14, subjectCode: "REL-101", subjectName: "Islam & Moral Education",        fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 80 },
];

// Pre-Test Exam Results (one absent subject)
const PRE_TEST_RESULTS: ExamResultRecord[] = [
  { serial: 1,  subjectCode: "BNG-101", subjectName: "Bangla (Paper I)",               fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 80 },
  { serial: 2,  subjectCode: "BNG-102", subjectName: "Bangla (Paper II)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 76 },
  { serial: 3,  subjectCode: "ENG-101", subjectName: "English (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 72 },
  { serial: 4,  subjectCode: "ENG-102", subjectName: "English (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: null, isAbsent: true },
  { serial: 5,  subjectCode: "PHY-201", subjectName: "Physics (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 85 },
  { serial: 6,  subjectCode: "PHY-202", subjectName: "Physics (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 82 },
  { serial: 7,  subjectCode: "CHM-201", subjectName: "Chemistry (Paper I)",            fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 88 },
  { serial: 8,  subjectCode: "CHM-202", subjectName: "Chemistry (Paper II)",           fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 85 },
  { serial: 9,  subjectCode: "MTH-201", subjectName: "Higher Mathematics (Paper I)",   fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 91 },
  { serial: 10, subjectCode: "MTH-202", subjectName: "Higher Mathematics (Paper II)",  fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 88 },
  { serial: 11, subjectCode: "BIO-201", subjectName: "Biology (Paper I)",              fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 74 },
  { serial: 12, subjectCode: "BIO-202", subjectName: "Biology (Paper II)",             fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 77 },
  { serial: 13, subjectCode: "ICT-101", subjectName: "Information & Comm. Technology", fullMarks: 100, theoryMarks: 50, practicalMarks: 50, marksObtained: 94 },
  { serial: 14, subjectCode: "REL-101", subjectName: "Islam & Moral Education",        fullMarks: 100, theoryMarks: 70, practicalMarks: 30, marksObtained: 83 },
];

export const SCHOLLEGE_EXAM_RESULTS: Record<string, ExamResultRecord[]> = {
  "Mid-Term Exam 2026":    MID_TERM_RESULTS,
  "Final Term Exam 2025":  FINAL_TERM_RESULTS,
  "Pre-Test Examination":  PRE_TEST_RESULTS,
};
export const SCH_EXAM_RESULTS = SCHOLLEGE_EXAM_RESULTS;
