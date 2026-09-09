import { PencilLine, Layers, HelpCircle, FileCheck2, CalendarClock, Target } from "lucide-react";

export const STUDY_MODES = [
  { id: "resumos", title: "Resumos", desc: "Sínteses por tópico, organizadas por disciplina", icon: PencilLine, count: 12 },
  { id: "flashcards", title: "Flashcards", desc: "Repetição ativa dos conceitos-chave", icon: Layers, count: 34 },
  { id: "questoes", title: "Questões", desc: "Banco de questões comentadas", icon: HelpCircle, count: 58 },
  { id: "simulados", title: "Simulados", desc: "Provas cronometradas por disciplina", icon: FileCheck2, count: 3 },
  { id: "revisao", title: "Revisão Espaçada", desc: "Fila de revisão baseada no seu desempenho", icon: CalendarClock, count: 7 },
  { id: "modo-prova", title: "Modo Prova", desc: "Simulação de avaliação, sem pausas", icon: Target, count: 2 },
];
