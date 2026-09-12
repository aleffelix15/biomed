const fs = require('fs');
const file = 'src/services/supabaseService.js';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('const disciplines = content.getDisciplines();', 'const disciplines = await content.getDisciplines();');
data = data.replace('const topics = content.getTopicsByDiscipline(dId);', 'const topics = await content.getTopicsByDiscipline(dId);');
data = data.replace('const modules = content.getTopicModulesAndLessons(topicId);', 'const modules = await content.getTopicModulesAndLessons(topicId);');
data = data.replace('const modules = content.getTopicModulesAndLessons(topicId);', 'const modules = await content.getTopicModulesAndLessons(topicId);'); // Replaces the 2nd one
data = data.replace('return content.getQuizQuestions(targetTopicId, false, 5);', 'return await content.getQuizQuestions(targetTopicId, false, 5);');
data = data.replace('return content.getQuizQuestions(topicId, true, 10);', 'return await content.getQuizQuestions(topicId, true, 10);');
data = data.replace('let questions = content.getAllQuestionsByDiscipline(disciplineId);', 'let questions = await content.getAllQuestionsByDiscipline(disciplineId);');
data = data.replace('let all = content.getAllQuestionsByDiscipline(disciplineId);', 'let all = await content.getAllQuestionsByDiscipline(disciplineId);');

fs.writeFileSync(file, data, 'utf8');
