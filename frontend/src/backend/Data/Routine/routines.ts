export interface RoutineItem {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  isLive?: boolean;
}

export const SCH_ROUTINE_DATA: Record<string, RoutineItem[]> = {
  Sunday: [
    { time: "08:30 AM - 09:30 AM", subject: "Higher Mathematics", teacher: "Prof. Sarah Jenkins", room: "Room 201" },
    { time: "09:30 AM - 10:30 AM", subject: "General Chemistry", teacher: "Dr. Michael Vance", room: "Chem Lab 01" },
    { time: "10:45 AM - 11:45 AM", subject: "English Literature", teacher: "Ms. Elena Rostova", room: "Room 105" },
  ],
  Monday: [
    { time: "08:30 AM - 09:30 AM", subject: "Physics II", teacher: "Dr. Robert Chen", room: "Room 304" },
    { time: "09:30 AM - 10:30 AM", subject: "Computer Science", teacher: "Eng. Alex Mercer", room: "Lab 02" },
    { time: "11:30 AM - 12:30 PM", subject: "Cellular Biology", teacher: "Dr. Amanda Hayes", room: "Bio Lab 03" },
  ],
  Tuesday: [
    { time: "08:30 AM - 09:30 AM", subject: "Higher Mathematics", teacher: "Prof. Sarah Jenkins", room: "Room 201" },
    { time: "10:00 AM - 11:00 AM", subject: "English Composition", teacher: "Ms. Elena Rostova", room: "Room 105" },
    { time: "01:30 PM - 02:30 PM", subject: "Physics II Lab", teacher: "Dr. Robert Chen", room: "Physics Lab" },
  ],
  Wednesday: [
    { time: "09:30 AM - 10:30 AM", subject: "General Chemistry Lab", teacher: "Dr. Michael Vance", room: "Chem Lab 01" },
    { time: "11:30 AM - 12:30 PM", subject: "Cellular Biology", teacher: "Dr. Amanda Hayes", room: "Room 304" },
  ],
  Thursday: [
    { time: "11:30 AM - 12:30 PM", subject: "Physics II - Electromagnetism", teacher: "Dr. Robert Chen", room: "Room 304", isLive: true },
    { time: "01:30 PM - 02:30 PM", subject: "Higher Mathematics", teacher: "Prof. Sarah Jenkins", room: "Room 201" },
    { time: "02:45 PM - 04:00 PM", subject: "Computer Science & Algorithms", teacher: "Eng. Alex Mercer", room: "Lab 02" },
  ],
};
