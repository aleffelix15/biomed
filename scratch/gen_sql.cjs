const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('src/content/disciplines');
let sql = '-- Inserir ou atualizar disciplinas conforme os slugs locais\n';
sql += 'INSERT INTO public.disciplines (id, slug, name, description) VALUES \n';

const vals = [];
dirs.forEach(d => {
  const p = path.join('src/content/disciplines', d, 'discipline.json');
  if (fs.existsSync(p)) {
    const j = JSON.parse(fs.readFileSync(p, 'utf8'));
    // Escape single quotes in description
    const desc = j.description ? j.description.replace(/'/g, "''") : '';
    vals.push(`('${d}', '${d}', '${j.name}', '${desc}')`);
  }
});

sql += vals.join(',\n') + '\nON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug, description = EXCLUDED.description;\n';

fs.writeFileSync('scripts/04_fix_missing_disciplines.sql', sql);
console.log('Done');
