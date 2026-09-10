import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Ajuste para ES Modules (como é type: module no package.json)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregar .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY precisam estar configurados no .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function generateSlug(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

// Simulando a chamada para OpenLibrary localmente no node, já que não temos o 'fetch' global no node antigo,
// mas no node 18+ o fetch global existe. O Vite usa node >= 18.
async function searchBookInfo(query) {
  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`);
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (data && data.docs && data.docs.length > 0) {
      const doc = data.docs[0];
      return {
        title: doc.title,
        author: doc.author_name ? doc.author_name.join(', ') : 'Autor Desconhecido',
        edition: doc.edition_count ? `${doc.edition_count} edições` : '',
        description: doc.first_publish_year ? `Primeira publicação em ${doc.first_publish_year}` : 'Recomendação bibliográfica.',
      };
    }
  } catch (err) {
    console.error(`  [!] Falha de rede/API ao buscar "${query}": ${err.message}`);
  }
  return null;
}

async function runSeed() {
  const filePath = path.resolve(__dirname, '../curriculo_referencia.json');
  if (!fs.existsSync(filePath)) {
    console.error(`Erro: Arquivo não encontrado em ${filePath}`);
    process.exit(1);
  }

  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (err) {
    console.error(`Erro ao parsear JSON: ${err.message}`);
    process.exit(1);
  }

  let stats = {
    disciplines: { created: 0, skipped: 0, error: 0 },
    topics: { created: 0, skipped: 0, error: 0 },
    modules: { created: 0, skipped: 0, error: 0 },
    books: { created: 0, skipped: 0, error: 0 },
    failedItems: []
  };

  console.log("Iniciando processamento do currículo...");

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];
    
    // 1. Validação de Schema
    if (!item.disciplina || !item.periodo || !Array.isArray(item.assuntos)) {
      console.warn(`\n[!] Pulando item ${i} (${item.disciplina || 'desconhecido'}): Schema inválido.`);
      stats.disciplines.error++;
      stats.failedItems.push(`Item ${i} (Schema inválido)`);
      continue;
    }

    console.log(`\nProcessando Disciplina: ${item.disciplina}`);
    const disciplineId = generateSlug(item.disciplina);

    // Upsert Disciplina
    const { data: existDisc, error: checkDiscErr } = await supabase
      .from('disciplines')
      .select('id')
      .eq('id', disciplineId)
      .single();

    if (checkDiscErr && checkDiscErr.code !== 'PGRST116') {
      stats.disciplines.error++;
      stats.failedItems.push(`Disciplina ${item.disciplina} (Erro de banco: ${checkDiscErr.message})`);
      continue;
    }

    if (existDisc) {
      console.log(`  - Disciplina já existe. Ignorando criação.`);
      stats.disciplines.skipped++;
    } else {
      const { error: insDiscErr } = await supabase.from('disciplines').insert({
        id: disciplineId,
        name: item.disciplina,
        category: 'Geral', // Default genérico
        topics_count: item.assuntos.length
      });
      if (insDiscErr) {
        stats.disciplines.error++;
        stats.failedItems.push(`Disciplina ${item.disciplina} (Erro insert: ${insDiscErr.message})`);
        continue;
      }
      stats.disciplines.created++;
    }

    // Upsert Assuntos (Topics)
    for (const assunto of item.assuntos) {
      if (!assunto.nome || !Array.isArray(assunto.topicos)) {
        console.warn(`  [!] Pulando assunto "${assunto.nome || '?'}" por estar malformado.`);
        stats.topics.error++;
        continue;
      }

      const topicId = `${disciplineId}-${generateSlug(assunto.nome)}`;
      
      const { data: existTopic } = await supabase
        .from('topics')
        .select('id')
        .eq('id', topicId)
        .single();

      if (existTopic) {
        stats.topics.skipped++;
      } else {
        const { error: insTopicErr } = await supabase.from('topics').insert({
          id: topicId,
          discipline_id: disciplineId,
          title: assunto.nome,
          status: 'pendente',
          has_content: false
        });
        if (insTopicErr) {
          stats.topics.error++;
          continue;
        }
        stats.topics.created++;
      }

      // Upsert Módulos (usando topicos)
      for (let mIdx = 0; mIdx < assunto.topicos.length; mIdx++) {
        const moduloTitle = assunto.topicos[mIdx];
        
        // Manual check for idempotency instead of relying purely on unique constraint
        const { data: existMod } = await supabase
          .from('modules')
          .select('id')
          .eq('topic_id', topicId)
          .eq('title', moduloTitle)
          .single();

        if (existMod) {
          stats.modules.skipped++;
        } else {
          const { error: insModErr } = await supabase.from('modules').insert({
            topic_id: topicId,
            title: moduloTitle,
            order_index: mIdx
          });
          if (insModErr) stats.modules.error++;
          else stats.modules.created++;
        }
      }
    }

    // Processar Bibliografia
    if (item.bibliografia && Array.isArray(item.bibliografia)) {
      for (const biblio of item.bibliografia) {
        const bookId = `bib-${disciplineId}-${generateSlug(biblio).slice(0, 30)}`;
        
        const { data: existBook } = await supabase
          .from('books')
          .select('id')
          .eq('id', bookId)
          .single();

        if (existBook) {
          stats.books.skipped++;
        } else {
          // Busca real na OpenLibrary
          console.log(`  - Buscando referências para: "${biblio}" na Open Library...`);
          const bookInfo = await searchBookInfo(biblio);
          
          const { error: insBookErr } = await supabase.from('books').insert({
            id: bookId,
            discipline_id: disciplineId,
            title: bookInfo ? bookInfo.title : biblio,
            author: bookInfo ? bookInfo.author : 'Desconhecido',
            edition: bookInfo ? bookInfo.edition : '',
            level: 'Geral',
            description: bookInfo ? bookInfo.description : 'Sugerido pela bibliografia do curso.'
          });

          if (insBookErr) stats.books.error++;
          else stats.books.created++;
        }
      }
    }
  }

  console.log("\n=============================================");
  console.log("🚀 RESUMO DA OPERAÇÃO DE SEED CURRICULAR");
  console.log("=============================================");
  console.log(`Disciplinas : ${stats.disciplines.created} criadas | ${stats.disciplines.skipped} já existiam | ${stats.disciplines.error} falhas`);
  console.log(`Assuntos    : ${stats.topics.created} criados | ${stats.topics.skipped} já existiam | ${stats.topics.error} falhas`);
  console.log(`Módulos     : ${stats.modules.created} criados | ${stats.modules.skipped} já existiam | ${stats.modules.error} falhas`);
  console.log(`Livros      : ${stats.books.created} criados | ${stats.books.skipped} já existiam | ${stats.books.error} falhas`);
  if (stats.failedItems.length > 0) {
    console.log("\nItens com falha crítica:");
    stats.failedItems.forEach(i => console.log(`- ${i}`));
  }
  console.log("=============================================\n");
}

runSeed();
