const fs = require('fs');
const path = require('path');

function findTopics(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findTopics(fullPath, fileList);
    } else if (file === 'topic.json') {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const basePath = path.join(__dirname, '../src/content/disciplines');
const topicFiles = findTopics(basePath);

const index = {};
topicFiles.forEach(file => {
  const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
  // Path relative to src/content/disciplines
  const relPath = path.relative(path.join(__dirname, '../src/content'), file).replace(/\\/g, '/');
  const importPath = '../content/' + relPath;
  
  index[importPath] = {
    id: content.id,
    discipline_id: content.discipline_id,
    title: content.title,
    order_index: content.order_index,
    has_content: content.has_content
  };
});

fs.writeFileSync(
  path.join(__dirname, '../src/content/topics-index.json'),
  JSON.stringify(index, null, 2) + '\n'
);

console.log('topics-index.json generated successfully!');
