import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_ANON_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const CONTENT_DIR = path.join(process.cwd(), 'src/content/disciplines');

async function syncToDB() {
  console.log('🔄 Iniciando Sincronização Local -> Supabase...\n');

  const stats = {
    disciplines: { found: 0, upserted: 0, errors: 0 },
    modules: { found: 0, upserted: 0, errors: 0 },
    topics: { found: 0, upserted: 0, errors: 0 },
    lessons: { found: 0, upserted: 0, errors: 0 },
    questions: { found: 0, upserted: 0, errors: 0 }
  };

  const errorLogs = [];

  const disciplines = fs.readdirSync(CONTENT_DIR).filter(d => fs.statSync(path.join(CONTENT_DIR, d)).isDirectory());
  
  for (const discSlug of disciplines) {
    const discDir = path.join(CONTENT_DIR, discSlug);
    const discJsonPath = path.join(discDir, 'discipline.json');
    if (!fs.existsSync(discJsonPath)) continue;
    
    stats.disciplines.found++;
    const discData = JSON.parse(fs.readFileSync(discJsonPath, 'utf-8'));

    const { data: dbDisc, error: errDisc } = await supabase
      .from('disciplines')
      .upsert({ slug: discSlug, name: discData.name, description: discData.description || '' }, { onConflict: 'slug' })
      .select().single();
    
    if (errDisc) {
      stats.disciplines.errors++;
      errorLogs.push(`[DISC SYNC ERROR] ${discSlug}: ${errDisc.message}`);
      continue;
    }
    stats.disciplines.upserted++;

    const topicsDir = path.join(discDir, 'topics');
    if (!fs.existsSync(topicsDir)) continue;

    const topics = fs.readdirSync(topicsDir).filter(t => fs.statSync(path.join(topicsDir, t)).isDirectory());

    for (const topicSlug of topics) {
      const topicJsonPath = path.join(topicsDir, topicSlug, 'topic.json');
      if (!fs.existsSync(topicJsonPath)) continue;
      
      stats.modules.found++;
      const topicData = JSON.parse(fs.readFileSync(topicJsonPath, 'utf-8'));

      const { data: dbMod, error: errMod } = await supabase
        .from('modules')
        .upsert({ slug: topicData.id || topicSlug, title: topicData.title, discipline_id: dbDisc.id }, { onConflict: 'slug' })
        .select().single();

      if (errMod) {
        stats.modules.errors++;
        errorLogs.push(`[MODULE SYNC ERROR] ${topicSlug}: ${errMod.message}`);
        continue;
      }
      stats.modules.upserted++;

      if (topicData.modules) {
        for (const localMod of topicData.modules) {
          stats.topics.found++;
          const { data: dbTop, error: errTop } = await supabase
            .from('topics')
            .upsert({ slug: localMod.id, title: localMod.title, module_id: dbMod.id }, { onConflict: 'slug' })
            .select().single();
            
          if (errTop) {
            stats.topics.errors++;
            errorLogs.push(`[TOPIC SYNC ERROR] ${localMod.id}: ${errTop.message}`);
            continue;
          }
          stats.topics.upserted++;

          if (localMod.lessons) {
            for (const less of localMod.lessons) {
              stats.lessons.found++;
              const { error: errLess } = await supabase
                .from('lessons')
                .upsert({ 
                  slug: less.id, 
                  title: less.title, 
                  content: less.content_markdown || less.content || '', 
                  topic_id: dbTop.id 
                }, { onConflict: 'slug' });
                
              if (errLess) {
                stats.lessons.errors++;
                errorLogs.push(`[LESSON SYNC ERROR] ${less.id}: ${errLess.message}`);
              } else {
                stats.lessons.upserted++;
              }
            }
          }
        }
      }

      // Sync Questions -> Linked to Module (Local Topic)
      const questionsJsonPath = path.join(topicsDir, topicSlug, 'questions.json');
      if (fs.existsSync(questionsJsonPath)) {
        const questionsData = JSON.parse(fs.readFileSync(questionsJsonPath, 'utf-8'));
        for (const q of questionsData) {
          stats.questions.found++;
          const correctIdx = ['a', 'b', 'c', 'd', 'e'].indexOf(q.correct_option || q.answer);
          
          if (correctIdx === -1) {
             stats.questions.errors++;
             errorLogs.push(`[QUESTION SYNC ERROR] ${q.id}: Invalid correct_option`);
             continue;
          }

          const { error: errQ } = await supabase.from('questions').upsert({
            slug: q.id,
            module_id: dbMod.id, // Linking to module (local topic) appropriately
            lesson_id: null,     // Explicitly null, preserving semantic truth
            content: q.question,
            options: [q.option_a, q.option_b, q.option_c, q.option_d, q.option_e].filter(Boolean),
            correct_option_index: correctIdx,
            explanation: q.explanation || ''
          }, { onConflict: 'slug' });

          if (errQ) {
            stats.questions.errors++;
            errorLogs.push(`[QUESTION SYNC ERROR] ${q.id} (Module: ${dbMod.id}): ${errQ.message}`);
          } else {
            stats.questions.upserted++;
          }
        }
      }
    }
  }
  
  console.log('\n================================================');
  console.log('SYNC SUMMARY');
  console.log('================================================\n');
  console.log('Local:');
  console.log(`${stats.disciplines.found} disciplines`);
  console.log(`${stats.modules.found} modules (local topics)`);
  console.log(`${stats.topics.found} topics (local modules)`);
  console.log(`${stats.lessons.found} lessons`);
  console.log(`${stats.questions.found} questions\n`);
  
  console.log('Database (Upserted):');
  console.log(`${stats.disciplines.upserted} disciplines`);
  console.log(`${stats.modules.upserted} modules`);
  console.log(`${stats.topics.upserted} topics`);
  console.log(`${stats.lessons.upserted} lessons`);
  console.log(`${stats.questions.upserted} questions\n`);
  
  console.log('Errors:');
  console.log(`${errorLogs.length}\n`);
  
  if (errorLogs.length > 0) {
    console.log('Error Details:');
    errorLogs.forEach(err => console.log(err));
  }
  
  console.log('\n✅ Script idempotente concluído!');
}

syncToDB().catch(console.error);
