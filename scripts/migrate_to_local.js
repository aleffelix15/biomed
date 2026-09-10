import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

async function migrate() {
  console.log('Iniciando extração do Supabase para arquivos locais...');
  const contentDir = path.resolve(__dirname, '../src/content/data');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }

  // 1. Disciplinas
  const { data: disciplines, error: e1 } = await supabase.from('disciplines').select('*').order('name');
  if (e1) throw e1;
  fs.writeFileSync(path.join(contentDir, 'disciplines.json'), JSON.stringify(disciplines, null, 2));
  console.log(`✅ ${disciplines.length} Disciplinas exportadas.`);

  // 2. Topics
  const { data: topics, error: e2 } = await supabase.from('topics').select('*').order('order_index');
  if (e2) throw e2;
  fs.writeFileSync(path.join(contentDir, 'topics.json'), JSON.stringify(topics, null, 2));
  console.log(`✅ ${topics.length} Tópicos exportados.`);

  // 3. Modules
  const { data: modules, error: e3 } = await supabase.from('modules').select('*').order('order_index');
  if (e3) throw e3;
  fs.writeFileSync(path.join(contentDir, 'modules.json'), JSON.stringify(modules, null, 2));
  console.log(`✅ ${modules.length} Módulos exportados.`);

  // 4. Lessons
  const { data: lessons, error: e4 } = await supabase.from('lessons').select('*').order('order_index');
  if (e4) throw e4;
  fs.writeFileSync(path.join(contentDir, 'lessons.json'), JSON.stringify(lessons, null, 2));
  console.log(`✅ ${lessons.length} Aulas exportadas.`);

  // 5. Questions
  const { data: questions, error: e5 } = await supabase.from('questions').select('*');
  if (e5) throw e5;
  fs.writeFileSync(path.join(contentDir, 'questions.json'), JSON.stringify(questions, null, 2));
  console.log(`✅ ${questions.length} Questões exportadas.`);

  console.log('Extração concluída com sucesso!');
}

migrate().catch(console.error);
