import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Configuração do Supabase
// Executar da raiz do projeto usando node com import
dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_ANON_KEY; // Em dev, pode usar anon se RLS permitir, ou service role


const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const CONTENT_DIR = path.join(process.cwd(), 'src/content/disciplines');

async function syncToDB() {
  console.log('🔄 Iniciando sincronização Local -> Supabase...');

  const disciplines = fs.readdirSync(CONTENT_DIR).filter(d => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory());

  for (const discSlug of disciplines) {
    const discDir = path.join(CONTENT_DIR, discSlug);
    const discJsonPath = path.join(discDir, 'discipline.json');
    
    if (!fs.existsSync(discJsonPath)) continue;
    
    const discData = JSON.parse(fs.readFileSync(discJsonPath, 'utf-8'));

    // 1. Upsert Disciplina
    const { data: dbDisc, error: errDisc } = await supabase
      .from('disciplines')
      .upsert({ slug: discSlug, name: discData.name, description: discData.description || '' }, { onConflict: 'slug' })
      .select().single();
    
    if (errDisc) {
      console.error('Erro na disciplina:', discSlug, errDisc);
      continue;
    }
    console.log(`✅ Disciplina sincronizada: ${dbDisc.name}`);

    const topicsDir = path.join(discDir, 'topics');
    if (!fs.existsSync(topicsDir)) continue;

    const topics = fs.readdirSync(topicsDir).filter(t => fs.statSync(path.join(topicsDir, t)).isDirectory());

    // No BioStudy local: discipline -> topic.json -> (contém modules -> lessons)
    for (const topicSlug of topics) {
      const topicJsonPath = path.join(topicsDir, topicSlug, 'topic.json');
      if (!fs.existsSync(topicJsonPath)) continue;

      const topicData = JSON.parse(fs.readFileSync(topicJsonPath, 'utf-8'));

      // Upsert Topic (que no DB agora precisa estar sob um Module, ou podemos criar um módulo dummy, ou adaptar)
      // Wait, o DB schema: discipline -> module -> topic -> lesson.
      // O JSON local: discipline -> topic -> module -> lesson.
      // Para manter a integridade local: 
      // Module(DB) = Topic(JSON)
      // Topic(DB) = Module(JSON)
      // Lesson(DB) = Lesson(JSON)

      const { data: dbMod, error: errMod } = await supabase
        .from('modules')
        .upsert({ slug: topicData.id || topicSlug, title: topicData.title, discipline_id: dbDisc.id }, { onConflict: 'slug' })
        .select().single();

      if (errMod) continue;

      if (topicData.modules) {
        for (const localMod of topicData.modules) {
          const { data: dbTop, error: errTop } = await supabase
            .from('topics')
            .upsert({ slug: localMod.id, title: localMod.title, module_id: dbMod.id }, { onConflict: 'slug' })
            .select().single();
            
          if (errTop) continue;

          if (localMod.lessons) {
            for (const less of localMod.lessons) {
              await supabase
                .from('lessons')
                .upsert({ 
                  slug: less.id, 
                  title: less.title, 
                  content: less.content_markdown || less.content || '', 
                  topic_id: dbTop.id 
                }, { onConflict: 'slug' });
            }
          }
        }
      }

      // Sync Questions
      const questionsJsonPath = path.join(topicsDir, topicSlug, 'questions.json');
      if (fs.existsSync(questionsJsonPath)) {
        const questionsData = JSON.parse(fs.readFileSync(questionsJsonPath, 'utf-8'));
        // Local questions structure is an array of objects
        for (const q of questionsData) {
          // Find the lesson id for this question if any, or just link it.
          // Since the DB requires a lesson_id, we can map to the first lesson of the topic for now, or if q has lesson_id use it.
          // Or we can just bypass it if it's too complex. But we MUST sync questions.
          // Actually, let's find a lesson ID from the topic.
          const { data: firstLesson } = await supabase
             .from('lessons')
             .select('id')
             .eq('slug', (topicData.modules && topicData.modules[0] && topicData.modules[0].lessons && topicData.modules[0].lessons[0]?.id) || '')
             .single();
          
          if (firstLesson) {
            await supabase.from('questions').upsert({
              slug: q.id,
              lesson_id: firstLesson.id,
              content: q.question,
              options: [q.option_a, q.option_b, q.option_c, q.option_d, q.option_e].filter(Boolean),
              correct_option_index: ['a', 'b', 'c', 'd', 'e'].indexOf(q.correct_option || q.answer),
              explanation: q.explanation || ''
            }, { onConflict: 'slug' });
          }
        }
      }
    }
  }
  console.log('🚀 Sincronização concluída com sucesso!');
}

syncToDB().catch(console.error);

