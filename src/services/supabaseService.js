import { supabase } from "./supabaseClient";
import { invalidateCache } from "../state/DataCacheContext";
import * as content from "./contentService";


const idCache = new Map();
async function resolveId(table, slugOrId) {
  if (!slugOrId) return null;
  // If it's already a UUID
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId)) {
    return slugOrId;
  }
  // Special case for disciplines which use slug as ID in the database!
  if (table === 'disciplines') return slugOrId;

  const cacheKey = `${table}:${slugOrId}`;
  if (idCache.has(cacheKey)) return idCache.get(cacheKey);

  try {
    const { data } = await supabase.from(table).select('id').eq('slug', slugOrId).single();
    if (data?.id) {
      idCache.set(cacheKey, data.id);
      return data.id;
    }
  } catch (e) {
    console.error(`Failed to resolve ${table} ID for slug ${slugOrId}`, e);
  }
  return null;
}

// resolveId: passthrough for the Dual-Key slug→id layer.
// The project uses slugs as direct IDs in all relevant tables (disciplines.id,
// topic_progress.topic_id, etc.), so no translation is needed today.
// If a future migration introduces real UUIDs, implement lookup logic here.


export async function toggleTopicCompletion(userId, topicId, disciplineId) {
  if (!supabase) return;
  const real_topicId = await resolveId('topics', topicId);
  const real_disciplineId = await resolveId('disciplines', disciplineId);
  if (!real_topicId || !real_disciplineId) return;

  

  // 1. Toggle completion status in topic_progress
  const { data: currentProgress } = await supabase
    .from('topic_progress')
    .select('completed')
    .eq('user_id', userId)
    .eq('topic_id', real_topicId)
    .single();

  const newStatus = !currentProgress?.completed;

  const { error: progressError } = await supabase
    .from('topic_progress')
    .upsert({
      user_id: userId,
      topic_id: real_topicId,
      completed: newStatus,
      completed_at: newStatus ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,topic_id' });

  if (progressError) throw progressError;

  // 2. Recalculate aggregate progress for the discipline
  const { data: allTopics } = await supabase
    .from('topics')
    .select('id')
    .eq('discipline_id', real_disciplineId);

  const { count: totalCount } = await supabase
    .from('topics')
    .select('*', { count: 'exact', head: true })
    .eq('discipline_id', real_disciplineId);

  const { count: completedCount } = await supabase
    .from('topic_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('completed', true)
    .in('topic_id', allTopics?.map(t => t.id) || []);

  const newPercent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  // 3. Update user_progress
  await supabase
    .from('user_progress')
    .upsert({
      user_id: userId,
      discipline_id: real_disciplineId,
      percent_complete: newPercent,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,discipline_id' });

  invalidateCache(`disciplines:${userId}`);
  return { completed: newStatus, percent_complete: newPercent };
}

export async function fetchTopicProgress(userId, disciplineId) {
  if (!supabase) return;
  const real_disciplineId = await resolveId('disciplines', disciplineId);
  if (!real_disciplineId) return;

  
  const { data, error } = await supabase
    .from('topic_progress')
    .select('topic_id, completed')
    .eq('user_id', userId)
    .in('topic_id', (await supabase.from('topics').select('id').eq('discipline_id', real_disciplineId)).data?.map(t => t.id) || []);

  if (error) return [];
  return data;
}

export async function fetchDisciplinesWithProgress(userId) {
  if (!supabase) return [];

  // Fallback map para pegar contagem real (evitar NaN) e categoria
  const localDisciplines = content.getDisciplines();
  const localTopicCountMap = localDisciplines.reduce((acc, d) => {
    acc[d.id] = d.topics_count || d.topicsCount || 0;
    return acc;
  }, {});
  const localCategoryMap = localDisciplines.reduce((acc, d) => {
    acc[d.id] = d.category || 'Sem Categoria';
    return acc;
  }, {});

  // 1. Buscamos todas as disciplinas direto da fonte da verdade (Banco)
  const { data: disciplines, error: discErr } = await supabase
    .from('disciplines')
    .select('*')
    .order('created_at', { ascending: true });

  if (discErr) {
    console.error("Erro ao buscar disciplinas", discErr);
    return localDisciplines.map(d => ({ ...d, category: localCategoryMap[d.slug || d.id] || 'Sem Categoria', progress_percent: 0, topics_count: localTopicCountMap[d.slug || d.id] || 0 })); // fallback local
  }

  // Se não houver usuário logado, retorna 0%
  if (!userId) {
    return disciplines.map(d => ({ ...d, category: localCategoryMap[d.slug || d.id] || 'Sem Categoria', progress_percent: 0, topics_count: localTopicCountMap[d.slug || d.id] || 0 }));
  }

  // 2. Buscamos a View Agregada
  const { data: progressView, error: progErr } = await supabase
    .from('user_discipline_progress')
    .select('discipline_slug, progress_percent')
    .eq('user_id', userId);

  if (progErr) {
    console.error("Erro ao buscar progresso", progErr);
  }

  const progressMap = (progressView || []).reduce((acc, curr) => {
    acc[curr.discipline_slug] = curr.progress_percent;
    return acc;
  }, {});

  return disciplines.map(d => ({
    id: d.id,
    slug: d.slug,
    name: d.name,
    description: d.description,
    category: localCategoryMap[d.slug || d.id] || 'Sem Categoria',
    progress_percent: progressMap[d.slug || d.id] || 0,
    topics_count: localTopicCountMap[d.slug || d.id] || 0 // Mapeado pelo id porque na tabela disciplines o id já é o slug
  }));
}





export async function fetchTopicsByDiscipline(discipline) {
  const dId = discipline.slug || discipline.id || discipline;
  const topics = content.getTopicsByDiscipline(dId);
  return topics;
}

// NOVO MOTOR DE CONTEÃšDO
export async function getOrCreateStudyPlan(userId, topicId) {
  if (!supabase) return;
  const real_topicId = await resolveId('topics', topicId);
  if (!real_topicId) return;

  

  // Tenta buscar o plano existente
  let { data: plan } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', real_topicId)
    .single();

  if (!plan) {
    // Cria um novo plano
    const { data: newPlan, error } = await supabase
      .from('study_plans')
      .insert({
        user_id: userId,
        topic_id: real_topicId,
        status: 'in_progress',
        percent_complete: 0
      })
      .select()
      .single();
    
    if (error) console.error("Error creating study plan:", error);
    plan = newPlan;
  }

  return plan;
}

export async function fetchModulesAndLessons(topicId, userId) {
  if (!supabase) return;
  // Content functions expect slugs — do NOT resolve to UUID here
  const modules = await content.getTopicModulesAndLessons(topicId);
  
  if (!supabase || !userId) return modules;
  
  // Build a slug->UUID map so we can match DB progress (UUID) to local lessons (slug)
  const allSlugs = modules.flatMap(m => m.lessons.map(l => l.id));
  const slugToUUID = {};
  const uuidToSlug = {};
  await Promise.all(allSlugs.map(async (slug) => {
    const uuid = await resolveId('lessons', slug);
    if (uuid) {
      slugToUUID[slug] = uuid;
      uuidToSlug[uuid] = slug;
    }
  }));

  const uuids = Object.values(slugToUUID);
  if (uuids.length === 0) return modules;

  const { data: lessonProg } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .in('lesson_id', uuids);
    
  if (lessonProg) {
    modules.forEach(m => {
      m.lessons.forEach(l => {
        const uuid = slugToUUID[l.id];
        const prog = uuid ? lessonProg.find(p => p.lesson_id === uuid) : null;
        l.completed = prog ? prog.completed : false;
      });
    });
  }
  
  return modules;
}

export async function fetchLesson(lessonId) {
  if (!supabase) return null;
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) {
    // Tenta por slug se não achar por id
    const { data: lessonSlug, error: errSlug } = await supabase
      .from('lessons')
      .select('*')
      .eq('slug', lessonId)
      .single();
    if (errSlug || !lessonSlug) return null;
    return normalizeLesson(lessonSlug);
  }
  return normalizeLesson(lesson);
}

function normalizeLesson(lesson) {
  if (!lesson) return null;
  
  // Normalize content
  lesson.content = lesson.content || lesson.content_markdown || '';
  
  // Normalize key_points
  if (lesson.key_points) {
    if (typeof lesson.key_points === 'string') {
      try {
        lesson.key_points = JSON.parse(lesson.key_points);
      } catch (e) {
        lesson.key_points = [lesson.key_points];
      }
    }
    if (!Array.isArray(lesson.key_points)) {
      lesson.key_points = [lesson.key_points];
    }
  } else {
    lesson.key_points = [];
  }
  
  return lesson;
}

export async function completeLesson(userId, lessonId, topicId) {
  if (!supabase) return;
  const real_lessonId = await resolveId('lessons', lessonId);
  const real_topicId = await resolveId('topics', topicId);
  if (!real_lessonId || !real_topicId) return;

  console.log('[completeLesson] lessonId(slug):', lessonId, '-> UUID:', real_lessonId);
  console.log('[completeLesson] topicId(slug):', topicId, '-> UUID:', real_topicId);

  // 1. Marca aula como concluída
  const { error: upsertError } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: real_lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    }, { onConflict: 'user_id,lesson_id' });
  if (upsertError) {
    console.error('[completeLesson] upsert error:', upsertError);
    throw upsertError;
  }
  console.log('[completeLesson] upsert OK');

  // 2. Atualiza plano de estudos (percentual)
  // IMPORTANT: content functions expect SLUGS, not UUIDs
  const modules = await content.getTopicModulesAndLessons(topicId);
  const allLessonSlugs = modules.flatMap(m => m.lessons.map(l => l.id));
  const totalLessons = allLessonSlugs.length;
  console.log('[completeLesson] totalLessons from content:', totalLessons);

  if (totalLessons > 0) {
    // Resolve all lesson slugs to UUIDs for the DB query
    const allLessonUUIDs = (await Promise.all(
      allLessonSlugs.map(slug => resolveId('lessons', slug))
    )).filter(Boolean);

    // Buscar quais dessas o usuário completou
    const { data: progressRows, error: progressError } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', userId)
      .in('lesson_id', allLessonUUIDs);

    if (progressError) {
      console.error('[completeLesson] progress query error:', progressError);
      throw progressError;
    }

    const completedCount = (progressRows || []).filter(p => p.completed).length;
    const percent = Math.round((completedCount / totalLessons) * 100);
    console.log('[completeLesson] completed:', completedCount, '/', totalLessons, '=', percent + '%');

    await supabase
      .from('study_plans')
      .update({ percent_complete: percent, last_lesson_id: real_lessonId, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('topic_id', real_topicId);
  }

  invalidateCache(`disciplines:${userId}`);
}

export async function fetchLessonQuiz(lessonId) {
  if (!supabase) return [];
  const real_lessonId = await resolveId('lessons', lessonId);
  if (!real_lessonId) return [];

  // Find the lesson's topic via the chain: lesson -> module -> topic
  let lesson = null;
  const { data: lessonById, error } = await supabase
    .from('lessons')
    .select('id, module_id, modules!inner(topic_id)')
    .eq('id', real_lessonId)
    .single();

  if (error) {
    const { data: lessonBySlug } = await supabase
      .from('lessons')
      .select('id, module_id, modules!inner(topic_id)')
      .eq('slug', lessonId)
      .single();
    if (lessonBySlug) lesson = lessonBySlug;
  } else {
    lesson = lessonById;
  }

  if (!lesson || !lesson.modules) return [];

  const topicId = lesson.modules.topic_id;

  const { data: questions, error: qErr } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .limit(5);
    
  if (qErr || !questions) return [];

  return questions.map(q => ({
    id: q.slug,
    topic_id: topicId,
    question: q.question,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    option_e: q.option_e,
    correct_option: q.correct_option,
    explanation: q.explanation
  }));
}

export async function fetchTopicSimulado(topicId) {
  if (!supabase) return;
  const real_topicId = await resolveId('topics', topicId);
  if (!real_topicId) return;

  return await fetchQuestions(null, real_topicId, true, 10);
}


export async function getUserProfile(userId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  return data;
}

export async function uploadAvatar(userId, file) {
  if (!supabase) return null;
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    throw uploadError;
  }

  const { data: publicUrlData } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function updateUserProfile(userId, profileData) {
  if (!supabase) return null;
  // Usa update() e nÃ£o upsert(): o profile jÃ¡ existe nesse ponto (criado
  // pelo trigger handle_new_user no momento do signUp). upsert() dispara
  // um INSERT com ON CONFLICT, que exige uma policy de INSERT na tabela
  // profiles - policy que nÃ£o existe em supabase/rls_policies.sql (sÃ³ hÃ¡
  // policies de SELECT/UPDATE), entÃ£o falhava com "new row violates
  // row-level security policy".
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  return data;
}

// Garante que um profile existe para o usuÃ¡rio.
// Se nÃ£o existir, cria usando os dados do metadata OAuth (Google).
// Se jÃ¡ existir, retorna o existente.
export async function ensureUserProfile(user) {
  if (!supabase || !user) return null;

  // Primeiro tenta buscar o profile existente
  const { data: existing, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Se encontrou, retorna sem criar duplicata
  if (existing) return existing;

  // Se o erro nÃ£o for "not found" (PGRST116), loga e retorna null
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching profile in ensureUserProfile:', fetchError);
    return null;
  }

  // Profile nÃ£o existe â€” cria usando dados do OAuth metadata
  const meta = user.user_metadata || {};
  const full_name = meta.full_name || meta.name || '';
  const avatar_url = meta.avatar_url || meta.picture || '';
  const email = user.email || '';

  const { data: created, error: createError } = await supabase
    .from('profiles')
    .insert({ id: user.id, full_name, avatar_url, email })
    .select()
    .single();

  if (createError) {
    console.error('Error creating profile in ensureUserProfile:', createError);
    return null;
  }

  return created;
}


export async function getLastStudiedTopic(userId, disciplineId) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('study_sessions')
    .select('topic_id')
    .eq('user_id', userId)
    .eq('discipline_id', disciplineId)
    .order('started_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;
  return data.topic_id;
}

export async function startStudySession(userId, disciplineId, topicId) {
  if (!supabase) return;
  const real_disciplineId = await resolveId('disciplines', disciplineId);
  const real_topicId = await resolveId('topics', topicId);
  if (!real_disciplineId || !real_topicId) return;

  

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      discipline_id: real_disciplineId,
      topic_id: real_topicId,
      started_at: new Date().toISOString(),
      session_type: 'study',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function endStudySession(sessionId, durationSeconds) {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('study_sessions')
    .update({
      finished_at: new Date().toISOString(),
      duration_seconds: durationSeconds,
    })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchFlashcards(disciplineId, topicId = null) {
  if (!supabase) return;
  const real_disciplineId = await resolveId('disciplines', disciplineId);
  if (!real_disciplineId) return;

  let realFlashcards = [];
  
  if (supabase) {
    let query = supabase
      .from('flashcards')
      .select('*')
      .eq('discipline_id', real_disciplineId);
      
    if (topicId && topicId !== 'all') {
      const real_topicId = await resolveId('topics', topicId);
      if (real_topicId) query = query.eq('topic_id', real_topicId);
    }
      
    const { data, error } = await query;
      
    if (!error && data) {
      realFlashcards = data;
    } else if (error) {
      console.error('Error fetching flashcards:', error);
    }
  }

  let questions = await fetchQuestions(real_disciplineId, topicId);
  const realReviewQuestionIds = new Set(
    realFlashcards
      .filter(f => f.original_question_id)
      .map(f => f.original_question_id)
  );

  const questionUUIDs = await Promise.all(
    questions.map(async q => ({ ...q, _resolvedId: await resolveId('questions', q.id) }))
  );

  const derivedFlashcards = questionUUIDs
    .filter(q => !realReviewQuestionIds.has(q._resolvedId))
    .map(q => ({
      id: `derived_${q.id}`, // keep slug in derived ID (used by ensureFlashcardExists)
      discipline_id: q.discipline_id,
      topic_id: q.topic_id,
      question: q.question,
      answer: `${q['option_' + q.correct_option]} — ${q.explanation || ''}`.trim(),
      category: 'Conteúdo',
      derived: true,
    }));

  return [...realFlashcards, ...derivedFlashcards];
}

export async function ensureFlashcardExists(flashcard) {
  if (!supabase || !flashcard.derived) return flashcard.id;
  
  const questionId = flashcard.id.replace(/^derived_/, '');
  const real_questionId = await resolveId('questions', questionId);
  if (!real_questionId) return null;

  const { data: existing } = await supabase
    .from('flashcards')
    .select('id')
    .eq('original_question_id', real_questionId)
    .single();
    
  if (existing) return existing.id;
  
  const { data: created, error } = await supabase.from('flashcards').insert({
    original_question_id: real_questionId,
    discipline_id: flashcard.discipline_id,
    topic_id: flashcard.topic_id,
    question: flashcard.question,
    answer: flashcard.answer,
    category: flashcard.category || 'Conteúdo',
  }).select('id').single();

  if (error) {
    console.error('Error creating flashcard:', error);
    return null;
  }
  return created?.id;
}

export async function updateFlashcardProgress(userId, flashcardId, evaluation) {
  if (!supabase) return null;

  const intervals = {
    'errei': 1,     // 1 day
    'dificil': 3,   // 3 days
    'bom': 7,       // 7 days
    'facil': 15     // 15 days
  };

  const days = intervals[evaluation] || 1;
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + days);

  const { data, error } = await supabase
    .from('user_flashcard_progress')
    .upsert({
      user_id: userId,
      flashcard_id: flashcardId,
      status: evaluation,
      next_review_at: nextReview.toISOString(),
      last_reviewed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,flashcard_id' })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function fetchUserFlashcardProgress(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('user_flashcard_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) return [];
  return data;
}

export async function fetchQuestions(disciplineId, topicId = null, isSimulado = false, limit = null) {
  if (!supabase) return [];
  
  // Questions are linked to topics (questions.topic_id -> topics.id)
  // To filter by discipline: questions -> topics(discipline_id)
  let query = supabase.from('questions').select('*');
  
  if (topicId && topicId !== 'all') {
    // topicId here might be a UUID (from fetchTopicSimulado) or slug
    const real_topicId = await resolveId('topics', topicId);
    if (real_topicId) {
      query = query.eq('topic_id', real_topicId);
    }
  } else if (disciplineId) {
    // Get all topic UUIDs for this discipline, then filter questions
    const { data: discTopics } = await supabase
      .from('topics')
      .select('id')
      .eq('discipline_id', disciplineId);
    if (discTopics && discTopics.length > 0) {
      query = query.in('topic_id', discTopics.map(t => t.id));
    } else {
      return [];
    }
  }

  const { data: questions, error } = await query;
  if (error || !questions) return [];

  let mapped = questions.map(q => ({
    id: q.slug,
    discipline_id: disciplineId,
    topic_id: q.topic_id,
    question: q.question,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    option_e: q.option_e,
    correct_option: q.correct_option,
    explanation: q.explanation
  }));

  if (isSimulado) {
    mapped = mapped.sort(() => Math.random() - 0.5);
    if (limit) mapped = mapped.slice(0, limit);
  }

  return mapped;
}

export async function saveQuestionAttempt(userId, question, selectedOption) {
  if (!supabase) return null;

  // 1. Use the correct answer from the local question object
  const isCorrect = selectedOption === question.correct_option;

  const real_questionId = await resolveId('questions', question.id);
  if (!real_questionId) {
    console.error('Could not resolve question ID for', question.id);
    return null;
  }

  // 2. Save attempt
  const { data, error } = await supabase
    .from('question_attempts')
    .insert({
      user_id: userId,
      question_id: real_questionId,
      selected_option: selectedOption,
      is_correct: isCorrect,
    })
    .select()
    .single();

  if (error) throw error;

  // 3. Update total points if correct
  if (isCorrect) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_points')
      .eq('id', userId)
      .single();

    const currentPoints = profile?.total_points || 0;
    await supabase
      .from('profiles')
      .update({ total_points: currentPoints + 10 })
      .eq('id', userId);
  }

  invalidateCache(`stats:${userId}`);
  return { ...data, isCorrect };
}

export async function fetchGlobalStats(userId) {
  if (!supabase) return null;

  // 1. Total Hours Studied
  const { data: sessions } = await supabase
    .from('study_sessions')
    .select('duration_seconds')
    .eq('user_id', userId);

  const totalSeconds = sessions?.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) || 0;

  // 2. Questions Stats
  const { data: attempts } = await supabase
    .from('question_attempts')
    .select('is_correct')
    .eq('user_id', userId);

  const totalQuestions = attempts?.length || 0;
  const correctQuestions = attempts?.filter(a => a.is_correct).length || 0;
  const accuracyRate = totalQuestions ? Math.round((correctQuestions / totalQuestions) * 100) : 0;

  // 3. Current Streak
  const { data: streaks } = await supabase
    .from('study_streaks')
    .select('study_date')
    .eq('user_id', userId)
    .order('study_date', { ascending: false });

  // Simple streak logic: count consecutive days from today/yesterday
  let streak = 0;
  if (streaks && streaks.length > 0) {
    // This is a simplified streak check for the MVP
    streak = streaks.length;
  }

  return {
    totalStudySeconds: totalSeconds,
    totalQuestions,
    correctQuestions,
    accuracyRate,
    streak,
  };
}

export async function fetchUserProgress(disciplineId) {
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return null;

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('discipline_id', disciplineId)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching user progress:', error);
    }
    return null;
  }
  return data ? {
    ...data,
    percentComplete: data.percent_complete,
    hoursStudied: data.hours_studied,
    questionsAnswered: data.questions_answered,
    accuracyRate: data.accuracy_rate,
    disciplineId: data.discipline_id
  } : null;
}


// =============================================================
// Integração de Laboratório
// =============================================================

export async function fetchLabProgress(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('lab_progress')
    .select('item_id, completed')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error fetching lab progress:', error);
    return [];
  }
  return data;
}

export async function toggleLabItemCompletion(userId, itemId) {
  if (!supabase) return null;

  const { data: currentProgress } = await supabase
    .from('lab_progress')
    .select('completed')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .single();

  const newStatus = !currentProgress?.completed;

  const { error } = await supabase
    .from('lab_progress')
    .upsert({
      user_id: userId,
      item_id: itemId,
      completed: newStatus,
      completed_at: newStatus ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,item_id' });

  if (error) throw error;
  return newStatus;
}

export async function fetchFavoriteItems(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('favorites')
    .select('item_id, item_type')
    .eq('user_id', userId);
  if (error) return [];
  return data;
}

export async function toggleFavoriteItem(userId, itemId, itemType) {
  if (!supabase) return false;

  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('item_id', itemId)
    .eq('item_type', itemType)
    .single();

  if (existing) {
    await supabase.from('favorites').delete().eq('id', existing.id);
    return false;
  } else {
    await supabase.from('favorites').insert({
      user_id: userId,
      item_id: itemId,
      item_type: itemType
    });
    return true;
  }
}



// =============================================================
// Progresso por Tópico e Disciplinaoteca (Favoritos)
// =============================================================
export async function toggleFavoriteBook(userId, bookInfo) {
  if (!supabase) return null;
  
  const { data: existing } = await supabase
    .from('favorite_books')
    .select('id')
    .eq('user_id', userId)
    .eq('work_key', bookInfo.work_key)
    .single();

  if (existing) {
    await supabase.from('favorite_books').delete().eq('id', existing.id);
    return false; // removido
  } else {
    await supabase.from('favorite_books').insert({
      user_id: userId,
      work_key: bookInfo.work_key,
      title: bookInfo.title,
      author: bookInfo.author,
      cover_url: bookInfo.cover_url
    });
    return true; // adicionado
  }
}

export async function fetchFavoriteBooks(userId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('favorite_books')
    .select('*')
    .eq('user_id', userId);
  if (error) {
    console.error('Error fetching favorite books:', error);
    return [];
  }
  return data;
}

// Integar questoes erradas ao sistema de revisao (Flashcards)
export async function addWrongQuestionToReview(disciplineId, topicId, questionObj) {
  if (!supabase) return;
  const real_disciplineId = await resolveId('disciplines', disciplineId);
  const real_topicId = await resolveId('topics', topicId);
  const real_questionId = await resolveId('questions', questionObj.id);

  if (!real_disciplineId || !real_topicId || !real_questionId) return;

  // Verifica se já existe um flashcard para essa questão pelo original_question_id
  const { data: existing } = await supabase
    .from('flashcards')
    .select('id')
    .eq('original_question_id', real_questionId)
    .single();

  if (!existing) {
    // Cria flashcard (o banco gera o UUID primário)
    const answerText = questionObj['option_' + questionObj.correct_option];
    await supabase.from('flashcards').insert({
      original_question_id: real_questionId,
      discipline_id: real_disciplineId,
      topic_id: real_topicId,
      question: questionObj.question,
      answer: answerText,
      category: 'Revisão Automática'
    });
  }
}

export async function fetchLeaderboard() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('leaderboard_view')
    .select('id, full_name, avatar_url, total_points')
    .order('total_points', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
  return data;
}

export async function saveStudySession(sessionData) {
    if (!supabase) return;
    const { error } = await supabase.from('study_sessions').insert(sessionData);
    if (error) {
      console.error('Error saving study session:', error);
    }
    if (sessionData.user_id) {
      invalidateCache(`stats:${sessionData.user_id}`);
      invalidateCache(`disciplines:${sessionData.user_id}`);
    }
  }
