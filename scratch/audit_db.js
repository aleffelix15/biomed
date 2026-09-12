import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function audit() {
  const tables = [
    'profiles',
    'disciplines',
    'topics',
    'modules',
    'lessons',
    'questions',
    'flashcards',
    'user_progress',
    'question_attempts',
    'lesson_progress',
    'user_flashcard_progress'
  ];

  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`Table ${table}: ERROR - ${error.message}`);
    } else {
      console.log(`Table ${table}: OK`);
      if (data.length > 0) {
        console.log(`  Columns: ${Object.keys(data[0]).join(', ')}`);
        console.log(`  Types (from data): ${Object.entries(data[0]).map(([k,v]) => `${k} (${typeof v})`).join(', ')}`);
      } else {
        console.log('  (Table is empty)');
      }
    }
  }
}

audit();

