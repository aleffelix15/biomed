import React, { useState } from 'react';
import { theme, alpha } from '../../theme/tokens';
import { X, CheckCircle, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

export default function LabQuizModal({ quiz, onClose, onFinish }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const question = quiz[currentIdx];

  const handleSelect = (opt) => {
    if (showExplanation) return;
    setSelectedOption(opt);
    setShowExplanation(true);
    if (opt.id === question.correctOption) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < quiz.length - 1) {
      setCurrentIdx(i => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      onFinish(score, quiz.length);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)',
      display: 'flex', flexDirection: 'column', zIndex: 1000
    }}>
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: theme.textSecondary, fontWeight: 600 }}>Questão {currentIdx + 1} de {quiz.length}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.text, padding: 4 }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
        <Card padding={20} style={{ background: theme.card, border: `1px solid ${theme.line}`, marginBottom: 20 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: theme.text, margin: 0, lineHeight: 1.5 }}>
            {question.text}
          </p>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map(opt => {
            const isSelected = selectedOption?.id === opt.id;
            const isCorrect = opt.id === question.correctOption;
            let bgColor = theme.surface;
            let borderColor = theme.line;
            let icon = null;

            if (showExplanation) {
              if (isCorrect) {
                bgColor = alpha(theme.primary, '15');
                borderColor = theme.primary;
                icon = <CheckCircle size={20} color={theme.primary} />;
              } else if (isSelected) {
                bgColor = alpha(theme.danger, '15');
                borderColor = theme.danger;
                icon = <XCircle size={20} color={theme.danger} />;
              }
            } else if (isSelected) {
              borderColor = theme.primary;
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px', borderRadius: 12, background: bgColor,
                  border: `2px solid ${borderColor}`, color: theme.text,
                  textAlign: 'left', cursor: showExplanation ? 'default' : 'pointer'
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 500 }}>{opt.text}</span>
                {icon}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: alpha(theme.primary, '10'), border: `1px solid ${theme.primary}` }}>
            <h4 style={{ margin: '0 0 8px', color: theme.primary, fontSize: 14 }}>Explicação</h4>
            <p style={{ margin: 0, color: theme.text, fontSize: 14, lineHeight: 1.5 }}>{question.explanation}</p>
          </div>
        )}
      </div>

      <div style={{ padding: '16px', borderTop: `1px solid ${theme.line}`, background: theme.card }}>
        <button
          onClick={handleNext}
          disabled={!showExplanation}
          style={{
            width: '100%', padding: '16px', borderRadius: 12, background: theme.primary,
            color: theme.bg, fontWeight: 700, fontSize: 16, border: 'none',
            opacity: showExplanation ? 1 : 0.5, cursor: showExplanation ? 'pointer' : 'default'
          }}
        >
          {currentIdx < quiz.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
        </button>
      </div>
    </div>
  );
}

