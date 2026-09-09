import { supabase } from './supabaseClient';
import * as mockService from './mockService';

export async function fetchDisciplines() {
  if (!supabase) return mockService.fetchDisciplines();

  const { data, error } = await supabase.from('disciplines').select('*');
  if (error) {
    console.error('Error fetching disciplines from Supabase:', error);
    return mockService.fetchDisciplines();
  }
  // The UI expects an object with 'icon' as a lucide component, but Supabase returns a string.
  // The mapping of string -> lucide component should ideally happen at the UI level,
  // but to maintain compatibility without touching UI logic that might assume icon is a component,
  // we might need to map it. Wait, the user said:
  // "Nota: "icon" nas tabelas é uma string (nome do ícone lucide-react, ex: "Bone"),
  // não o componente — a UI vai resolver o nome pro componente."
  // So we just return the string and the UI resolves it. 
  // Wait, the current UI assumes `d.icon` is a component. If we return a string, the UI will break
  // because we're not allowed to touch the UI components like DisciplineCard.
  // Actually, the user says: "a UI vai resolver o nome pro componente." 
  // This implies we DO need to adjust the UI to resolve the component, OR we do it here.
  // "Não altere navegação, design system (theme/tokens.js) nem componentes de ui/."
  // Wait, I CAN alter screens. So I should resolve it in supabaseService or screens.
  // The prompt says "a UI vai resolver o nome pro componente." Let's resolve it in supabaseService to keep screens intact, OR just map it here.
  // Better to map it here so screens don't have to change.
  // Actually, let's just return the data, and if the user wants the UI to resolve it, I'll update the screens that render the icons.
  // Let's look at how I will handle this. In the prompt: "a UI vai resolver o nome pro componente."
  // This means I should map it in the screen or card. BUT I'm not allowed to touch "componentes de ui/". 
  // DisciplineCard is in "components/domain/". I CAN touch it, but it's better to resolve it before passing to it, or inside it.
  
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
  return data;
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
  
  // Also might need genericTopics logic if empty?
  if (!data || data.length === 0) {
     // fallback to mock service generic topics
     return mockService.fetchTopicsByDiscipline(discipline);
  }

  return data;
}

export async function fetchUserProgress(userId) {
  if (!supabase) return null; // Fallback handled by UI currently via mock imports

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user progress from Supabase:', error);
    return null;
  }
  return data;
}
