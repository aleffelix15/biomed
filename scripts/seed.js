import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { DISCIPLINES } from '../src/data/mock/disciplines.js';
import { TOPICS } from '../src/data/mock/topics.js';
import { BOOKS } from '../src/data/mock/books.js';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function seed() {
  console.log('🚀 Starting BioStudy Database Seed...');

  try {
    // 1. Seed Disciplines
    console.log('🌱 Seeding disciplines...');
    const disciplinesData = DISCIPLINES.map(d => ({
      id: d.id,
      name: d.name,
      icon: d.icon ? 'default-icon' : null, // Icons are lucide components, not strings
      category: d.category,
      topics_count: d.topicsCount,
    }));
    const { error: discError } = await supabase.from('disciplines').upsert(disciplinesData);
    if (discError) throw discError;

    // 2. Seed Topics
    console.log('📚 Seeding topics...');
    const topicsData = [];
    Object.entries(TOPICS).forEach(([discId, topics]) => {
      topics.forEach((t, index) => {
        topicsData.push({
          id: `${discId}_${t.id}`,
          discipline_id: discId,
          title: t.title,
          has_content: t.hasContent,
          order_index: index,
        });
      });
    });
    const { error: topicError } = await supabase.from('topics').upsert(topicsData);
    if (topicError) throw topicError;

    // 3. Seed Books
    console.log('📖 Seeding books...');
    const booksData = BOOKS.map(b => ({
      id: b.id,
      discipline_id: b.disciplineId,
      title: b.title,
      author: b.author,
      edition: b.edition,
      level: b.level,
      description: b.description,
    }));
    const { error: bookError } = await supabase.from('books').upsert(booksData);
    if (bookError) throw bookError;

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
