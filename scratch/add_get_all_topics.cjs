const fs = require('fs');
const file = 'src/services/contentService.js';
let data = fs.readFileSync(file, 'utf8');

data = data + \\nexport async function getAllTopics() {
  const topics = [];
  for (const path in topicFiles) {
    const mod = await topicFiles[path]();
    topics.push(mod.default || mod);
  }
  return topics;
}\n\;

fs.writeFileSync(file, data, 'utf8');
