export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: "HOLIDAY" | "EXAM" | "ACADEMIC" | "EVENT";
  description: string;
}

export const SCH_CALENDAR_HOLIDAYS: CalendarEvent[] = [
  { id: "h1", title: "Language Martyrs' Day & Int. Mother Language Day", date: "2026-02-21", type: "HOLIDAY", description: "National Holiday - Tribute to language martyrs." },
  { id: "h2", title: "Shab-e-Barat", date: "2026-02-25", type: "HOLIDAY", description: "Religious Holiday (subject to moon sighting)." },
  { id: "h3", title: "National Children's Day & Sheikh Mujibur Rahman's Birthday", date: "2026-03-17", type: "HOLIDAY", description: "National Observance." },
  { id: "h4", title: "Independence & National Day", date: "2026-03-26", type: "HOLIDAY", description: "National Holiday - Flag hoisting & cultural events." },
  { id: "h5", title: "Shab-e-Qadr & Eid-ul-Fitr Vacation", date: "2026-03-18", type: "HOLIDAY", description: "Institutional Vacation." },
  { id: "h6", title: "Bengali New Year (Pohela Boishakh)", date: "2026-04-14", type: "HOLIDAY", description: "Cultural Celebration & Boishakhi Mela." },
  { id: "h7", title: "May Day", date: "2026-05-01", type: "HOLIDAY", description: "International Workers' Day." },
  { id: "h8", title: "Buddha Purnima", date: "2026-05-31", type: "HOLIDAY", description: "Religious Holiday." },
  { id: "h9", title: "Eid-ul-Adha Vacation", date: "2026-05-26", type: "HOLIDAY", description: "Institutional Vacation." },
  { id: "h10", title: "Ashura", date: "2026-06-25", type: "HOLIDAY", description: "Religious Observance." },
  { id: "h11", title: "National Mourning Day", date: "2026-08-15", type: "HOLIDAY", description: "National Holiday." },
  { id: "h12", title: "Janmashtami", date: "2026-09-04", type: "HOLIDAY", description: "Religious Holiday." },
  { id: "h13", title: "Eid-e-Miladunnabi", date: "2026-09-25", type: "HOLIDAY", description: "Religious Holiday." },
  { id: "h14", title: "Durga Puja (Bijoya Dashami)", date: "2026-10-20", type: "HOLIDAY", description: "Religious Holiday." },
  { id: "h15", title: "Victory Day", date: "2026-12-16", type: "HOLIDAY", description: "National Holiday - Victory Day celebrations." },
  { id: "h16", title: "Christmas Day", date: "2026-12-25", type: "HOLIDAY", description: "Religious Holiday." },
];
