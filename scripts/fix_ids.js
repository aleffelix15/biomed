import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY);

async function fixIds() {
  console.log("Iniciando correção de IDs...");
  
  const mappings = [
    { old: 'd2', new: 'bioquimica' },
    { old: 'd1', new: 'anatomia' },
    { old: 'd5', new: 'microbiologia' }
  ];

  for (const m of mappings) {
    // 1. Garantir que a disciplina nova existe
    const { data: newDisc } = await supabase.from('disciplines').select('id').eq('id', m.new).single();
    if (!newDisc) {
      console.log(`Criando disciplina ${m.new} para poder migrar dados...`);
      await supabase.from('disciplines').insert({ id: m.new, name: m.new.toUpperCase(), category: 'Geral', topics_count: 0 });
    }

    // 2. Mover Topics
    await supabase.from('topics').update({ discipline_id: m.new }).eq('discipline_id', m.old);
    
    // 3. Mover Questions
    await supabase.from('questions').update({ discipline_id: m.new }).eq('discipline_id', m.old);
    
    // 4. Mover Flashcards
    await supabase.from('flashcards').update({ discipline_id: m.new }).eq('discipline_id', m.old);
    
    // 5. Mover Books
    await supabase.from('books').update({ discipline_id: m.new }).eq('discipline_id', m.old);
    
    // 6. Mover Progress
    await supabase.from('user_progress').update({ discipline_id: m.new }).eq('discipline_id', m.old);

    // 7. Deletar velha
    await supabase.from('disciplines').delete().eq('id', m.old);
    console.log(`Migrado ${m.old} -> ${m.new}`);
  }
  
  // Atualizar contagem real de tópicos
  const { data: disciplines } = await supabase.from('disciplines').select('id');
  if (disciplines) {
    for (const d of disciplines) {
      const { count } = await supabase.from('topics').select('*', { count: 'exact', head: true }).eq('discipline_id', d.id);
      await supabase.from('disciplines').update({ topics_count: count || 0 }).eq('id', d.id);
    }
    console.log("Topics count atualizado com base nos dados reais!");
  }
  
  console.log("Fim da correção!");
}

fixIds();

