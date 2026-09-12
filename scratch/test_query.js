import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('questions').select('*').eq('module_id', 'analises_clinicas_hematologia_clinica_hemograma');
  console.log('Error:', error);
  console.log('Data:', data);
}
run();

