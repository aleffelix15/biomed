/** @type {Record<string, import('../models/Topic').Topic[]>} */
export const TOPICS = {
  bioquimica: [
    { id: "t1", title: "Estrutura e função de proteínas", status: "concluido", hasContent: true },
    { id: "t2", title: "Enzimas e cinética enzimática", status: "concluido", hasContent: true },
    { id: "t3", title: "Metabolismo de carboidratos", status: "em-andamento", hasContent: true },
    { id: "t4", title: "Ciclo de Krebs", status: "pendente", hasContent: true },
    { id: "t5", title: "Metabolismo lipídico", status: "pendente", hasContent: true },
  ],
  anatomia: [
    { id: "t1", title: "Sistema esquelético axial", status: "concluido", hasContent: true },
    { id: "t2", title: "Sistema muscular", status: "em-andamento", hasContent: true },
    { id: "t3", title: "Sistema cardiovascular", status: "pendente", hasContent: true },
  ],
};

/** Gera tópicos genéricos para disciplinas ainda sem conteúdo mock detalhado. */
export const genericTopics = (count) =>
  Array.from({ length: Math.min(count, 6) }, (_, i) => ({
    id: `g${i}`,
    title: `Tópico ${i + 1}`,
    status: i === 0 ? "em-andamento" : "pendente",
  }));
