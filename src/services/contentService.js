const disciplineFiles = import.meta.glob('../content/disciplines/*/discipline.json');
const topicFiles = import.meta.glob('../content/disciplines/*/topics/*/topic.json');
const questionFiles = import.meta.glob('../content/disciplines/*/topics/*/questions.json');

export async function getDisciplines() {
  const discs = [];
  for (const path in disciplineFiles) {
    const mod = await disciplineFiles[path]();
    discs.push(mod.default || mod);
  }
  return discs.sort((a, b) => a.name.localeCompare(b.name));
}

export async function getDisciplineById(id) {
  const discs = await getDisciplines();
  return discs.find(d => d.id === id);
}

export async function getTopicsByDiscipline(disciplineId) {
  const topics = [];
  for (const path in topicFiles) {
    const mod = await topicFiles[path]();
    const topic = mod.default || mod;
    if (topic.discipline_id === disciplineId) {
      topics.push(topic);
    }
  }
  return topics.sort((a, b) => a.order_index - b.order_index);
}

export async function getTopicModulesAndLessons(topicId) {
  for (const path in topicFiles) {
    const mod = await topicFiles[path]();
    const topic = mod.default || mod;
    if (topic.id === topicId) {
      return topic.modules;
    }
  }
  return [];
}

export async function getQuizQuestions(topicId, isSimulado = false, count = 10) {
  const allQs = [];
  for (const path in questionFiles) {
    const mod = await questionFiles[path]();
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
  for (const path in questionFiles) {
    const mod = await questionFiles[path]();
    const qs = mod.default || mod;
    allQs.push(...qs.filter(q => q.discipline_id === disciplineId));
  }
  return allQs;
}
export async function getAllTopics() { const topics = []; for (const path in topicFiles) { const mod = await topicFiles[path](); topics.push(mod.default || mod); } return topics; }
