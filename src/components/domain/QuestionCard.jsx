import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

export default function QuestionCard({ question, onAnswer, selectedOption, isAnswered, showFeedback = true }) {
  const options = ['a', 'b', 'c', 'd', 'e'].filter(opt => question[`option_${opt}`]);

  return (
    <div style={{ width: '100%', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ fontSize: 18, color: "var(--theme-text)", fontWeight: 600, lineHeight: 1.5, marginBottom: 24 }}>
        {question.question}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {options.map(opt => {
          const optionText = question[`option_${opt}`];
          let bgColor = "var(--theme-surface)";
          let borderColor = "var(--theme-line)";
          let textColor = "var(--theme-text)";
          let ringColor = "var(--theme-line)";

          const isSelected = selectedOption === opt;

          if (!isAnswered && isSelected) {
             borderColor = "var(--theme-primary)";
             ringColor = "var(--theme-primary)";
             bgColor = "rgba(28, 230, 121, 0.05)";
          }

          if (isAnswered && showFeedback) {
            if (opt === question.correct_option) {
              bgColor = "rgba(28, 230, 121, 0.15)";
              borderColor = "var(--theme-primary)";
              ringColor = "var(--theme-primary)";
            } else if (isSelected) {
              bgColor = "rgba(255, 71, 87, 0.15)";
              borderColor = "var(--theme-danger)";
              ringColor = "var(--theme-danger)";
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
                gap: 16,
                padding: '16px 20px',
                borderRadius: 16,
                border: `1px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                cursor: isAnswered ? 'default' : 'pointer',
                textAlign: 'left',
                fontSize: 15,
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Radio Circle */}
              <div style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                border: `2px solid ${ringColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {(isSelected || (isAnswered && opt === question.correct_option)) && (
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: ringColor }} />
                )}
              </div>
              
              <div style={{ flex: 1, lineHeight: 1.4 }}>
                {optionText}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <Card padding={20} style={{ background: "var(--theme-surface)", border: `1px solid var(--theme-line)`, marginTop: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Badge tone={selectedOption === question.correct_option ? "teal" : "danger"}>
              {selectedOption === question.correct_option ? "Correto!" : "Incorreto"}
            </Badge>
          </div>
          <div style={{ fontSize: 14, color: "var(--theme-text)", fontWeight: 600, marginBottom: 8 }}>
            Explicação:
          </div>
          <div style={{ fontSize: 14, color: "var(--theme-text-secondary)", lineHeight: 1.6 }}>
            {question.explanation || "Sem explicação disponível para esta questão."}
          </div>
          {question.source && (
            <div style={{ marginTop: 12, fontSize: 12, color: "var(--theme-text-secondary)" }}>
              Fonte: {question.source}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
