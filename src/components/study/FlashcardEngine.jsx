import React, { useState } from 'react';
import Flashcard from '../domain/Flashcard';
import { updateFlashcardProgress, ensureFlashcardExists } from '../../services/supabaseService';
import { useAuth } from '../../state/AuthContext';
import { Trophy } from 'lucide-react';
import { theme } from '../../theme/tokens';

export default function FlashcardEngine({ items, onFinish }) {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleFlashcardEval = async (evaluation) => {
    const card = items[currentIndex];
    try {
      if (card.derived) {
        await ensureFlashcardExists(card);
      }
      if (user) {
        await updateFlashcardProgress(user.id, card.id, evaluation);
      }
    } catch (err) {
      console.error("Error saving flashcard progress:", err);
    }
    
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onFinish({
        total: items.length,
        correct: 0, // Not applicable for flashcards in the same way
        topicStats: {} 
      });
    }
  };

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, height: '100%' }}>
      <div style={{ color: theme.textSecondary, fontSize: 14, fontWeight: 600 }}>
        Flashcard {currentIndex + 1} de {items.length}
      </div>
      
      <Flashcard key={currentItem.id} card={currentItem} onEvaluate={handleFlashcardEval} />
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 400 }}>
        {[
          { label: "Errei", val: "errei", color: "#EF4444" },
          { label: "Difícil", val: "dificil", color: "#F59E0B" },
          { label: "Bom", val: "bom", color: "#10B981" },
          { label: "Fácil", val: "facil", color: "#3B82F6" },
        ].map(btn => (
          <button
            key={btn.val}
            onClick={() => handleFlashcardEval(btn.val)}
            style={{
              padding: 12,
              borderRadius: 10,
              border: "none",
              background: btn.color,
              color: "#fff",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              transition: "opacity 0.2s"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

