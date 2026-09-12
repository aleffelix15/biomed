import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { error } = await supabase.from('topic_progress').insert({
     user_id: '11111111-1111-1111-1111-111111111111',
     topic_id: 'analises_clinicas_hematologia_clinica_hemograma',
     completed: true
  });
  console.log(error);
}
run();

