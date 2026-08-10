// Student Roll / ID Format: [Period]-[Class]-[Serial] (e.g. "261-01-0001")
//   [Period] (261) = Enrollment Period / Session (26 = Year 2026, 1 = Session Code: 1=Spring, 2=Summer, 3=Fall)
//   [Class]  (01)  = Class Level zero-padded (01 to 12)
//   [Serial] (0001)= Sequential student roll serial number within class
// Examples: 261-01-0001 (Class 1, Roll 1) | 261-12-0003 (Class 12, Roll 3)

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
  fatherMobile: string;     // NEW
  motherMobile: string;     // NEW
  guardianPhone: string;
  bloodGroup: string;
  gpa: number;
  attendanceRate: string;
  tuitionStatus: "PAID" | "DUE";
  avatarInitials: string;
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

// Mobile prefixes pool for variety
const FATHER_MOBILE_PREFIXES = ["01711", "01811", "01911", "01611", "01712"];
const MOTHER_MOBILE_PREFIXES = ["01819", "01719", "01919", "01519", "01718"];

function generateAllStudents(): StudentRecord[] {
  const students: StudentRecord[] = [];
  let globalCount = 1000;

  // Track sequential roll per class (across all sections)
  const classRollCounters: Record<number, number> = {};

  for (let c = 1; c <= 12; c++) {
    const className = `Class ${c}`;
    const sections = ["Section A", "Section B", "Section C"];
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

        const id = `SCHOLLEGE-C${String(c).padStart(2, '0')}-${secLetter}-${String(roll).padStart(2, '0')}`;
        const studentIdNumber = `SCH-2026-${globalCount}`;

        // Formatted roll: 261-CC-NNNN  (year 26, session 1, class 2-digit, roll 4-digit)
        const rollNo = `261-${String(c).padStart(2, '0')}-${String(classRollCounters[c]).padStart(4, '0')}`;

        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${c}${secLetter.toLowerCase()}${roll}@schollege.edu.bd`;
        const phone = `+880 1712-${String(globalCount).padStart(6, '0')}`;
        const fatherName = `Mr. Tariq ${lastName}`;
        const motherName = `Mrs. Nasrin ${lastName}`;

        // Father & mother mobile numbers
        const fMobilePrefix = FATHER_MOBILE_PREFIXES[(c + roll) % FATHER_MOBILE_PREFIXES.length];
        const mMobilePrefix = MOTHER_MOBILE_PREFIXES[(c + roll + 1) % MOTHER_MOBILE_PREFIXES.length];
        const fatherMobile = `+880 ${fMobilePrefix}-${String(globalCount).padStart(6, '0').slice(0, 6)}`;
        const motherMobile = `+880 ${mMobilePrefix}-${String(globalCount + 1).padStart(6, '0').slice(0, 6)}`;

        const guardianPhone = `+880 1819-${String(globalCount).padStart(6, '0')}`;
        const bloodGroup = BLOOD_GROUPS[(roll + c) % BLOOD_GROUPS.length];

        const gpaRaw = 3.50 + ((roll * 17 + c * 13) % 150) / 100;
        const gpa = Number(Math.min(gpaRaw, 5.0).toFixed(2));

        const attNum = 92 + ((roll * 11 + c) % 8);
        const attendanceRate = `${attNum}.${(roll % 9)}%`;

        const tuitionStatus: "PAID" | "DUE" = (roll % 5 === 0) ? "DUE" : "PAID";
        const avatarInitials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

        students.push({
          id,
          studentIdNumber,
          rollNo,
          name: fullName,
          className,
          sectionName: sec,
          group,
          gender: isFemale ? "FEMALE" : "MALE",
          email,
          phone,
          fatherName,
          motherName,
          fatherMobile,
          motherMobile,
          guardianPhone,
          bloodGroup,
          gpa,
          attendanceRate,
          tuitionStatus,
          avatarInitials,
        });
      }
    });
  }

  return students;
}

export const STUDENTS: StudentRecord[] = generateAllStudents();
export const SCH_STUDENTS: StudentRecord[] = STUDENTS;



