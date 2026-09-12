const disciplineFiles = import.meta.glob('../content/disciplines/*/discipline.json', { eager: true });
// ATENÇÃO: topicsIndex é gerado via script (scratch/generate_topics_index.cjs) para evitar inflar o bundle.
// Se adicionar/remover tópicos ou mudar meta-dados, rode o script novamente.
import topicsIndex from '../content/topics-index.json';
const topicContentLoaders = import.meta.glob('../content/disciplines/*/topics/*/topic.json');
const questionLoaders = import.meta.glob('../content/disciplines/*/topics/*/questions.json');

export function getDisciplines() {
  const discs = [];
  for (const path in disciplineFiles) {
    discs.push(disciplineFiles[path].default || disciplineFiles[path]);
  }
  return discs.sort((a, b) => a.name.localeCompare(b.name));
}

export function getDisciplineById(id) {
  return getDisciplines().find(d => d.id === id);
}

export function getTopicsByDiscipline(disciplineId) {
  const topics = [];
  for (const path in topicsIndex) {
    const topic = topicsIndex[path];
    if (topic.discipline_id === disciplineId) {
      topics.push(topic);
    }
  }
  return topics.sort((a, b) => a.order_index - b.order_index);
}

export function getAllTopics() {
  const topics = [];
  for (const path in topicsIndex) {
    topics.push(topicsIndex[path]);
  }
  return topics.sort((a, b) => a.order_index - b.order_index);
}

export async function getTopicContent(topicId) {
  for (const path in topicContentLoaders) {
    const meta = topicsIndex[path];
    if (meta && meta.id === topicId) {
      const mod = await topicContentLoaders[path]();
      return mod.default || mod;
    }
  }
  return null;
}

export async function getTopicModulesAndLessons(topicId) {
  const topic = await getTopicContent(topicId);
  if (topic && topic.modules) {
    // Clone to prevent shared state mutation (P0.3)
    return structuredClone(topic.modules);
  }
  return [];
}

export async function getQuizQuestions(topicId, isSimulado = false, count = 10) {
  const allQs = [];
  for (const path in questionLoaders) {
    const mod = await questionLoaders[path]();
    const qs = mod.default || mod;
    allQs.push(...qs.filter(q => q.topic_id === topicId));
  }

  if (isSimulado) {
    return allQs.sort(() => Math.random() - 0.5).slice(0, count);
  }
  return allQs.slice(0, count);
}

export async function getAllQuestionsByDiscipline(disciplineId) {
  const allQs = [];
  for (const path in questionLoaders) {
    const mod = await questionLoaders[path]();
    const qs = mod.default || mod;
    allQs.push(...qs.filter(q => q.discipline_id === disciplineId));
  }
  return allQs;
}
