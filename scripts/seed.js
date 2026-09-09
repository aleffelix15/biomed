import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { DISCIPLINES } from '../src/data/mock/disciplines.js';
import { TOPICS, genericTopics } from '../src/data/mock/topics.js';
import { BOOKS } from '../src/data/mock/books.js';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Seeding disciplines...");
  const disciplinesToUpsert = DISCIPLINES.map(d => ({
    id: d.id,
    name: d.name,
    icon: typeof d.icon === 'string' ? d.icon : d.icon?.render?.name || d.icon?.name || 'HelpCircle',
    category: d.category,
    topics_count: d.topicsCount,
  }));

  const { error: dError } = await supabase.from('disciplines').upsert(disciplinesToUpsert);
  if (dError) console.error("Error inserting disciplines:", dError);

  console.log("Seeding books...");
  const booksToUpsert = BOOKS.map(b => ({
    id: b.id,
    discipline_id: b.disciplineId,
    title: b.title,
    author: b.author,
    edition: b.edition,
    level: b.level,
    description: b.description
  }));
  const { error: bError } = await supabase.from('books').upsert(booksToUpsert);
  if (bError) console.error("Error inserting books:", bError);

  console.log("Seeding topics...");
  const topicsToUpsert = [];
  for (const d of DISCIPLINES) {
    const topics = TOPICS[d.id] || genericTopics(d.topicsCount);
    for (const t of topics) {
      topicsToUpsert.push({
        id: `${d.id}_${t.id}`, // composite ID to avoid collisions
        discipline_id: d.id,
        title: t.title,
        status: t.status,
        has_content: t.hasContent || false
      });
    }
  }
  
  const { error: tError } = await supabase.from('topics').upsert(topicsToUpsert);
  if (tError) console.error("Error inserting topics:", tError);

  console.log("Seeding complete!");
}

seed();
