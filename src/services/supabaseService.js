import { supabase } from './supabaseClient';
import * as content from './contentService';


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
  const disciplines = content.getDisciplines();
  if (!supabase || !userId) return disciplines.map(d => ({ ...d, progress: 0, topicsCount: d.topics_count }));

  const { data: progress, error: progError } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (progError) throw progError;

  return disciplines.map(d => {
    const userProg = progress?.find(p => p.discipline_id === d.id);
    return {
      ...d,
      progress: userProg?.percent_complete || 0,
      topicsCount: d.topics_count
    };
  });
}





export async function fetchTopicsByDiscipline(discipline) {
  const dId = discipline.id || discipline;
  const topics = content.getTopicsByDiscipline(dId);
  return topics;
}

// NOVO MOTOR DE CONTEÃšDO
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
  const modules = content.getTopicModulesAndLessons(topicId);
  
  if (!supabase || !userId) return modules;
  
  const { data: lessonProg } = await supabase
    .from('lesson_progress')
    .select('lesson_id, completed')
    .eq('user_id', userId);
    
  if (lessonProg) {
    modules.forEach(m => {
      m.lessons.forEach(l => {
        const prog = lessonProg.find(p => p.lesson_id === l.id);
        l.completed = prog ? prog.completed : false;
      });
    });
  }
  
  return modules;
}

export async function fetchLesson(lessonId) { return null; }

export async function completeLesson(userId, lessonId, topicId) {
  if (!supabase) return;

  // 1. Marca aula como concluída
  const { error: upsertError } = await supabase
    .from('lesson_progress')
    .upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString()
    });
  if (upsertError) throw upsertError;

  // 2. Atualiza plano de estudos (percentual)
  // Busca todas as aulas do topicId via conteúdo local
  const modules = content.getTopicModulesAndLessons(topicId);
  const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id));
  const totalLessons = allLessonIds.length;

  if (totalLessons > 0) {
    // Buscar quais dessas o usuário completou
    const { data: progressRows, error: progressError } = await supabase
      .from('lesson_progress')
      .select('lesson_id, completed')
      .eq('user_id', userId)
      .in('lesson_id', allLessonIds);

    if (progressError) throw progressError;

    const completedCount = (progressRows || []).filter(p => p.completed).length;
    const percent = Math.round((completedCount / totalLessons) * 100);

    await supabase
      .from('study_plans')
      .update({ percent_complete: percent, last_lesson_id: lessonId, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('topic_id', topicId);
  }
}

export async function fetchLessonQuiz(lessonId) {
  if (!supabase) return [];

  // Since local questions don't have a lesson_id, we derive the topicId from the lessonId.
  // Local lesson IDs follow pattern: "les_{discipline}_{topic}_{index}"
  // Example: "les_g1_1" -> we need to find the topic this belongs to.
  // A better way: find the topic that contains this lessonId.

  const allTopicIds = [];
  // We search through all topics in the local content system
  const topicFiles = import.meta.glob('../content/disciplines/*/topics/*/topic.json', { eager: true });

  let targetTopicId = null;
  for (const path in topicFiles) {
    const topic = topicFiles[path].default;
    const hasLesson = topic.modules?.some(m => m.lessons?.some(l => l.id === lessonId));
    if (hasLesson) {
      targetTopicId = topic.id;
      break;
    }
  }

  if (!targetTopicId) return [];

  // Return a subset of questions from that topic as a "mini-quiz"
  return content.getQuizQuestions(targetTopicId, false, 5);
}

export async function fetchTopicSimulado(topicId) {
  return content.getQuizQuestions(topicId, true, 10);
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

export async function fetchFlashcards(disciplineId, topicId = null) {
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
      id: `derived_${q.id}`,
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

export async function fetchQuestions(disciplineId, topicId = null, isSimulado = false, limit = null) {
  let all = content.getAllQuestionsByDiscipline(disciplineId);
  if (topicId) {
    all = all.filter(q => q.topic_id === topicId);
  }
  if (isSimulado) {
    all = [...all].sort(() => Math.random() - 0.5);
    if (limit) all = all.slice(0, limit);
  }
  return Promise.resolve(all);
}

export async function saveQuestionAttempt(userId, question, selectedOption) {
  if (!supabase) return null;

  // 1. Use the correct answer from the local question object
  const isCorrect = selectedOption === question.correct_option;

  // 2. Save attempt
  const { data, error } = await supabase
    .from('question_attempts')
    .insert({
      user_id: userId,
      question_id: question.id,
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


// =============================================================
// Integração com Biblioteca (Favoritos)
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

  // Gera ID determinístico para evitar duplicatas e garantir consistência
  const reviewId = `review_${questionObj.id}`;

  // Verifica se já existe um flashcard para essa questão pelo ID
  const { data: existing } = await supabase
    .from('flashcards')
    .select('id')
    .eq('id', reviewId)
    .single();

  if (!existing) {
    // Cria flashcard
    const answerText = questionObj['option_' + questionObj.correct_option];
    await supabase.from('flashcards').insert({
      id: reviewId,
      discipline_id: disciplineId,
      topic_id: topicId,
      question: questionObj.question,
      answer: answerText,
      category: 'Revisão Automática'
    });
  }
}

export async function fetchLeaderboard() {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('profiles')
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
}
