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
