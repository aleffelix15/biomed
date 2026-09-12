import re

with open('src/services/supabaseService.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update fetchQuestions
old_fetchQ = r"export async function fetchQuestions\(disciplineId, topicId = null\) \{.*?\n\}"
new_fetchQ = r'''export async function fetchQuestions(disciplineId, topicId = null, isSimulado = false, limit = null) {
  let all = content.getAllQuestionsByDiscipline(disciplineId);
  if (topicId) {
    all = all.filter(q => q.topic_id === topicId);
  }
  if (isSimulado) {
    all = [...all].sort(() => Math.random() - 0.5);
    if (limit) all = all.slice(0, limit);
  }
  return Promise.resolve(all);
}'''
code = re.sub(old_fetchQ, new_fetchQ, code, flags=re.DOTALL)

# 2. Update fetchFlashcards
old_fetchF = r"export async function fetchFlashcards\(disciplineId\) \{.*?return \[\.\.\.realFlashcards, \.\.\.derivedFlashcards\];\n\}"
new_fetchF = r'''export async function fetchFlashcards(disciplineId, topicId = null) {
  let realFlashcards = [];
  
  if (supabase) {
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('discipline_id', disciplineId);
      
    if (topicId) query = query.eq('topic_id', topicId);
      
    const { data, error } = await query;
      
    if (!error && data) {
      realFlashcards = data;
    } else if (error) {
      console.error('Error fetching flashcards:', error);
    }
  }

  let questions = content.getAllQuestionsByDiscipline(disciplineId);
  if (topicId) {
    questions = questions.filter(q => q.topic_id === topicId);
  }
  
  const realReviewQuestionIds = new Set(
    realFlashcards
      .filter(f => f.id.startsWith('review_'))
      .map(f => f.id.replace('review_', ''))
  );

  const derivedFlashcards = questions
    .filter(q => !realReviewQuestionIds.has(q.id))
    .map(q => ({
      id: derived_,
      discipline_id: q.discipline_id,
      topic_id: q.topic_id,
      question: q.question,
      answer: ${q['option_' + q.correct_option]} — .trim(),
      category: 'Conteúdo',
      derived: true,
    }));

  return [...realFlashcards, ...derivedFlashcards];
}'''
code = re.sub(old_fetchF, new_fetchF, code, flags=re.DOTALL)

# 3. Add ensureFlashcardExists
if "ensureFlashcardExists" not in code:
    code = code.replace(
        "export async function updateFlashcardProgress",
        '''export async function ensureFlashcardExists(flashcard) {
  if (!supabase || !flashcard.derived) return;
  const { data: existing } = await supabase
    .from('flashcards')
    .select('id')
    .eq('id', flashcard.id)
    .single();
    
  if (!existing) {
    await supabase.from('flashcards').insert({
      id: flashcard.id,
      discipline_id: flashcard.discipline_id,
      topic_id: flashcard.topic_id,
      question: flashcard.question,
      answer: flashcard.answer,
      category: flashcard.category || 'Conteúdo',
    });
  }
}

export async function updateFlashcardProgress'''
    )

with open('src/services/supabaseService.js', 'w', encoding='utf-8') as f:
    f.write(code)
