const fs = require('fs');
const file = 'src/services/supabaseService.js';
let data = fs.readFileSync(file, 'utf8');

data = data.replace('import { supabase } from \"../config/supabase\";', 'import { supabase } from \"../config/supabase\";\\nimport { invalidateCache } from \"../state/DataCacheContext\";');

data = data.replace(/export async function toggleTopicCompletion.*?\n\s+return newState;\n\}/sg, match => {
  return match.replace('return newState;', 'invalidateCache(disciplines:);\\n  return newState;');
});

data = data.replace(/export async function completeLesson.*?\n\s+return true;\n\}/sg, match => {
  return match.replace('return true;', 'invalidateCache(disciplines:);\\n  return true;');
});

data = data.replace(/export async function saveQuestionAttempt.*?\n\}/sg, match => {
  return match.replace(/catch\s*\(err\)\s*\{\s*console\.error.*?\n\s*\}/s, 'catch(err) { console.error(err); } finally { invalidateCache(stats:); }');
});

data = data.replace(/export async function saveStudySession.*?\n\}/sg, match => {
  return match.replace(/catch\s*\(err\)\s*\{\s*console\.error.*?\n\s*\}/s, 'catch(err) { console.error(err); } finally { invalidateCache(stats:); invalidateCache(disciplines:); }');
});

fs.writeFileSync(file, data, 'utf8');
