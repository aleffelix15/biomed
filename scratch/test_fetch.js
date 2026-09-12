import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const lessonId = 'les_ac_1_1'; // known slug from local content
  const { data: lessonBySlug, error: errSlug } = await supabase
      .from('lessons')
      .select('id, topic_id, topics(module_id)')
      .eq('slug', lessonId)
      .single();
  console.log('Lesson by slug:', lessonBySlug);
  
  if (lessonBySlug && lessonBySlug.topics) {
     const moduleId = lessonBySlug.topics.module_id;
     const { data: questions } = await supabase.from('questions').select('*').eq('module_id', moduleId);
     console.log('Questions found:', questions.length);
  }
}
run();

