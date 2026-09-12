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

    // Simulando que Tópico (local) = Module (DB) e Lesson (local) = Topic/Lesson (DB) dependendo da hierarquia
    // No BioStudy local: discipline -> topic -> lesson
    // No banco foi pedido: discipline -> module -> topic -> lesson
    
    // Para adaptar, vamos criar um Módulo "Geral" para a disciplina, ou mapear Tópico Local -> Módulo DB, e Aula -> Tópico DB
    // Vamos mapear Tópico Local -> Módulo DB
    for (const topicSlug of topics) {
      const topicJsonPath = path.join(topicsDir, topicSlug, 'topic.json');
      if (!fs.existsSync(topicJsonPath)) continue;

      const topicData = JSON.parse(fs.readFileSync(topicJsonPath, 'utf-8'));

      // Upsert Module
      const { data: dbMod, error: errMod } = await supabase
        .from('modules')
        .upsert({ slug: topicSlug, title: topicData.title, discipline_id: dbDisc.id }, { onConflict: 'slug' })
        .select().single();

      if (errMod) {
        console.error('Erro no módulo:', topicSlug, errMod);
        continue;
      }

      // Upsert Topic (Criando um tópico "Fundamentos" dentro do módulo para abrigar as aulas)
      const { data: dbTop, error: errTop } = await supabase
        .from('topics')
        .upsert({ slug: `${topicSlug}-geral`, title: 'Fundamentos', module_id: dbMod.id }, { onConflict: 'slug' })
        .select().single();

      if (topicData.lessons) {
        for (const less of topicData.lessons) {
          // Upsert Aula
          const { error: errLess } = await supabase
            .from('lessons')
            .upsert({ 
              slug: less.id, // lesson local usa "id" como slug ex: "glicose-intro"
              title: less.title, 
              content: less.content || '', 
              topic_id: dbTop.id 
            }, { onConflict: 'slug' });
            
          if (!errLess) console.log(`   📚 Aula sincronizada: ${less.title}`);
          else console.error('Erro na aula:', less.id, errLess);
        }
      }
    }
  }
  console.log('🚀 Sincronização concluída com sucesso!');
}

syncToDB().catch(console.error);

