const disciplineFiles = import.meta.glob('../content/disciplines/*/discipline.json', { eager: true });
const topicMetaFiles = import.meta.glob('../content/disciplines/*/topics/*/topic.json', { eager: true });
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
  for (const path in topicMetaFiles) {
    const topic = topicMetaFiles[path].default || topicMetaFiles[path];
    if (topic.discipline_id === disciplineId) {
      // Return only lightweight meta fields to avoid keeping heavy markdown in memory
      topics.push({
        id: topic.id,
        discipline_id: topic.discipline_id,
        title: topic.title,
        order_index: topic.order_index,
        has_content: topic.has_content
      });
    }
  }
  return topics.sort((a, b) => a.order_index - b.order_index);
}

export function getAllTopics() {
  const topics = [];
  for (const path in topicMetaFiles) {
    const topic = topicMetaFiles[path].default || topicMetaFiles[path];
    topics.push({
      id: topic.id,
      discipline_id: topic.discipline_id,
      title: topic.title,
      order_index: topic.order_index,
      has_content: topic.has_content
    });
  }
  return topics.sort((a, b) => a.order_index - b.order_index);
}

export async function getTopicContent(topicId) {
  for (const path in topicContentLoaders) {
    // Quick check using meta to avoid resolving all promises
    const meta = topicMetaFiles[path].default || topicMetaFiles[path];
    if (meta.id === topicId) {
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
