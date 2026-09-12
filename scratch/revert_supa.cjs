const fs = require('fs');
const file = 'src/services/supabaseService.js';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('const disciplines = await content.getDisciplines();', 'const disciplines = content.getDisciplines();');
data = data.replace('const topics = await content.getTopicsByDiscipline(dId);', 'const topics = content.getTopicsByDiscipline(dId);');
data = data.replace('const allTopics = await content.getAllTopics();', 'const allTopics = content.getAllTopics();');

fs.writeFileSync(file, data, 'utf8');
