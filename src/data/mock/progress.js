/** @type {import('../models/Progress').User} */
export const USER = { name: "Marina", streak: 14, weeklyGoal: 8, weeklyDone: 5 };

export const PROGRESS_TOTALS = {
  hoursStudied: 41,
  questionsAnswered: 312,
  accuracyRate: 74,
};

export const UPCOMING_EXAMS = [
  { id: "e1", title: "Prova Prática de Anatomia", date: "Daqui a 3 dias", discipline: "Anatomia" },
  { id: "e2", title: "P1 de Bioquímica", date: "Daqui a 7 dias", discipline: "Bioquímica" },
];

export const REVIEWS = [
  { id: "r1", title: "Ciclo de Krebs", count: 12, discipline: "Bioquímica" },
  { id: "r2", title: "Sistema Nervoso", count: 8, discipline: "Anatomia" },
];
