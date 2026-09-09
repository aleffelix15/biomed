import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchFlashcards, updateFlashcardProgress } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SectionHeader from "../../components/ui/SectionHeader";
import EmptyState from "../../components/ui/EmptyState";
import Flashcard from "../../components/domain/Flashcard";
import { ChevronLeft, Brain, RotateCcw, CheckCircle } from "lucide-react";

export default function StudyScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState("selection"); // selection | studying | finished
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisc, setSelectedDisc] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDisciplinesWithProgress(user?.id).then(setDisciplines);
  }, [user]);

  const startFlashcards = async (disc) => {
    setLoading(true);
    setSelectedDisc(disc);
    try {
      const data = await fetchFlashcards(disc.id);
      if (data && data.length > 0) {
        setCards(data);
        setStep("studying");
        setCurrentIndex(0);
      } else {
        alert("Nenhum flashcard encontrado para esta disciplina.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (evaluation) => {
    const card = cards[currentIndex];
    try {
      await updateFlashcardProgress(user.id, card.id, evaluation);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setStep("finished");
      }
    } catch (err) {
      console.error("Error saving progress:", err);
    }
  };

  if (step === "selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Flashcards</h1>
        <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Selecione uma disciplina para iniciar a revisão ativa.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          {disciplines.map((d) => (
            <Card key={d.id} padding={16} onClick={() => startFlashcards(d)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Brain size={16} color={theme.primary} />
                  </div>
                  <span style={{ fontWeight: 600, color: theme.text }}>{d.name}</span>
                </div>
                <Badge tone="neutral">{d.topicsCount} tópicos</Badge>
              </div>
            </Card>
          ))}
        </div>
        {disciplines.length === 0 && (
          <EmptyState icon={Brain} title="Carregando disciplinas..." desc="Aguarde um momento." />
        )}
      </div>
    );
  }

  if (step === "studying") {
    const currentCard = cards[currentIndex];
    return (
      <div style={{ padding: "20px 16px 90px", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button onClick={() => setStep("selection")} style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <ChevronLeft size={16} /> Voltar
          </button>
          <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>
            {currentIndex + 1} / {cards.length}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          <Flashcard card={currentCard} onEvaluate={() => {}} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 400 }}>
            {[
              { label: "Errei", val: "errei", color: "#EF4444" },
              { label: "Difícil", val: "dificil", color: "#F59E0B" },
              { label: "Bom", val: "bom", color: "#10B981" },
              { label: "Fácil", val: "facil", color: "#3B82F6" },
            ].map(btn => (
              <button
                key={btn.val}
                onClick={() => handleEvaluate(btn.val)}
                style={{
                  padding: 12,
                  borderRadius: 10,
                  border: "none",
                  background: btn.color,
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "opacity 0.2s"
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 90px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: theme.primary, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
        <CheckCircle size={32} color={theme.bg} />
      </div>
      <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Revisão Concluída!</h1>
      <p style={{ fontSize: 14, color: theme.textSecondary, marginTop: 8, marginBottom: 24 }}>
        Você completou todos os flashcards de {selectedDisc?.name}.
      </p>
      <button
        onClick={() => setStep("selection")}
        style={{ padding: "12px 24px", borderRadius: 12, background: theme.primary, color: theme.bg, border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
      >
        <RotateCcw size={18} /> Estudar outra disciplina
      </button>
    </div>
  );
}
