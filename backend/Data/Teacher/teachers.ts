export interface TeacherRecord {
  id: string;
  teacherIdNumber: string;
  name: string;
  designation: string;
  department: string;
  subjectSpecialization: string;
  assignedClass: string;
  assignedSection: string;
  gender: "MALE" | "FEMALE";
  email: string;
  phone: string;
  joiningYear: number;
  qualification: string;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  isHOD?: boolean;
  avatarInitials: string;
  avatarUrl: string;
  officeHours?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
  // Payment & Payroll Columns
  bankName?: string;
  bankAccountNo?: string;
  tinNumber?: string;
  payGrade?: string;
  monthlyBaseSalary?: number;
  houseRentAllowance?: number;
  medicalAllowance?: number;
  totalSalaryReceived?: number;
  totalExpensesSpent?: number;
  netDisbursedBalance?: number;
}

export const TEACHERS: TeacherRecord[] = [
  {
    id: "TCH-001",
    teacherIdNumber: "SCH-FAC-1001",
    name: "Prof. Dr. Sarah Jenkins",
    designation: "Head of Department (HOD) & Chair",
    department: "Higher Mathematics",
    subjectSpecialization: "Higher Mathematics Curriculum Supervision",
    assignedClass: "NONE (Dept Head - Admin Only)",
    assignedSection: "NONE",
    gender: "FEMALE",
    email: "highermathematics.hod@schollege.edu.bd",
    phone: "+880 1711-200101",
    joiningYear: 2010,
    qualification: "Ph.D. in Applied Mathematics",
    status: "ACTIVE",
    isHOD: true,
    avatarInitials: "SJ",
    avatarUrl: "/images/avatars/avatar_09.svg",
    officeHours: "Sun-Thu • 02:30 PM - 04:00 PM",
    bloodGroup: "O+",
    emergencyContact: "+880 1819-482019",
    address: "Dhanmondi R/A, Dhaka",
  },
  {
    id: "TCH-002",
    teacherIdNumber: "SCH-FAC-1002",
    name: "Dr. Robert Chen",
    designation: "Head of Department (HOD) & Chair",
    department: "Physics",
    subjectSpecialization: "Physics Curriculum & Lab Supervision",
    assignedClass: "Class 12",
    assignedSection: "Section A",
    gender: "MALE",
    email: "robert.chen@schollege.edu.bd",
    phone: "+880 1711-200102",
    joiningYear: 2012,
    qualification: "Ph.D. in Theoretical Physics",
    status: "ACTIVE",
    isHOD: true,
    avatarInitials: "RC",
    avatarUrl: "/images/avatars/avatar_02.svg",
    officeHours: "Sun-Thu • 02:30 PM - 04:00 PM",
    bloodGroup: "B+",
    emergencyContact: "+880 1711-203948",
    address: "Mirpur DOHS, Dhaka",
  },
  {
    id: "TCH-003",
    teacherIdNumber: "SCH-FAC-1003",
    name: "Prof. Dr. Maya Rahman",
    designation: "Head of Department (HOD) & Chair",
    department: "Chemistry",
    subjectSpecialization: "Organic & Physical Chemistry Supervision",
    assignedClass: "NONE (Dept Head - Admin Only)",
    assignedSection: "NONE",
    gender: "FEMALE",
    email: "chemistry.hod@schollege.edu.bd",
    phone: "+880 1711-200103",
    joiningYear: 2014,
    qualification: "Ph.D. in Chemistry",
    status: "ACTIVE",
    isHOD: true,
    avatarInitials: "MR",
    avatarUrl: "/images/avatars/avatar_11.svg",
    officeHours: "Sun-Thu • 01:30 PM - 03:00 PM",
    bloodGroup: "A+",
    emergencyContact: "+880 1711-200103",
    address: "Uttara Sector 4, Dhaka",
  },
  {
    id: "TCH-004",
    teacherIdNumber: "SCH-FAC-1004",
    name: "Prof. Dr. Nusrat Jahan",
    designation: "Head of Department (HOD) & Chair",
    department: "Biology",
    subjectSpecialization: "Botany & Zoology Department Supervision",
    assignedClass: "NONE (Dept Head - Admin Only)",
    assignedSection: "NONE",
    gender: "FEMALE",
    email: "biology.hod@schollege.edu.bd",
    phone: "+880 1711-200104",
    joiningYear: 2015,
    qualification: "Ph.D. in Biochemistry",
    status: "ACTIVE",
    isHOD: true,
    avatarInitials: "NJ",
    avatarUrl: "/images/avatars/avatar_12.svg",
    officeHours: "Sun-Thu • 02:00 PM - 03:30 PM",
    bloodGroup: "AB+",
    emergencyContact: "+880 1711-200104",
    address: "Gulshan 2, Dhaka",
  },
  {
    id: "TCH-005",
    teacherIdNumber: "SCH-FAC-1005",
    name: "Eng. Alex Mercer",
    designation: "Lecturer & Lab Coordinator",
    department: "ICT & Computer Science",
    subjectSpecialization: "Data Structures & Python Programming",
    assignedClass: "Class 12",
    assignedSection: "Section C",
    gender: "MALE",
    email: "alex.mercer@schollege.edu.bd",
    phone: "+880 1610-293847",
    joiningYear: 2020,
    qualification: "B.Sc. in CSE (BUET)",
    status: "ACTIVE",
    isHOD: false,
    avatarInitials: "AM",
    avatarUrl: "/images/avatars/avatar_04.svg",
    officeHours: "Sun-Thu • 03:00 PM - 04:30 PM",
    bloodGroup: "O+",
    emergencyContact: "+880 1610-293847",
    address: "Banani, Dhaka",
  },
  {
    id: "TCH-006",
    teacherIdNumber: "SCH-FAC-1006",
    name: "Prof. Mrs. Farhana Begum",
    designation: "Head of Department (HOD) & Chair",
    department: "Bangla",
    subjectSpecialization: "Bangla Language & Literature Supervision",
    assignedClass: "NONE (Dept Head - Admin Only)",
    assignedSection: "NONE",
    gender: "FEMALE",
    email: "bangla.hod@schollege.edu.bd",
    phone: "+880 1711-200106",
    joiningYear: 2011,
    qualification: "M.A. & Ph.D. in Bangla Literature",
    status: "ACTIVE",
    isHOD: true,
    avatarInitials: "FB",
    avatarUrl: "/images/avatars/avatar_13.svg",
    officeHours: "Sun-Thu • 02:00 PM - 03:30 PM",
    bloodGroup: "B+",
    emergencyContact: "+880 1711-200106",
    address: "Lalmatia, Dhaka",
  },
  {
    id: "TCH-007",
    teacherIdNumber: "SCH-FAC-1007",
    name: "Prof. David Wilson",
    designation: "Head of Department (HOD) & Chair",
    department: "English",
    subjectSpecialization: "English Literature & Communication Supervision",
    assignedClass: "NONE (Dept Head - Admin Only)",
    assignedSection: "NONE",
    gender: "MALE",
    email: "english.hod@schollege.edu.bd",
    phone: "+880 1711-200107",
    joiningYear: 2009,
    qualification: "M.A. in English Literature",
    status: "ACTIVE",
    isHOD: true,
    avatarInitials: "DW",
    avatarUrl: "/images/avatars/avatar_05.svg",
    officeHours: "Sun-Thu • 02:30 PM - 04:00 PM",
    bloodGroup: "A-",
    emergencyContact: "+880 1711-200107",
    address: "Baridhara DOHS, Dhaka",
  },
  {
    id: "TCH-008",
    teacherIdNumber: "SCH-FAC-1008",
    name: "Prof. Mr. Kazi Mahmud",
    designation: "Head of Department (HOD) & Chair",
    department: "Accounting & Finance",
    subjectSpecialization: "Accounting, Finance & Commerce Supervision",
    assignedClass: "NONE (Dept Head - Admin Only)",
    assignedSection: "NONE",
    gender: "MALE",
    email: "accounting.hod@schollege.edu.bd",
    phone: "+880 1711-200108",
    joiningYear: 2013,
    qualification: "MBA & Ph.D. in Finance",
    status: "ACTIVE",
    isHOD: true,
    avatarInitials: "KM",
    avatarUrl: "/images/avatars/avatar_06.svg",
    officeHours: "Sun-Thu • 01:30 PM - 03:00 PM",
    bloodGroup: "O+",
    emergencyContact: "+880 1711-200108",
    address: "Motijheel C/A, Dhaka",
  },
];

export const SCH_TEACHERS = TEACHERS;
