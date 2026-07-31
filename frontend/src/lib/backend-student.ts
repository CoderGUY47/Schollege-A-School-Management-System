// Student Roll / ID Format: [Period]-[Class]-[Serial] (e.g. "261-01-0001")
//   [Period] (261) = Enrollment Period / Session (26 = Year 2026, 1 = Session Code: 1=Spring, 2=Summer, 3=Fall)
//   [Class]  (01)  = Class Level zero-padded (01 to 12)
//   [Serial] (0001)= Sequential student roll serial number within class

export interface StudentRecord {
  id: string;
  studentIdNumber: string;
  rollNo: string;           // formatted: "261-01-0001" (Period-Class-Serial)
  name: string;
  className: string;
  sectionName: string;
  group: "General" | "Science" | "Commerce" | "Arts";
  gender: "MALE" | "FEMALE";
  email: string;
  phone: string;
  fatherName: string;
  motherName: string;
  fatherMobile: string;
  motherMobile: string;
  guardianPhone: string;
  bloodGroup: string;
  gpa: number;
  attendanceRate: string;
  tuitionStatus: "PAID" | "DUE";
  avatarInitials: string;
  avatarUrl?: string;
}

const FIRST_NAMES_MALE = [
  "Aria", "Tahmid", "Nafis", "Zayn", "Fahim", "Sajid", "Mahir", "Wasif",
  "Adnan", "Rayhan", "Tanvir", "Shakib", "Tamim", "Mushfiq", "Mustafiz",
  "Ehan", "Kazi", "Nabil", "Abrar", "Ayman", "Zayan", "Rohan", "Sami",
  "Sadman", "Asif"
];

const FIRST_NAMES_FEMALE = [
  "Ayesha", "Sadia", "Rida", "Olivia", "Sophia", "Anika", "Sanjida",
  "Miftahul", "Tasnim", "Sumaiya", "Tasmia", "Fariha", "Nusrat", "Samia",
  "Labiba", "Mahfuza", "Raihana", "Afia", "Humaira", "Mehzabin", "Nafisa",
  "Sabrina", "Tanjila", "Zarin", "Lamia"
];

const LAST_NAMES = [
  "Rahman", "Hasan", "Ahsan", "Malik", "Shahriar", "Islam", "Chowdhury",
  "Hossain", "Sami", "Ahmed", "Anjum", "Iqbal", "Rahim", "Tabassum",
  "Mahmud", "Zara", "Akter", "Jannat", "Khan", "Siddiqua", "Afreen",
  "Begum", "Kabir", "Haider", "Miah"
];

const BLOOD_GROUPS = ["A+", "B+", "O+", "AB+", "A-", "B-", "O-"];

const FATHER_MOBILE_PREFIXES = ["01711", "01811", "01911", "01611", "01712"];
const MOTHER_MOBILE_PREFIXES = ["01819", "01719", "01919", "01519", "01718"];

