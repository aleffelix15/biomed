import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { DISCIPLINES } from '../src/data/mock/disciplines.js';
import { BOOKS } from '../src/data/mock/books.js';
import { TOPICS, genericTopics } from '../src/data/mock/topics.js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  console.log("Seeding disciplines...");
  for (const d of DISCIPLINES) {
    const iconName = d.icon.displayName || d.icon.name || 'HelpCircle';
    const { error } = await supabase.from('disciplines').upsert({
      id: d.id,
      name: d.name,
      icon: iconName,
      category: d.category,
      topics_count: d.topicsCount
    });
    if (error) console.error("Error inserting discipline", d.id, error);
  }

  console.log("Seeding books...");
  for (const b of BOOKS) {
    const { error } = await supabase.from('books').upsert({
      id: b.id,
      discipline_id: b.disciplineId,
      title: b.title,
      author: b.author,
      edition: b.edition,
      level: b.level,
      description: b.description
    });
    if (error) console.error("Error inserting book", b.id, error);
  }

  console.log("Seeding topics...");
  for (const d of DISCIPLINES) {
    const topics = TOPICS[d.id] || genericTopics(d.topicsCount);
    for (const t of topics) {
      const { error } = await supabase.from('topics').upsert({
        id: t.id,
        discipline_id: d.id,
        title: t.title,
        status: t.status,
        has_content: t.hasContent || false
      });
      if (error) console.error("Error inserting topic", t.id, error);
    }
  }

  console.log("Seeding completed!");
}

seed();
