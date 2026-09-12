import React, { useState, useEffect } from 'react';
import { theme } from '../../theme/tokens';
import { ChevronLeft, Bookmark, CheckCircle, BrainCircuit } from 'lucide-react';
import { useAuth } from '../../state/AuthContext';
import { toggleLabItemCompletion, toggleFavoriteItem } from '../../services/supabaseService';
import LabQuizModal from './LabQuizModal';

export default function LabDetailView({ item, onBack, initialCompleted, initialFavorited, onUpdateStatus }) {
  const { user } = useAuth();
  const [completed, setCompleted] = useState(initialCompleted);
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  const handleToggleComplete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const newStatus = await toggleLabItemCompletion(user.id, item.id);
      setCompleted(newStatus);
      onUpdateStatus(item.id, newStatus, favorited);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) return;
    try {
      const newStatus = await toggleFavoriteItem(user.id, item.id, 'lab_item');
      setFavorited(newStatus);
      onUpdateStatus(item.id, completed, newStatus);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFinishQuiz = (score, total) => {
    setQuizScore({ score, total });
    setShowQuiz(false);
    if (!completed) {
      handleToggleComplete(); // Auto complete on finish quiz
    }
  };

  return (
    <div style={{ padding: "0 0 90px", minHeight: "100%", background: theme.bg }}>
      
      {/* Navbar fixa */}
      <div style={{ 
        position: 'sticky', top: 0, background: theme.card, zIndex: 10,
        padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.line}`
      }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: theme.textSecondary, display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, cursor: 'pointer', padding: 0 }}>
          <ChevronLeft size={20} /> Voltar
        </button>
        <button onClick={handleToggleFavorite} style={{ background: 'none', border: 'none', color: favorited ? theme.primary : theme.textSecondary, cursor: 'pointer', padding: 0 }}>
          <Bookmark size={22} fill={favorited ? theme.primary : 'none'} />
        </button>
      </div>

      <div style={{ padding: '24px 16px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {item.tags.map(tag => (
            <span key={tag} style={{ padding: '4px 10px', background: theme.surface, color: theme.primary, borderRadius: 12, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
              {tag}
            </span>
          ))}
        </div>
        
        <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.text, margin: '0 0 12px', lineHeight: 1.2 }}>{item.title}</h1>
        <p style={{ fontSize: 15, color: theme.textSecondary, margin: '0 0 24px', lineHeight: 1.5 }}>{item.description}</p>

        {/* Content Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {item.content.map((sec, idx) => (
            <div key={idx}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, margin: '0 0 12px', paddingBottom: 8, borderBottom: `1px solid ${theme.line}` }}>
                {sec.title}
              </h3>
              {sec.text && <p style={{ fontSize: 15, color: theme.text, lineHeight: 1.6, margin: 0 }}>{sec.text}</p>}
              {sec.list && (
                <ul style={{ margin: 0, paddingLeft: 20, color: theme.text, fontSize: 15, lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {sec.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {quizScore && (
          <div style={{ marginTop: 32, padding: 20, background: theme.surface, borderRadius: 16, border: `1px solid ${theme.primary}`, textAlign: 'center' }}>
            <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 8 }}>Resultado do Quiz</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: theme.text }}>
              {quizScore.score} / {quizScore.total} acertos
            </div>
          </div>
        )}

        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {item.quiz && item.quiz.length > 0 && !quizScore && (
            <button
              onClick={() => setShowQuiz(true)}
              style={{
                width: '100%', padding: '16px', borderRadius: 12, background: theme.surface,
                color: theme.primary, border: `2px solid ${theme.primary}`, fontWeight: 700, fontSize: 15,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
              }}
            >
              <BrainCircuit size={20} /> Testar Conhecimento
            </button>
          )}

          <button
            onClick={handleToggleComplete}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', borderRadius: 12, background: completed ? theme.surface : theme.primary,
              color: completed ? theme.primary : theme.bg, border: completed ? `1px solid ${theme.line}` : 'none',
              fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
            }}
          >
            {completed ? <><CheckCircle size={20} /> Estudado</> : 'Marcar como Concluído'}
          </button>
        </div>
      </div>

      {showQuiz && (
        <LabQuizModal 
          quiz={item.quiz} 
          onClose={() => setShowQuiz(false)} 
          onFinish={handleFinishQuiz} 
        />
      )}
    </div>
  );
}
