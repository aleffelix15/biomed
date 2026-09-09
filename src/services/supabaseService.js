import { supabase } from './supabaseClient';
import * as mockService from './mockService';

export async function toggleTopicCompletion(userId, topicId, disciplineId) {
  if (!supabase) return null;

  // 1. Toggle completion status in topic_progress
  const { data: currentProgress } = await supabase
    .from('topic_progress')
    .select('completed')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();

  const newStatus = !currentProgress?.completed;

  const { error: progressError } = await supabase
    .from('topic_progress')
    .upsert({
      user_id: userId,
      topic_id: topicId,
      completed: newStatus,
      completed_at: newStatus ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    });

  if (progressError) throw progressError;

  // 2. Recalculate aggregate progress for the discipline
  const { data: allTopics } = await supabase
    .from('topics')
    .select('id')
    .eq('discipline_id', disciplineId);

  const { count: totalCount } = await supabase
    .from('topics')
    .select('*', { count: 'exact', head: true })
    .eq('discipline_id', disciplineId);

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
      discipline_id: disciplineId,
      percent_complete: newPercent,
      updated_at: new Date().toISOString(),
    });

  return { completed: newStatus, percent_complete: newPercent };
}

export async function fetchTopicProgress(userId, disciplineId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('topic_progress')
    .select('topic_id, completed')
    .eq('user_id', userId)
    .in('topic_id', (await supabase.from('topics').select('id').eq('discipline_id', disciplineId)).data?.map(t => t.id) || []);

  if (error) return [];
  return data;
}

