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
