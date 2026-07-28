export interface SCHSubject {
  code: string;
  name: string;
  category: "COMPULSORY" | "ELECTIVE" | "OPTIONAL";
  fullMarks: number;
  theoryMarks: number;
  practicalMarks?: number;
  creditHours: number;
}

export interface ClassCurriculum {
  className: string;
  level: "PRIMARY" | "JUNIOR_SECONDARY" | "SECONDARY" | "HIGHER_SECONDARY";
  medium: "BANGLA_MEDIUM" | "ENGLISH_VERSION";
  groups?: string[];
  subjects: Record<string, SCHSubject[]>;
}

export const SCH_CURRICULUM: Record<string, ClassCurriculum> = {
  "Class 1": {
    className: "Class 1",
    level: "PRIMARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-101", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-101", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "MATH-101", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ART-101", name: "Arts & Crafts", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
        { code: "PED-101", name: "Physical Education & Health", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
      ],
    },
  },
  "Class 2": {
    className: "Class 2",
    level: "PRIMARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-102", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-102", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "MATH-102", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ART-102", name: "Arts & Crafts", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
      ],
    },
  },
  "Class 3": {
    className: "Class 3",
    level: "PRIMARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-103", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-103", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "MATH-103", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SCI-103", name: "Elementary Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BGS-103", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-103", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 4": {
    className: "Class 4",
    level: "PRIMARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-104", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-104", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "MATH-104", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SCI-104", name: "Elementary Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BGS-104", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-104", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 5": {
    className: "Class 5",
    level: "PRIMARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-105", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-105", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "MATH-105", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SCI-105", name: "Elementary Science & Technology", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BGS-105", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-105", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 6": {
    className: "Class 6",
    level: "JUNIOR_SECONDARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-106A", name: "Bangla 1st Paper (Sahitya)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BAN-106B", name: "Bangla 2nd Paper (Vyakaran)", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
        { code: "ENG-106A", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-106B", name: "English 2nd Paper (Grammar)", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
        { code: "MATH-106", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SCI-106", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BGS-106", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ICT-106", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "REL-106", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 7": {
    className: "Class 7",
    level: "JUNIOR_SECONDARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-107A", name: "Bangla 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BAN-107B", name: "Bangla 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
        { code: "ENG-107A", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-107B", name: "English 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
        { code: "MATH-107", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SCI-107", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BGS-107", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ICT-107", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "REL-107", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 8": {
    className: "Class 8",
    level: "JUNIOR_SECONDARY",
    medium: "BANGLA_MEDIUM",
    subjects: {
      DEFAULT: [
        { code: "BAN-108A", name: "Bangla 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BAN-108B", name: "Bangla 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
        { code: "ENG-108A", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-108B", name: "English 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
        { code: "MATH-108", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SCI-108", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "BGS-108", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ICT-108", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "REL-108", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 9": {
    className: "Class 9",
    level: "SECONDARY",
    medium: "BANGLA_MEDIUM",
    groups: ["Science", "Commerce", "Arts"],
    subjects: {
      Science: [
        { code: "BAN-109", name: "Bangla (Sahitya & Vyakaran)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-109", name: "English (Paper 1 & 2)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "MATH-109", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-109", name: "ICT", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "PHY-109", name: "Physics", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "CHE-109", name: "Chemistry", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "HMATH-109", name: "Higher Mathematics", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "BIO-109", name: "Biology", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "BGS-109", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-109", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
      Commerce: [
        { code: "BAN-109", name: "Bangla", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-109", name: "English", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "MATH-109", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-109", name: "ICT", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "ACC-109", name: "Accounting", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "FIN-109", name: "Finance & Banking", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "BUS-109", name: "Business Entrepreneurship", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "GSCI-109", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-109", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
      Arts: [
        { code: "BAN-109", name: "Bangla", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-109", name: "English", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "MATH-109", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-109", name: "ICT", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "HIS-109", name: "History of Bangladesh & World", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "CIV-109", name: "Civics & Citizenship", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "GEO-109", name: "Geography & Environment", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "GSCI-109", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-109", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 10": {
    className: "Class 10",
    level: "SECONDARY",
    medium: "BANGLA_MEDIUM",
    groups: ["Science", "Commerce", "Arts"],
    subjects: {
      Science: [
        { code: "BAN-110", name: "Bangla (SSC Prep)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-110", name: "English (SSC Prep)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "MATH-110", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-110", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "PHY-110", name: "Physics (Theory & Practical)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "CHE-110", name: "Chemistry (Theory & Practical)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "HMATH-110", name: "Higher Mathematics", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "BIO-110", name: "Biology (Theory & Practical)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "BGS-110", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-110", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
      Commerce: [
        { code: "BAN-110", name: "Bangla", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-110", name: "English", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "MATH-110", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-110", name: "ICT", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "ACC-110", name: "Accounting", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "FIN-110", name: "Finance & Banking", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "BUS-110", name: "Business Entrepreneurship", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "GSCI-110", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-110", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
      Arts: [
        { code: "BAN-110", name: "Bangla", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "ENG-110", name: "English", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "MATH-110", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-110", name: "ICT", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
        { code: "HIS-110", name: "History of Bangladesh & World", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "CIV-110", name: "Civics & Citizenship", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "GEO-110", name: "Geography & Environment", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "GSCI-110", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
        { code: "REL-110", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
      ],
    },
  },
  "Class 11": {
    className: "Class 11",
    level: "HIGHER_SECONDARY",
    medium: "BANGLA_MEDIUM",
    groups: ["Science", "Commerce", "Arts"],
    subjects: {
      Science: [
        { code: "BAN-201", name: "Bangla 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-201", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-201", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 3 },
        { code: "PHY-201", name: "Physics 1st Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "CHE-201", name: "Chemistry 1st Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "MATH-201", name: "Higher Mathematics 1st Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "BIO-201", name: "Biology 1st Paper (Botany)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
      ],
      Commerce: [
        { code: "BAN-201", name: "Bangla 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-201", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-201", name: "ICT", category: "COMPULSORY", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 3 },
        { code: "ACC-201", name: "Accounting 1st Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "BOM-201", name: "Business Organization 1st Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "FIN-201", name: "Finance, Banking & Insurance 1st", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "PROD-201", name: "Production Management 1st Paper", category: "OPTIONAL", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
      ],
      Arts: [
        { code: "BAN-201", name: "Bangla 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-201", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-201", name: "ICT", category: "COMPULSORY", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 3 },
        { code: "ECO-201", name: "Economics 1st Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "POL-201", name: "Civics & Good Governance 1st", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SOC-201", name: "Sociology / Social Work 1st", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "LOG-201", name: "Logic 1st Paper", category: "OPTIONAL", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
      ],
    },
  },
  "Class 12": {
    className: "Class 12",
    level: "HIGHER_SECONDARY",
    medium: "BANGLA_MEDIUM",
    groups: ["Science", "Commerce", "Arts"],
    subjects: {
      Science: [
        { code: "BAN-202", name: "Bangla 2nd Paper (HSC)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-202", name: "English 2nd Paper (HSC)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-202", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 3 },
        { code: "PHY-202", name: "Physics 2nd Paper (Electromagnetism)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "CHE-202", name: "Chemistry 2nd Paper (Organic Chemistry)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "MATH-202", name: "Higher Mathematics 2nd Paper (Calculus)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
        { code: "BIO-202", name: "Biology 2nd Paper (Zoology)", category: "ELECTIVE", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 4 },
      ],
      Commerce: [
        { code: "BAN-202", name: "Bangla 2nd Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-202", name: "English 2nd Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-202", name: "ICT", category: "COMPULSORY", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 3 },
        { code: "ACC-202", name: "Accounting 2nd Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "BOM-202", name: "Business Organization 2nd Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "FIN-202", name: "Finance, Banking & Insurance 2nd", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "PROD-202", name: "Production Management 2nd Paper", category: "OPTIONAL", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
      ],
      Arts: [
        { code: "BAN-202", name: "Bangla 2nd Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ENG-202", name: "English 2nd Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "ICT-202", name: "ICT", category: "COMPULSORY", fullMarks: 100, theoryMarks: 75, practicalMarks: 25, creditHours: 3 },
        { code: "ECO-202", name: "Economics 2nd Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "POL-202", name: "Civics & Good Governance 2nd", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "SOC-202", name: "Sociology 2nd Paper", category: "ELECTIVE", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
        { code: "LOG-202", name: "Logic 2nd Paper", category: "OPTIONAL", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
      ],
    },
  },
};
