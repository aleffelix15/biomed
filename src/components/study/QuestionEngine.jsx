import React, { useState } from 'react';
import QuestionCard from '../domain/QuestionCard';
import { saveQuestionAttempt, addWrongQuestionToReview } from '../../services/supabaseService';
import { useAuth } from '../../state/AuthContext';
import { ChevronRight } from 'lucide-react';
import { theme } from '../../theme/tokens';

export default function QuestionEngine({ items, allTopics, onFinish }) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredOption, setAnsweredOption] = useState(null);
  const [sessionAnswers, setSessionAnswers] = useState([]); // { q, selected, correct }

  const currentItem = items[currentIndex];

  const handleAnswer = async (option) => {
    if (answeredOption) return;
    setAnsweredOption(option);
    
    const isCorrect = option === currentItem.correct_option;
    const answerData = { 
      questionId: currentItem.id, 
      topicId: currentItem.topic_id, 
      selected: option, 
      correct: isCorrect 
    };
    
    setSessionAnswers(prev => [...prev, answerData]);

    if (user) {
      try {
        await saveQuestionAttempt(user.id, currentItem, option);
        if (!isCorrect) {
          await addWrongQuestionToReview(currentItem.discipline_id, currentItem.topic_id, currentItem);
        }
      } catch (err) {
        console.error("Error saving attempt:", err);
      }
    }
  };

  const nextQuestion = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnsweredOption(null);
    } else {
      const topicStats = {};
      sessionAnswers.forEach(ans => {
        if (!topicStats[ans.topicId]) {
          topicStats[ans.topicId] = { 
            total: 0, 
            correct: 0, 
            name: allTopics.find(t => t.id === ans.topicId)?.title || 'Tópico Desconhecido' 
          };
        }
        topicStats[ans.topicId].total++;
        if (ans.correct) topicStats[ans.topicId].correct++;
      });

      onFinish({
        total: items.length,
        correct: sessionAnswers.filter(a => a.correct).length,
        topicStats
      });
    }
  };

  if (items.length === 0) return null;

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 32, height: '100%' }}>
      <div style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 600, width: '100%', textAlign: 'center', marginTop: 10 }}>
        Questão {currentIndex + 1} de {items.length}
      </div>
      
      <QuestionCard
        question={currentItem}
        selectedOption={answeredOption}
        isAnswered={!!answeredOption}
        onAnswer={handleAnswer}
        showFeedback={true}
      />

      <button
        onClick={nextQuestion}
        disabled={!answeredOption}
        style={{
          width: "100%",
          maxWidth: 400,
          padding: 16,
          borderRadius: 12,
          background: answeredOption ? theme.primary : theme.surface,
          color: answeredOption ? theme.bg : theme.textSecondary,
          border: "none",
          fontWeight: 700,
          fontSize: 15,
          cursor: answeredOption ? "pointer" : "not-allowed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: answeredOption ? 1 : 0.6
        }}
      >
        {currentIndex < items.length - 1 ? 'Próxima Questão' : 'Finalizar Sessão'} <ChevronRight size={18} />
      </button>
    </div>
  );
}

