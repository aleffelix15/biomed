// Auto-discovery of all discipline files
const disciplineFiles = import.meta.glob('../content/disciplines/*/discipline.json', { eager: true });
const topicFiles = import.meta.glob('../content/disciplines/*/topics/*/topic.json', { eager: true });
const questionFiles = import.meta.glob('../content/disciplines/*/topics/*/questions.json', { eager: true });

export function getDisciplines() {
  const discs = [];
  for (const path in disciplineFiles) {
    discs.push(disciplineFiles[path].default);
  }
  return discs.sort((a, b) => a.name.localeCompare(b.name));
}

export function getDisciplineById(id) {
  return getDisciplines().find(d => d.id === id);
}

export function getTopicsByDiscipline(disciplineId) {
  const topics = [];
  for (const path in topicFiles) {
    const topic = topicFiles[path].default;
    if (topic.discipline_id === disciplineId) {
      topics.push(topic);
    }
  }
  return topics.sort((a, b) => a.order_index - b.order_index);
}

export function getTopicModulesAndLessons(topicId) {
  // In the nested structure, we bundled modules and lessons into the topic.json
  const topicFilesArray = Object.values(topicFiles);
  for (const file of topicFilesArray) {
    if (file.default.id === topicId) {
      return file.default.modules || [];
    }
  }
  return [];
}

export function getQuizQuestions(topicId, isSimulado = false, count = 10) {
  const allQs = Object.values(questionFiles)
    .flatMap(f => f.default)
    .filter(q => q.topic_id === topicId);

  if (isSimulado) {
    return allQs.sort(() => Math.random() - 0.5).slice(0, count);
  }
  return allQs.slice(0, count);
}

export function getAllQuestionsByDiscipline(disciplineId) {
  let allQs = [];
  for (const path in questionFiles) {
    const qs = questionFiles[path].default;
    allQs = allQs.concat(qs.filter(q => q.discipline_id === disciplineId));
  }
  return allQs;
}
