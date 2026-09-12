import React, { useState, useEffect } from 'react';
import QuestionCard from '../domain/QuestionCard';
import { saveQuestionAttempt, addWrongQuestionToReview } from '../../services/supabaseService';
import { useAuth } from '../../state/AuthContext';
import { ChevronRight, ChevronLeft, Flag, CheckCircle } from 'lucide-react';
import { theme } from '../../theme/tokens';

export default function ExamEngine({ items, allTopics, isExamMode, onFinish }) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [index]: option }
  const [flagged, setFlagged] = useState({}); // { [index]: boolean }
  
  // Timer (Exam: 10 mins, Simulado: no strict timer but tracks duration)
  const initialTime = isExamMode ? items.length * 60 : 0; // 1 min per question for exams
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      if (isExamMode) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinish(true);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamMode]);

  const handleAnswer = (option) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: option }));
  };

  const toggleFlag = () => {
    setFlagged(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleFinish = async (forced = false) => {
    if (!forced && Object.keys(answers).length < items.length) {
      if (!window.confirm("Você ainda tem questões sem resposta. Deseja finalizar mesmo assim?")) {
        return;
      }
    }

    const topicStats = {};
    let correctCount = 0;

    const promises = items.map(async (q, idx) => {
      const selected = answers[idx];
      const isCorrect = selected === q.correct_option;
      
      if (selected) {
        if (isCorrect) correctCount++;
        
        if (!topicStats[q.topic_id]) {
          topicStats[q.topic_id] = { 
            total: 0, 
            correct: 0, 
            name: allTopics.find(t => t.id === q.topic_id)?.title || 'Tópico Desconhecido' 
          };
        }
        topicStats[q.topic_id].total++;
        if (isCorrect) topicStats[q.topic_id].correct++;

        if (user) {
          await saveQuestionAttempt(user.id, q, selected).catch(e => console.error(e));
          if (!isCorrect) {
            await addWrongQuestionToReview(q.discipline_id, q.topic_id, q).catch(e => console.error(e));
          }
        }
      }
    });

    await Promise.all(promises);

    onFinish({
      total: items.length,
      correct: correctCount,
      topicStats,
      timeTaken: timeElapsed
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (items.length === 0) return null;
  const currentItem = items[currentIndex];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", height: '100%' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ color: theme.textSecondary, fontSize: 15, fontWeight: 600 }}>
          Questão {currentIndex + 1} de {items.length}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isExamMode ? (
            <div style={{ color: timeLeft < 60 ? theme.danger : theme.text, fontWeight: 700, fontSize: 16 }}>
              ⏱ {formatTime(timeLeft)}
            </div>
          ) : (
            <div style={{ color: theme.textSecondary, fontWeight: 600, fontSize: 15 }}>
              ⏱ {formatTime(timeElapsed)}
            </div>
          )}
          
          <button 
            onClick={toggleFlag}
            style={{ background: 'none', border: 'none', color: flagged[currentIndex] ? theme.secondary : theme.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Flag size={20} fill={flagged[currentIndex] ? theme.secondary : 'none'} />
          </button>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', overflowY: 'auto', paddingBottom: 20 }}>
        <QuestionCard
          question={currentItem}
          selectedOption={answers[currentIndex]}
          isAnswered={!!answers[currentIndex]}
          onAnswer={handleAnswer}
          showFeedback={false} // NEVER SHOW FEEDBACK DURING EXAM
        />
      </div>

      {/* Bottom Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${theme.line}`, paddingTop: 16, marginTop: 'auto' }}>
        <button
          onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
          disabled={currentIndex === 0}
          style={{ padding: '12px 16px', borderRadius: 12, background: theme.surface, color: theme.text, border: 'none', fontWeight: 600, cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentIndex === 0 ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <ChevronLeft size={18} /> Anterior
        </button>

        {currentIndex === items.length - 1 ? (
          <button
            onClick={() => handleFinish(false)}
            style={{ padding: '12px 24px', borderRadius: 12, background: theme.primary, color: theme.bg, border: 'none', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <CheckCircle size={18} /> Finalizar
          </button>
        ) : (
          <button
            onClick={() => setCurrentIndex(p => Math.min(items.length - 1, p + 1))}
            style={{ padding: '12px 16px', borderRadius: 12, background: theme.surface, color: theme.text, border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            Próxima <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Mini Progress Bar */}
      <div style={{ display: 'flex', gap: 4, marginTop: 20, overflowX: 'auto', paddingBottom: 8 }}>
        {items.map((_, idx) => (
          <div 
            key={idx} 
            onClick={() => setCurrentIndex(idx)}
            style={{ 
              width: 24, height: 24, borderRadius: 12, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: idx === currentIndex ? theme.primary : (answers[idx] ? alpha(theme.primary, '30') : theme.surface),
              color: idx === currentIndex ? theme.bg : (answers[idx] ? theme.primary : theme.textSecondary),
              border: flagged[idx] ? `2px solid ${theme.secondary}` : 'none'
            }}
          >
            {idx + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
