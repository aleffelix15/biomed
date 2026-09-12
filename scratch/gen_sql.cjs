const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('src/content/disciplines');
let sql = '-- Inserir ou atualizar disciplinas conforme os slugs locais\n';
sql += 'INSERT INTO public.disciplines (id, name, icon, category) VALUES \n';

const vals = [];
dirs.forEach(d => {
  const p = path.join('src/content/disciplines', d, 'discipline.json');
  if (fs.existsSync(p)) {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    vals.push(`('${d}', '${j.name}', '${j.icon}', '${j.category}')`);
  }
});

sql += vals.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, category = EXCLUDED.category;\n';

fs.writeFileSync('scripts/04_fix_missing_disciplines.sql', sql);
console.log('Done');
