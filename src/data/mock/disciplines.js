// Dados mock — sem conteúdo médico real, apenas estrutura para desenvolvimento.
// Ao adicionar disciplinas de verdade, usar fontes acadêmicas confiáveis.
import {
  Bone, HeartPulse, Layers, FlaskConical, Dna, Bug, ShieldCheck,
  Microscope, Droplet, Pill, Egg, Activity, TestTube, Beaker,
  Sparkles, ScanLine, Biohazard,
} from "lucide-react";

/** @type {import('../models/Discipline').Discipline[]} */
export const DISCIPLINES = [
  { id: "anatomia", name: "Anatomia", icon: Bone, category: "Ciências Básicas", progress: 62, topicsCount: 24 },
  { id: "fisiologia", name: "Fisiologia", icon: HeartPulse, category: "Ciências Básicas", progress: 45, topicsCount: 20 },
  { id: "histologia", name: "Histologia", icon: Layers, category: "Ciências Básicas", progress: 30, topicsCount: 16 },
  { id: "bioquimica", name: "Bioquímica", icon: FlaskConical, category: "Ciências Básicas", progress: 78, topicsCount: 22 },
  { id: "biologia-molecular", name: "Biologia Molecular", icon: Dna, category: "Ciências Básicas", progress: 20, topicsCount: 18 },
  { id: "genetica", name: "Genética", icon: Dna, category: "Ciências Básicas", progress: 55, topicsCount: 19 },
  { id: "microbiologia", name: "Microbiologia", icon: Bug, category: "Ciências Biomédicas", progress: 40, topicsCount: 26 },
  { id: "imunologia", name: "Imunologia", icon: ShieldCheck, category: "Ciências Biomédicas", progress: 33, topicsCount: 18 },
  { id: "parasitologia", name: "Parasitologia", icon: Bug, category: "Ciências Biomédicas", progress: 12, topicsCount: 21 },
  { id: "patologia", name: "Patologia", icon: Microscope, category: "Ciências Biomédicas", progress: 8, topicsCount: 23 },
  { id: "hematologia", name: "Hematologia", icon: Droplet, category: "Ciências Biomédicas", progress: 0, topicsCount: 15 },
  { id: "farmacologia", name: "Farmacologia", icon: Pill, category: "Ciências Biomédicas", progress: 5, topicsCount: 20 },
  { id: "citologia", name: "Citologia", icon: Layers, category: "Ciências Básicas", progress: 70, topicsCount: 12 },
  { id: "embriologia", name: "Embriologia", icon: Egg, category: "Ciências Básicas", progress: 18, topicsCount: 14 },
  { id: "epidemiologia", name: "Epidemiologia", icon: Activity, category: "Saúde Coletiva", progress: 0, topicsCount: 13 },
  { id: "analises-clinicas", name: "Análises Clínicas", icon: TestTube, category: "Prática Laboratorial", progress: 0, topicsCount: 25 },
  { id: "toxicologia", name: "Toxicologia", icon: Beaker, category: "Ciências Biomédicas", progress: 0, topicsCount: 11 },
  { id: "biomedicina-estetica", name: "Biomedicina Estética", icon: Sparkles, category: "Prática Laboratorial", progress: 0, topicsCount: 17 },
  { id: "imagenologia", name: "Imagenologia", icon: ScanLine, category: "Prática Laboratorial", progress: 0, topicsCount: 14 },
  { id: "biosseguranca", name: "Biossegurança", icon: Biohazard, category: "Prática Laboratorial", progress: 25, topicsCount: 9 },
];
