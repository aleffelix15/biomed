import disciplines from '../content/data/disciplines.json';
import topics from '../content/data/topics.json';
import modules from '../content/data/modules.json';
import lessons from '../content/data/lessons.json';
import questions from '../content/data/questions.json';

export function getDisciplines() {
  return disciplines;
}

export function getDisciplineById(id) {
  return disciplines.find(d => d.id === id);
}

export function getTopicsByDiscipline(disciplineId) {
  return topics.filter(t => t.discipline_id === disciplineId).sort((a, b) => a.order_index - b.order_index);
}

export function getModulesByTopic(topicId) {
  return modules.filter(m => m.topic_id === topicId).sort((a, b) => a.order_index - b.order_index);
}

export function getLessonsByModule(moduleId) {
  return lessons.filter(l => l.module_id === moduleId).sort((a, b) => a.order_index - b.order_index);
}

export function getTopicModulesAndLessons(topicId) {
  const mods = getModulesByTopic(topicId);
  return mods.map(m => ({
    ...m,
    lessons: getLessonsByModule(m.id)
  }));
}

export function getQuizQuestions(topicId, isSimulado = false, count = 10) {
  const allQs = questions.filter(q => q.topic_id === topicId);
  // Se for simulado, embaralha e pega count. Se não, apenas as primeiras `count`.
  if (isSimulado) {
    return allQs.sort(() => Math.random() - 0.5).slice(0, count);
  }
  return allQs.slice(0, count);
}

export function getAllQuestionsByDiscipline(disciplineId) {
  return questions.filter(q => q.discipline_id === disciplineId);
}
