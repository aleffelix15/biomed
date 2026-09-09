import React, { useState } from 'react';
import { theme } from '../../theme/tokens';

export default function Flashcard({ card, onEvaluate }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div
      onClick={handleFlip}
      style={{
        width: '100%',
        maxWidth: 400,
        height: 250,
        perspective: '1000px',
        cursor: 'pointer',
        margin: '0 auto'
      }}
    >
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transition: 'transform 0.6s',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }}>
        {/* Frente (Pergunta) */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          background: theme.card,
          border: `1px solid ${theme.line}`,
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: 12, color: theme.primary, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Pergunta</div>
          <div style={{ fontSize: 18, color: theme.text, fontWeight: 600, lineHeight: 1.4 }}>{card.question}</div>
          <div style={{ marginTop: 20, fontSize: 11, color: theme.textSecondary }}>Toque para revelar a resposta</div>
        </div>

        {/* Verso (Resposta) */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          background: theme.card,
          border: `1px solid ${theme.line}`,
          borderRadius: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          transform: 'rotateY(180deg)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
        }}>
          <div style={{ fontSize: 12, color: theme.primary, fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>Resposta</div>
          <div style={{ fontSize: 16, color: theme.text, fontWeight: 500, lineHeight: 1.4 }}>{card.answer}</div>
        </div>
      </div>
    </div>
  );
}
