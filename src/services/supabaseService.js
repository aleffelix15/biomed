import { supabase } from './supabaseClient';
import * as mockService from './mockService';

export async function fetchDisciplines() {
  if (!supabase) return mockService.fetchDisciplines();
  
  const { data, error } = await supabase.from('disciplines').select('*');
  if (error) {
    console.error('Error fetching disciplines from Supabase:', error);
    return mockService.fetchDisciplines();
  }
  return data;
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
  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profileData })
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
  return data;
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
    if (error.code !== 'PGRST116') { // not found
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
