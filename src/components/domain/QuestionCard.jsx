import React, { useState } from 'react';
import { theme } from '../../theme/tokens';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function QuestionCard({ question, onAnswer, selectedOption, isAnswered }) {
  const options = ['a', 'b', 'c', 'd', 'e'].filter(opt => question[`option_${opt}`]);

  return (
    <div style={{ width: '100%', maxWidth: 600, margin: '0 auto' }}>
      <Card padding={24} style={{ background: theme.card, border: 'none', marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: theme.primary, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>
          Questão
        </div>
        <div style={{ fontSize: 18, color: theme.text, fontWeight: 600, lineHeight: 1.4, marginBottom: 24 }}>
          {question.question}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map(opt => {
            const optionText = question[`option_${opt}`];
            let bgColor = theme.surface;
            let borderColor = theme.line;
            let textColor = theme.text;

            if (isAnswered) {
              if (opt === question.correct_option) {
                bgColor = theme.primary;
                borderColor = theme.primary;
                textColor = theme.bg;
              } else if (selectedOption === opt) {
                bgColor = theme.danger;
                borderColor = theme.danger;
                textColor = theme.bg;
              }
            }

            return (
              <button
                key={opt}
                disabled={isAnswered}
                onClick={() => onAnswer(opt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  cursor: isAnswered ? 'default' : 'pointer',
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  background: isAnswered && opt === question.correct_option ? theme.primary : 'transparent',
                  color: isAnswered && opt === question.correct_option ? theme.bg : borderColor
                }}>
                  {opt.toUpperCase()}
                </div>
                {optionText}
              </button>
            );
          })}
        </div>
      </Card>

      {isAnswered && (
        <Card padding={20} style={{ background: theme.surface, border: `1px solid ${theme.line}`, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Badge tone={selectedOption === question.correct_option ? "teal" : "danger"}>
              {selectedOption === question.correct_option ? "Correto!" : "Incorreto"}
            </Badge>
          </div>
          <div style={{ fontSize: 14, color: theme.text, fontWeight: 600, marginBottom: 8 }}>
            Explicação:
          </div>
          <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>
            {question.explanation || "Sem explicação disponível para esta questão."}
          </div>
          {question.source && (
            <div style={{ marginTop: 12, fontSize: 11, color: theme.primary, fontWeight: 600 }}>
              Fonte: {question.source}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
