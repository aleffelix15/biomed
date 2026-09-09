import { TestTube, Microscope, ShieldCheck, Syringe, ClipboardList, Activity, FlaskConical } from "lucide-react";

export const LAB_SECTIONS = [
  { id: "tecnicas", title: "Técnicas Laboratoriais", desc: "Protocolos e boas práticas de bancada", icon: TestTube },
  { id: "equipamentos", title: "Equipamentos", desc: "Manuseio e princípios de funcionamento", icon: Microscope },
  { id: "biosseguranca", title: "Biossegurança", desc: "Normas, EPIs e classificação de risco", icon: ShieldCheck },
  { id: "exames", title: "Exames", desc: "Indicações e coleta", icon: Syringe },
  { id: "procedimentos", title: "Procedimentos", desc: "Passo a passo de rotinas laboratoriais", icon: ClipboardList },
  { id: "interpretacao", title: "Interpretação de Resultados", desc: "Valores de referência e correlação clínica", icon: Activity },
  { id: "casos", title: "Casos Práticos", desc: "Cenários aplicados para treino de raciocínio", icon: FlaskConical },
];