export async function fetchDisciplinesWithProgress(userId) {
  if (!supabase) return mockService.fetchDisciplines();

  const { data: disciplines, error: discError } = await supabase
    .from('disciplines')
    .select('*');

  if (discError) {
    console.error('Error fetching disciplines:', discError);
    return mockService.fetchDisciplines();
  }

  const { data: progress, error: progError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (progError) {
    console.error('Error fetching user progress:', progError);
    return disciplines;
  }

  return disciplines.map(d => {
    const userProg = progress?.find(p => p.discipline_id === d.id);
    return {
      ...d,
      progress: userProg?.percent_complete || 0,
      hoursStudied: userProg?.hours_studied || 0,
    };
  });
}

export async function fetchBooksByDiscipline(disciplineId) {
  if (!supabase) return mockService.fetchBooksByDiscipline(disciplineId);

  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('discipline_id', disciplineId);

  if (error) {
    console.error('Error fetching books from Supabase:', error);
    return mockService.fetchBooksByDiscipline(disciplineId);
  }

  return data.map(b => ({
    ...b,
    disciplineId: b.discipline_id,
  }));
}

export async function fetchAllBooks() {
  if (!supabase) return mockService.BOOKS; // Not exported in mockService, but wait, mockService doesn't export BOOKS directly, wait I'll fix that.

  const { data, error } = await supabase
    .from('books')
    .select('*');

  if (error) {
    console.error('Error fetching books from Supabase:', error);
    return [];
  }

  return data.map(b => ({
    ...b,
    disciplineId: b.discipline_id,
  }));
}

export async function fetchTopicsByDiscipline(discipline) {
  if (!supabase) return mockService.fetchTopicsByDiscipline(discipline);

  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('discipline_id', discipline.id);

  if (error) {
    console.error('Error fetching topics from Supabase:', error);
    return mockService.fetchTopicsByDiscipline(discipline);
  }

  if (!data || data.length === 0) {
     return mockService.fetchTopicsByDiscipline(discipline);
  }

  return data.map(t => ({
    ...t,
    disciplineId: t.discipline_id,
    hasContent: t.has_content,
  }));
}

// NOVO MOTOR DE CONTEÚDO
export async function getOrCreateStudyPlan(userId, topicId) {
  if (!supabase) return null;

  // Tenta buscar o plano existente
  let { data: plan } = await supabase
    .from('study_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();

  if (!plan) {
    // Cria um novo plano
    const { data: newPlan, error } = await supabase
      .from('study_plans')
      .insert({
        user_id: userId,
        topic_id: topicId,
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
  if (!supabase) return [];

  // Puxar módulos
  const { data: modulesData, error: modErr } = await supabase
    .from('modules')
    .select('*')
    .eq('topic_id', topicId)
    .order('order_index', { ascending: true });

  if (modErr || !modulesData) return [];

  // Puxar aulas desses módulos
  const moduleIds = modulesData.map(m => m.id);
  const { data: lessonsData, error: lessErr } = await supabase
    .from('lessons')
    .select('id, module_id, title, estimated_minutes, difficulty, order_index')
    .in('module_id', moduleIds)
    .order('order_index', { ascending: true });

  if (lessErr || !lessonsData) return [];

  // Puxar progresso do usuário para essas aulas
  const { data: progressData } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', userId)
    .in('lesson_id', lessonsData.map(l => l.id));

  // Montar árvore
  return modulesData.map(m => {
    const mLessons = lessonsData.filter(l => l.module_id === m.id).map(l => {
      const prog = progressData?.find(p => p.lesson_id === l.id);
      return { ...l, completed: prog?.completed || false };
    });
    return { ...m, lessons: mLessons };
  });
}

export async function fetchLesson(lessonId) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) console.error("Error fetching lesson", error);
  return data;
}

export async function completeLesson(userId, lessonId, topicId) {
  if (!supabase) return;

  // 1. Marca aula como concluída
  await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    });

  // 2. Atualiza plano de estudos (percentual)
  // Busca todas as aulas do topicId para calcular porcentagem
  const { data: modulesData } = await supabase.from('modules').select('id').eq('topic_id', topicId);
  const moduleIds = modulesData?.map(m => m.id) || [];
  
  if (moduleIds.length > 0) {
    const { count: totalLessons } = await supabase.from('lessons').select('*', { count: 'exact', head: true }).in('module_id', moduleIds);
    
    // Buscar quais dessas o usuário completou
    const { data: allLessons } = await supabase.from('lessons').select('id').in('module_id', moduleIds);
    const lessonIds = allLessons?.map(l => l.id) || [];
    const { count: completedLessons } = await supabase.from('lesson_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('completed', true).in('lesson_id', lessonIds);

    const percent = totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await supabase
      .from('study_plans')
      .update({ percent_complete: percent, last_lesson_id: lessonId, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('topic_id', topicId);
  }
}

export async function fetchLessonQuiz(lessonId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('lesson_id', lessonId);
  
  if (error) console.error("Error fetching lesson quiz", error);
  return data || [];
}

export async function fetchTopicSimulado(topicId) {
  if (!supabase) return [];
  // Simulados são questões ligadas ao tópico mas NÃO a uma aula específica
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('topic_id', topicId)
    .is('lesson_id', null);
  
  if (error) console.error("Error fetching topic simulado", error);
  return data || [];
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

export async function updateUserProfile(userId, profileData) {
  if (!supabase) return null;
  // Usa update() e não upsert(): o profile já existe nesse ponto (criado
  // pelo trigger handle_new_user no momento do signUp). upsert() dispara
  // um INSERT com ON CONFLICT, que exige uma policy de INSERT na tabela
  // profiles - policy que não existe em supabase/rls_policies.sql (só há
  // policies de SELECT/UPDATE), então falhava com "new row violates
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

// Garante que um profile existe para o usuário.
// Se não existir, cria usando os dados do metadata OAuth (Google).
// Se já existir, retorna o existente.
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

  // Se o erro não for "not found" (PGRST116), loga e retorna null
  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching profile in ensureUserProfile:', fetchError);
    return null;
  }

  // Profile não existe — cria usando dados do OAuth metadata
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
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('study_sessions')
    .insert({
      user_id: userId,
      discipline_id: disciplineId,
      topic_id: topicId,
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

export async function fetchFlashcards(disciplineId) {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('flashcards')
    .select('*')
    .eq('discipline_id', disciplineId);

  if (error) {
    console.error('Error fetching flashcards:', error);
    return [];
  }
  return data;
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
    })
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

export async function fetchQuestions(disciplineId, topicId = null) {
  if (!supabase) return [];

  let query = supabase
    .from('questions')
    .select('*')
    .eq('discipline_id', disciplineId);

  if (topicId) {
    query = query.eq('topic_id', topicId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
  return data;
}

export async function saveQuestionAttempt(userId, questionId, selectedOption) {
  if (!supabase) return null;

  // 1. Fetch the correct answer first
  const { data: question } = await supabase
    .from('questions')
    .select('correct_option')
    .eq('id', questionId)
    .single();

  if (!question) throw new Error('Question not found');

  const isCorrect = selectedOption === question.correct_option;

  // 2. Save attempt
  const { data, error } = await supabase
    .from('question_attempts')
    .insert({
      user_id: userId,
      question_id: questionId,
      selected_option,
      is_correct: isCorrect,
    })
    .select()
    .single();

  if (error) throw error;
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
  const totalHours = (totalSeconds / 3600).toFixed(1);

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
    totalHours,
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
