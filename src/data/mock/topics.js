/** @type {Record<string, import('../models/Topic').Topic[]>} */
export const TOPICS = {
  bioquimica: [
    { id: "t1", title: "Estrutura e função de proteínas", status: "concluido" },
    { id: "t2", title: "Enzimas e cinética enzimática", status: "concluido" },
    { id: "t3", title: "Metabolismo de carboidratos", status: "em-andamento" },
    { id: "t4", title: "Ciclo de Krebs", status: "pendente" },
    { id: "t5", title: "Metabolismo lipídico", status: "pendente" },
  ],
  anatomia: [
    { id: "t1", title: "Sistema esquelético axial", status: "concluido" },
    { id: "t2", title: "Sistema muscular", status: "em-andamento" },
    { id: "t3", title: "Sistema cardiovascular", status: "pendente" },
  ],
};

/** Gera tópicos genéricos para disciplinas ainda sem conteúdo mock detalhado. */
export const genericTopics = (count) =>
  Array.from({ length: Math.min(count, 6) }, (_, i) => ({
    id: `g${i}`,
    title: `Tópico ${i + 1}`,
    status: i === 0 ? "em-andamento" : "pendente",
  }));
