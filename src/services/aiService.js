import { supabase } from './supabaseClient';

/**
 * Service for interacting with BioStudy AI features.
 * All calls are routed through Supabase Edge Functions for security.
 */
export const aiService = {
  /**
   * Explains a specific topic based on a user question.
   * @param {Object} params - { topic, question, context }
   * @returns {Promise<{success: boolean, answer?: string, error?: string}>}
   */
  async explainTopic({ topic, question, context = 'Estudante de Biomedicina' }) {
    try {
      // We call the Supabase Edge Function 'ai-explain'
      const { data, error } = await supabase.functions.invoke('ai-explain', {
        body: { topic, question, context },
      });

      if (error) throw error;
      if (!data) throw new Error('No response from AI service');

      return data;
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error.message || 'Não foi possível consultar a IA agora.',
      };
    }
  },
};
