import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchFlashcards, updateFlashcardProgress, fetchQuestions, saveQuestionAttempt } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SectionHeader from "../../components/ui/SectionHeader";
import EmptyState from "../../components/ui/EmptyState";
import Flashcard from "../../components/domain/Flashcard";
import QuestionCard from "../../components/domain/QuestionCard";
import { ChevronLeft, Brain, RotateCcw, CheckCircle, HelpCircle } from "lucide-react";

export default function StudyScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState("mode-selection"); // mode-selection | disc-selection | studying | finished
  const [mode, setMode] = useState("flashcards"); // flashcards | questions
  const [disciplines, setDisciplines] = useState([]);
  const [selectedDisc, setSelectedDisc] = useState(null);
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [answeredOption, setAnsweredOption] = useState(null);

  useEffect(() => {
    fetchDisciplinesWithProgress(user?.id).then(setDisciplines);
  }, [user]);

  const [errorMsg, setErrorMsg] = useState(null);

  const startStudying = async (disc) => {
    setLoading(true);
    setErrorMsg(null);
    setSelectedDisc(disc);
    try {
      const data = mode === "flashcards"
        ? await fetchFlashcards(disc.id)
        : await fetchQuestions(disc.id);

      if (data && data.length > 0) {
        setItems(data);
        setStep("studying");
        setCurrentIndex(0);
      } else {
        setErrorMsg(`Nenhum ${mode === "flashcards" ? "flashcard" : "questão"} encontrado para esta disciplina.`);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Ocorreu um erro ao carregar o conteúdo.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcardEval = async (evaluation) => {
    const card = items[currentIndex];
    try {
      await updateFlashcardProgress(user.id, card.id, evaluation);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setStep("finished");
      }
    } catch (err) {
      console.error("Error saving flashcard progress:", err);
    }
  };

  const handleQuestionAnswer = async (option) => {
    if (answeredOption) return;

    const question = items[currentIndex];
    setAnsweredOption(option);

    try {
      await saveQuestionAttempt(user.id, question.id, option);
    } catch (err) {
      console.error("Error saving attempt:", err);
    }
  };

  const nextQuestion = () => {
    setAnsweredOption(null);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep("finished");
    }
  };

  if (step === "mode-selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Estudar</h1>
        <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Escolha o método de estudo ativo para a sessão de hoje.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          <Card
            padding={24}
            onClick={() => { setMode("flashcards"); setStep("disc-selection"); }}
            style={{ cursor: "pointer", textAlign: "center", transition: "transform 0.2s", border: "none", background: theme.card }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.primary, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Brain size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Flashcards</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Revisão rápida</div>
          </Card>

          <Card
            padding={24}
            onClick={() => { setMode("questions"); setStep("disc-selection"); }}
            style={{ cursor: "pointer", textAlign: "center", transition: "transform 0.2s", border: "none", background: theme.card }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.primary, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <HelpCircle size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Questões</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Prática focada</div>
          </Card>

          <Card
            padding={24}
            onClick={() => { setMode("simulado"); setStep("disc-selection"); }}
            style={{ cursor: "pointer", textAlign: "center", transition: "transform 0.2s", border: "none", background: theme.card }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.surface, color: theme.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <HelpCircle size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Simulado</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Teste misto</div>
          </Card>

          <Card
            padding={24}
            onClick={() => { setMode("prova"); setStep("disc-selection"); }}
            style={{ cursor: "pointer", textAlign: "center", transition: "transform 0.2s", border: "none", background: theme.card }}
          >
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.surface, color: theme.textSecondary, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Brain size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Modo Prova</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Com cronômetro</div>
          </Card>
        </div>
      </div>
    );
  }

  if (step === "disc-selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setStep("mode-selection")} style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <ChevronLeft size={16} /> Voltar
          </button>
          <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>{mode === "flashcards" ? "Flashcards" : "Questões"}</h1>
        </div>
        <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Selecione a disciplina para iniciar a revisão.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          {disciplines.map((d) => (
            <Card key={d.id} padding={16} onClick={() => startStudying(d)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
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
        {disciplines.length === 0 && !loading && !errorMsg && (
          <EmptyState icon={Brain} title="Nenhuma disciplina" desc="Não foram encontradas disciplinas." />
        )}
        {loading && disciplines.length === 0 && (
          <EmptyState icon={Brain} title="Carregando disciplinas..." desc="Aguarde um momento." />
        )}
        {errorMsg && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: `${theme.danger}22`, border: `1px solid ${theme.danger}`, color: theme.danger, textAlign: "center", fontSize: 13, fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  if (step === "studying") {
    const currentItem = items[currentIndex];
    return (
      <div style={{ padding: "20px 16px 90px", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <button onClick={() => setStep("disc-selection")} style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <ChevronLeft size={16} /> Voltar
          </button>
          <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>
            {currentIndex + 1} / {items.length}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32 }}>
          {mode === "flashcards" ? (
            <Flashcard key={currentItem.id} card={currentItem} onEvaluate={handleFlashcardEval} />
          ) : (
            <QuestionCard
              question={currentItem}
              selectedOption={answeredOption}
              isAnswered={!!answeredOption}
              onAnswer={handleQuestionAnswer}
            />
          )}

          {mode === "flashcards" ? (
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
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!answeredOption}
              style={{
                width: "100%",
                maxWidth: 400,
                padding: 14,
                borderRadius: 12,
                background: answeredOption ? theme.primary : theme.surface,
                color: answeredOption ? theme.bg : theme.textSecondary,
                border: "none",
                fontWeight: 700,
                cursor: answeredOption ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8
              }}
            >
              <ChevronLeft size={18} style={{ transform: 'rotate(180deg)' }} /> Próxima Questão
            </button>
          )}
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
        Você completou todos os {mode === "flashcards" ? "flashcards" : "questões"} de {selectedDisc?.name}.
      </p>
      <button
        onClick={() => setStep("mode-selection")}
        style={{ padding: "12px 24px", borderRadius: 12, background: theme.primary, color: theme.bg, border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
      >
        <RotateCcw size={18} /> Estudar outra disciplina
      </button>
    </div>
  );
}
