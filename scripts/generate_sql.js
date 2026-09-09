import fs from 'fs';
import { DISCIPLINES } from '../src/data/mock/disciplines.js';
import { TOPICS } from '../src/data/mock/topics.js';
import { BOOKS } from '../src/data/mock/books.js';

let sql = 'BEGIN;\n';
sql += 'DELETE FROM books;\nDELETE FROM topics;\nDELETE FROM disciplines;\n\n';

sql += DISCIPLINES.map(d => `INSERT INTO disciplines (id, name, icon, category, topics_count) VALUES ('${d.id}', '${d.name.replace(/'/g, "''")}', 'default', '${d.category}', ${d.topicsCount});`).join('\n') + '\n\n';

let topicsData = [];
Object.entries(TOPICS).forEach(([discId, topics]) => {
  topics.forEach((t, i) => topicsData.push(`INSERT INTO topics (id, discipline_id, title, has_content, order_index) VALUES ('${discId}_${t.id}', '${discId}', '${t.title.replace(/'/g, "''")}', ${t.hasContent}, ${i});`));
});
sql += topicsData.join('\n') + '\n\n';

sql += BOOKS.map(b => `INSERT INTO books (id, discipline_id, title, author, edition, level, description) VALUES ('${b.id}', '${b.disciplineId}', '${b.title.replace(/'/g, "''")}', '${b.author.replace(/'/g, "''")}', '${b.edition}', '${b.level}', '${(b.description||'').replace(/'/g, "''")}');`).join('\n') + '\n\n';

sql += 'COMMIT;\n';
fs.writeFileSync('seed.sql', sql);
console.log('✅ Arquivo seed.sql gerado com sucesso!');