function generateAllStudents(): StudentRecord[] {
  const students: StudentRecord[] = [];
  let globalCount = 1000;
  const classRollCounters: Record<number, number> = {};

  for (let c = 1; c <= 12; c++) {
    const className = `Class ${c}`;
    const sections = ["Section A", "Section B", "Section C", "Section D", "Section E"];
    classRollCounters[c] = 0;

    sections.forEach((sec, sIdx) => {
      const secLetter = sec.charAt(sec.length - 1);
      for (let roll = 1; roll <= 25; roll++) {
        globalCount++;
        classRollCounters[c]++;

        const isFemale = (roll % 2 === 0);
        const firstName = isFemale
          ? FIRST_NAMES_FEMALE[(roll + c + sIdx) % FIRST_NAMES_FEMALE.length]
          : FIRST_NAMES_MALE[(roll + c + sIdx) % FIRST_NAMES_MALE.length];
        const lastName = LAST_NAMES[(roll * 3 + c + sIdx) % LAST_NAMES.length];
        const fullName = `${firstName} ${lastName}`;

        let group: "General" | "Science" | "Commerce" | "Arts" = "General";
        if (c >= 9) {
          if (secLetter === "A") group = "Science";
          else if (secLetter === "B") group = "Commerce";
          else group = "Arts";
        }

        const id = `SCHOLLEGE-C${String(c).padStart(2, "0")}-${secLetter}-${String(roll).padStart(2, "0")}`;
        const studentIdNumber = `SCH-2026-${globalCount}`;

        // Formatted roll: 261-CC-NNNN  (year 26, session 1, class 2-digit, roll 4-digit)
        const rollNo = `261-${String(c).padStart(2, "0")}-${String(classRollCounters[c]).padStart(4, "0")}`;

        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${c}${secLetter.toLowerCase()}${roll}@schollege.edu.bd`;
        const phone = `+880 1712-${String(globalCount).padStart(6, "0")}`;
        const fatherName = `Mr. Tariq ${lastName}`;
        const motherName = `Mrs. Nasrin ${lastName}`;
        const fMobilePrefix = FATHER_MOBILE_PREFIXES[(c + roll) % FATHER_MOBILE_PREFIXES.length];
        const mMobilePrefix = MOTHER_MOBILE_PREFIXES[(c + roll + 1) % MOTHER_MOBILE_PREFIXES.length];
        const fatherMobile = `+880 ${fMobilePrefix}-${String(globalCount).padStart(6, "0").slice(0, 6)}`;
        const motherMobile = `+880 ${mMobilePrefix}-${String(globalCount + 1).padStart(6, "0").slice(0, 6)}`;
        const guardianPhone = `+880 1819-${String(globalCount).padStart(6, "0")}`;
        const bloodGroup = BLOOD_GROUPS[(roll + c) % BLOOD_GROUPS.length];
        const gpaRaw = 3.50 + ((roll * 17 + c * 13) % 150) / 100;
        const gpa = Number(Math.min(gpaRaw, 5.0).toFixed(2));
        const attNum = 92 + ((roll * 11 + c) % 8);
        const attendanceRate = `${attNum}.${(roll % 9)}%`;
        const tuitionStatus: "PAID" | "DUE" = (roll % 5 === 0) ? "DUE" : "PAID";
        const avatarInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

        students.push({
          id, studentIdNumber, rollNo, name: fullName, className,
          sectionName: sec, group, gender: isFemale ? "FEMALE" : "MALE",
          email, phone, fatherName, motherName, fatherMobile, motherMobile,
          guardianPhone, bloodGroup, gpa, attendanceRate, tuitionStatus, avatarInitials,
        });
      }
    });
  }
  return students;
}

export const DEMO_ARIA_RAHMAN: StudentRecord = {
  id: "SCHOLLEGE-C12-A-03",
  studentIdNumber: "SCH-2026-1024",
  rollNo: "261-12-0003",
  name: "Aria Rahman",
  className: "Class 12",
  sectionName: "Section A",
  group: "Science",
  gender: "FEMALE",
  email: "aria.rahman.12a03@schollege.edu.bd",
  phone: "+880 1712-102400",
  fatherName: "Mr. Tariq Rahman",
  motherName: "Mrs. Nasrin Rahman",
  fatherMobile: "+880 1711-102401",
  motherMobile: "+880 1819-102402",
  guardianPhone: "+880 1819-102400",
  bloodGroup: "O+",
  gpa: 4.85,
  attendanceRate: "96.5%",
  tuitionStatus: "PAID",
  avatarInitials: "AR",
};

export const SCH_STUDENTS: StudentRecord[] = [DEMO_ARIA_RAHMAN, ...generateAllStudents()];

// --- Types from classes.ts ---

export interface SectionInfo {
  sectionName: string;
  capacity: number;
  studentCount: number;
  roomNumber: string;
  classTeacher: string;
}

export interface ClassInfo {
  classId: string;
  className: string;
  numericLevel: number;
  sections: SectionInfo[];
}

export const SCH_CLASSES: ClassInfo[] = Array.from({ length: 12 }, (_, i) => {
  const classNum = i + 1;
  const teachersA = [
    "Mrs. Farhana Begum", "Mr. Rafiqul Islam", "Dr. Farhana Yasmin", "Prof. Selina Begum",
    "Mr. Jahangir Alam", "Mrs. Roksana Parvin", "Dr. Mehedi Hasan", "Prof. Rokeya Sultan",
    "Mr. Shahadat Hossain", "Dr. Anisur Rahman", "Dr. Tanvir Hasan", "Dr. Maya Rahman"
  ];
  const teachersB = [
    "Mr. Kamrul Hasan", "Mrs. Syeda Akter", "Mr. Tariqul Islam", "Mrs. Asma Khatun",
    "Dr. Zubaida Nasreen", "Mr. Mahmud Hassan", "Mrs. Sultana Razia", "Mr. Rashedul Haque",
    "Dr. Tanvir Ahmed", "Mrs. Dilruba Khanom", "Dr. Alan Roberts", "Dr. Nusrat Jahan"
  ];
  const teachersC = [
    "Mrs. Hasina Begum", "Mr. Imran Khan", "Mrs. Mst. Fatema", "Mr. Kazi Arman",
    "Mrs. Nahid Parvin", "Mr. Mizanur Rahman", "Mrs. Monira Sultana", "Mr. Golam Kibria",
    "Dr. Maya Chen", "Mrs. Shamim Ara", "Dr. Rida Fariha", "Dr. Tahmid Hasan"
  ];
  const teachersD = [
    "Mr. Asif Iqbal", "Mrs. Sabrina Akter", "Dr. Kazi Nabil", "Mrs. Raihana Begum",
    "Mr. Zayan Malik", "Mrs. Tanjila Islam", "Dr. Abrar Hossain", "Mrs. Zarin Tasnim",
    "Mr. Rohan Sami", "Mrs. Lamia Tabassum", "Dr. Ayman Chowdhury", "Mrs. Afia Humaira"
  ];
  const teachersE = [
    "Mr. Sadman Sakib", "Mrs. Mehzabin Chowdhury", "Dr. Ehan Ahmed", "Mrs. Labiba Rahman",
    "Mr. Rayhan Kabir", "Mrs. Tasmia Jannat", "Dr. Kazi Haider", "Mrs. Sumaiya Akter",
    "Mr. Wasif Anjum", "Mrs. Miftahul Jannat", "Dr. Zayn Ahsan", "Mrs. Ayesha Siddiqua"
  ];

  return {
    classId: `CLASS-${classNum}`,
    className: `Class ${classNum}`,
    numericLevel: classNum,
    sections: [
      { sectionName: "Section A", capacity: 25, studentCount: 25, roomNumber: `Room ${100 + classNum * 10 + 1}`, classTeacher: teachersA[i] },
      { sectionName: "Section B", capacity: 25, studentCount: 25, roomNumber: `Room ${100 + classNum * 10 + 2}`, classTeacher: teachersB[i] },
      { sectionName: "Section C", capacity: 25, studentCount: 25, roomNumber: `Room ${100 + classNum * 10 + 3}`, classTeacher: teachersC[i] },
      { sectionName: "Section D", capacity: 25, studentCount: 25, roomNumber: `Room ${100 + classNum * 10 + 4}`, classTeacher: teachersD[i] },
      { sectionName: "Section E", capacity: 25, studentCount: 25, roomNumber: `Room ${100 + classNum * 10 + 5}`, classTeacher: teachersE[i] },
    ],
  };
});

// --- Types from curriculum.ts ---

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
  "Class 1": { className: "Class 1", level: "PRIMARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-101", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "ENG-101", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "MATH-101", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "ART-101", name: "Arts & Crafts", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
    { code: "PED-101", name: "Physical Education & Health", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
  ] } },
  "Class 2": { className: "Class 2", level: "PRIMARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-102", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "ENG-102", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "MATH-102", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "ART-102", name: "Arts & Crafts", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
  ] } },
  "Class 3": { className: "Class 3", level: "PRIMARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-103", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "ENG-103", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "MATH-103", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "SCI-103", name: "Elementary Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BGS-103", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "REL-103", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
  ] } },
  "Class 4": { className: "Class 4", level: "PRIMARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-104", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "ENG-104", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "MATH-104", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "SCI-104", name: "Elementary Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BGS-104", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "REL-104", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
  ] } },
  "Class 5": { className: "Class 5", level: "PRIMARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-105", name: "Amar Bangla Bhasha", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "ENG-105", name: "English for Today", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "MATH-105", name: "Elementary Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "SCI-105", name: "Elementary Science & Technology", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BGS-105", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "REL-105", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
  ] } },
  "Class 6": { className: "Class 6", level: "JUNIOR_SECONDARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-106A", name: "Bangla 1st Paper (Sahitya)", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BAN-106B", name: "Bangla 2nd Paper (Vyakaran)", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
    { code: "ENG-106A", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "ENG-106B", name: "English 2nd Paper (Grammar)", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
    { code: "MATH-106", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "SCI-106", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BGS-106", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "ICT-106", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
    { code: "REL-106", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
  ] } },
  "Class 7": { className: "Class 7", level: "JUNIOR_SECONDARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-107A", name: "Bangla 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BAN-107B", name: "Bangla 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
    { code: "ENG-107A", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "ENG-107B", name: "English 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
    { code: "MATH-107", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "SCI-107", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BGS-107", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "ICT-107", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
    { code: "REL-107", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
  ] } },
  "Class 8": { className: "Class 8", level: "JUNIOR_SECONDARY", medium: "BANGLA_MEDIUM", subjects: { DEFAULT: [
    { code: "BAN-108A", name: "Bangla 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BAN-108B", name: "Bangla 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
    { code: "ENG-108A", name: "English 1st Paper", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "ENG-108B", name: "English 2nd Paper", category: "COMPULSORY", fullMarks: 50, theoryMarks: 50, creditHours: 2 },
    { code: "MATH-108", name: "General Mathematics", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 4 },
    { code: "SCI-108", name: "General Science", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "BGS-108", name: "Bangladesh & Global Studies", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
    { code: "ICT-108", name: "Information & Communication Tech", category: "COMPULSORY", fullMarks: 50, theoryMarks: 25, practicalMarks: 25, creditHours: 2 },
    { code: "REL-108", name: "Islam & Moral Education", category: "COMPULSORY", fullMarks: 100, theoryMarks: 100, creditHours: 3 },
  ] } },
  "Class 9": { className: "Class 9", level: "SECONDARY", medium: "BANGLA_MEDIUM", groups: ["Science", "Commerce", "Arts"], subjects: {
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
  } },
  "Class 10": { className: "Class 10", level: "SECONDARY", medium: "BANGLA_MEDIUM", groups: ["Science", "Commerce", "Arts"], subjects: {
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
  } },
  "Class 11": { className: "Class 11", level: "HIGHER_SECONDARY", medium: "BANGLA_MEDIUM", groups: ["Science", "Commerce", "Arts"], subjects: {
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
  } },
  "Class 12": { className: "Class 12", level: "HIGHER_SECONDARY", medium: "BANGLA_MEDIUM", groups: ["Science", "Commerce", "Arts"], subjects: {
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
  } },
};

// --- Types from Notice/notices.ts ---

export interface CampusNotice {
  id: number;
  title: string;
  date: string;
  category: "EXAMS" | "ACADEMIC" | "FEES" | "HOLIDAY";
  publisher: string;
  content: string;
  attachments: string[];
  urgent: boolean;
}

export const SCH_NOTICES: CampusNotice[] = [
  {
    id: 1,
    title: "Mid-Term Physics & Chemistry Exam Schedule Released",
    date: "Aug 05, 2026",
    category: "EXAMS",
    publisher: "Academic Control Board",
    content: "The mid-term examination routine for Class 12 Science stream has been finalized. Mid-terms begin on August 14, 2026. Hall tickets and seat plans can be downloaded from the student portal.",
    attachments: ["Exam_Schedule_Class12.pdf", "Admit_Card_Instructions.pdf"],
    urgent: true,
  },
  {
    id: 2,
    title: "Submission Deadline Extension for Chemistry Lab Reports",
    date: "Aug 03, 2026",
    category: "ACADEMIC",
    publisher: "Dept of Chemistry",
    content: "All Class 12-A students are informed that the submission deadline for Chemistry Practical Experiment #04 has been extended to August 10, 2026. Submit via student assignment portal.",
    attachments: ["Chemistry_Lab_Guide.pdf"],
    urgent: false,
  },
  {
    id: 3,
    title: "Semester 2 Tuition Fee Payment Deadline Notice",
    date: "Jul 28, 2026",
    category: "FEES",
    publisher: "Accounts & Fees Office",
    content: "Students are advised to clear Semester 2 tuition dues before August 20, 2026, to avoid a 5% late fee penalty on clearance receipts.",
    attachments: ["Tuition_Fee_Structure.pdf"],
    urgent: false,
  },
  {
    id: 4,
    title: "National Independence Day Holiday Notice",
    date: "Jul 20, 2026",
    category: "HOLIDAY",
    publisher: "Principal's Office",
    content: "The institution will remain closed on August 15, 2026, in observance of National Independence Day. Regular classes resume August 16.",
    attachments: [],
    urgent: false,
  },
];

// --- Types from Admin/notifications.ts ---

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "NOTICE" | "TRANSACTION" | "REGISTRATION" | "SYSTEM";
  read: boolean;
}

export const SCH_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Student Admission",
    message: "Aria Rahman enrolled in Class 12 Science stream.",
    timestamp: "10 mins ago",
    type: "REGISTRATION",
    read: false,
  },
  {
    id: "notif-2",
    title: "Tuition Fee Received",
    message: "৳48,500 received via bKash gateway.",
    timestamp: "45 mins ago",
    type: "TRANSACTION",
    read: false,
  },
  {
    id: "notif-3",
    title: "Mid-Term Examination Routine",
    message: "Class 12 mid-term routine approved by Principal.",
    timestamp: "2 hours ago",
    type: "NOTICE",
    read: true,
  },
];


