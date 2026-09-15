const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = walkSync(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
};

const disciplines = ['anatomia', 'histologia', 'citologia', 'embriologia', 'hematologia', 'patologia', 'microbiologia', 'parasitologia'];
for (const disc of disciplines) {
  console.log(`\n=== ${disc.toUpperCase()} ===`);
  const discPath = `src/content/disciplines/${disc}/topics`;
  if (!fs.existsSync(discPath)) continue;
  
  const files = walkSync(discPath).filter(f => f.endsWith('topic.json'));
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    console.log(` Tópico: ${data.title}`);
    data.modules.forEach(m => {
      m.lessons.forEach(l => {
         console.log(`   - [${l.id}] ${l.title}`);
      });
    });
  }
}

