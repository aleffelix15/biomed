import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const oldDataDir = path.resolve(__dirname, '../src/content/data');
const newContentDir = path.resolve(__dirname, '../src/content/disciplines');

if (!fs.existsSync(newContentDir)) {
  fs.mkdirSync(newContentDir, { recursive: true });
}

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(oldDataDir, file), 'utf8'));

const disciplines = readJson('disciplines.json');
const topics = readJson('topics.json');
const modules = readJson('modules.json');
const lessons = readJson('lessons.json');
const questions = readJson('questions.json');

disciplines.forEach(disc => {
  const discDir = path.join(newContentDir, disc.id);
  fs.mkdirSync(discDir, { recursive: true });
  fs.writeFileSync(path.join(discDir, 'discipline.json'), JSON.stringify(disc, null, 2));

  const discTopics = topics.filter(t => t.discipline_id === disc.id);
  if (discTopics.length > 0) {
    const topicsDir = path.join(discDir, 'topics');
    fs.mkdirSync(topicsDir, { recursive: true });

    discTopics.forEach(topic => {
      // topic id format: bioquimica_glicose -> we'll use just "glicose" for the folder
      const folderName = topic.id.split('_').slice(1).join('_') || topic.id;
      const topicDir = path.join(topicsDir, folderName);
      fs.mkdirSync(topicDir, { recursive: true });

      // Save topic.json
      const topicMods = modules.filter(m => m.topic_id === topic.id);
      topic.modules = topicMods.map(m => {
        // Find lessons for this module
        m.lessons = lessons.filter(l => l.module_id === m.id);
        return m;
      });
      fs.writeFileSync(path.join(topicDir, 'topic.json'), JSON.stringify(topic, null, 2));

      // Questions
      const topicQs = questions.filter(q => q.topic_id === topic.id);
      if (topicQs.length > 0) {
        fs.writeFileSync(path.join(topicDir, 'questions.json'), JSON.stringify(topicQs, null, 2));
      }
    });
  }
});

console.log('Migração para estrutura aninhada concluída!');

