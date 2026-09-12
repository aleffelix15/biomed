import React, { useState, useEffect } from "react";
import { theme, alpha } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchFlashcards, updateFlashcardProgress, fetchQuestions, saveQuestionAttempt, ensureFlashcardExists, saveStudySession } from "../../services/supabaseService";
import * as content from "../../services/contentService";
import { useAuth } from "../../state/AuthContext";
import { useCachedQuery } from "../../state/DataCacheContext";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SectionHeader from "../../components/ui/SectionHeader";
import EmptyState from "../../components/ui/EmptyState";
import Flashcard from "../../components/domain/Flashcard";
import QuestionCard from "../../components/domain/QuestionCard";
import { ChevronLeft, Brain, RotateCcw, CheckCircle, HelpCircle, Timer, Trophy } from "lucide-react";

export default function StudyScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState("mode-selection"); // mode-selection | disc-selection | topic-selection | studying | finished
  const [mode, setMode] = useState("flashcards"); // flashcards | questions | simulado | prova
  
  const { data: discData } = useCachedQuery(user ? 'disciplines:' + user.id : null, () => fetchDisciplinesWithProgress(user.id));
  const disciplines = discData || [];
  const [selectedDisc, setSelectedDisc] = useState(null);
  const [items, setItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [sessionAnswers, setSessionAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answeredOption, setAnsweredOption] = useState(null);

  // Exam Mode State
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [examAnswers, setExamAnswers] = useState([]);
  const [alreadySaved, setAlreadySaved] = useState(false);

  useEffect(() => {
    if (step === "finished" && mode === "prova" && !alreadySaved && items.length > 0) {
      const saveProva = async () => {
        let correct = 0;
        items.forEach((q, idx) => {
          if (examAnswers[idx]?.selected === q.correct_option) correct++;
        });
        try {
          await Promise.all(items.map((q, idx) => {
            const opt = examAnswers[idx]?.selected;
            if (opt) return saveQuestionAttempt(user?.id, q, opt).catch(e => console.error(e));
            return Promise.resolve();
          }));
          
          await saveStudySession({
            user_id: user?.id,
            discipline_id: selectedDisc?.id,
            topic_id: selectedTopic,
            mode: mode,
            score_percent: Math.round((correct / items.length) * 100),
            correct_count: correct,
            total_count: items.length,
            duration_seconds: 600 - timeLeft
          });
          setAlreadySaved(true);
        } catch(e) {
          console.error("Error saving exam:", e);
        }
      };
      saveProva();
    }
  }, [step, mode, alreadySaved, items, examAnswers, timeLeft, user, selectedDisc, selectedTopic]);

  // Timer Logic for "Modo Prova"
  useEffect(() => {
    let timerInterval;
    if (timerActive && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setStep("finished");
      setTimerActive(false);
    }
    return () => clearInterval(timerInterval);
  }, [timerActive, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const [errorMsg, setErrorMsg] = useState(null);

  const startStudying = async (disc, topicId = null) => {
    setLoading(true);
    setErrorMsg("");
    setSelectedTopic(topicId);
    try {
      const data = mode === "flashcards"
        ? await fetchFlashcards(disc.id, topicId)
        : await fetchQuestions(disc.id, topicId, mode === "simulado", mode === "simulado" ? 15 : null);

      if (!data || data.length === 0) {
        setErrorMsg(`Nenhum(a) ${mode === "flashcards" ? "flashcard" : "questão"} encontrado(a).`);
        setLoading(false);
        return;
      }

      setItems(data);
      setCurrentIndex(0);
      setAnsweredOption(null);
      setExamAnswers([]);
      setSessionAnswers([]);
      setStep("studying");
      if (mode === "prova") {
        setTimeLeft(600); // 10 mins
        setTimerActive(true);
      }
    } catch (err) {
      console.error("Error loading study items:", err);
      setErrorMsg("Erro ao carregar os itens.");
    } finally {
      setLoading(false);
    }
  };

  const handleFlashcardEval = async (evaluation) => {
    const card = items[currentIndex];
    try {
      await ensureFlashcardExists(card);
      await updateFlashcardProgress(user.id, card.id, evaluation);
      if (currentIndex < items.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setStep("finished");
        setTimerActive(false);
      }
    } catch (err) {
      console.error("Error saving flashcard progress:", err);
    }
  };

  const handleQuestionAnswer = async (option) => {
    if (answeredOption) return;

    const question = items[currentIndex];
    setAnsweredOption(option);

    if (mode === "prova") {
      setExamAnswers(prev => [...prev, { questionId: question.id, selected: option }]);
    } else {
      try {
        await saveQuestionAttempt(user.id, question, option);
      } catch (err) {
        console.error("Error saving attempt:", err);
      }
      setSessionAnswers(prev => [...prev, { questionId: question.id, topicId: question.topic_id, selected: option, correct: option === question.correct_option }]);
    }
  };

  const nextQuestion = () => {
    setAnsweredOption(null);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setStep("finished");
      setTimerActive(false);
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
            <Card key={d.id} padding={16} onClick={async () => { setSelectedDisc(d); setTopics(await content.getTopicsByDiscipline(d.id)); setStep("topic-selection"); }} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
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
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: alpha(theme.danger, '22'), border: `1px solid ${theme.danger}`, color: theme.danger, textAlign: "center", fontSize: 13, fontWeight: 500 }}>
            {errorMsg}
          </div>
        )}
      </div>
    );
  }

  if (step === "topic-selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button onClick={() => setStep("disc-selection")} style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <ChevronLeft size={16} /> Voltar
          </button>
          <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Selecione o Assunto</h1>
        </div>
        <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Escolha um tópico específico ou revise todos os assuntos.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 24 }}>
          <Card padding={16} onClick={() => startStudying(selectedDisc, null)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
            <span style={{ fontWeight: 600, color: theme.text }}>Todos os assuntos</span>
          </Card>
          {topics.map((t) => (
            <Card key={t.id} padding={16} onClick={() => startStudying(selectedDisc, t.id)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
              <span style={{ fontWeight: 600, color: theme.text }}>{t.title}</span>
            </Card>
          ))}
        </div>
        {loading && <EmptyState icon={Brain} title="Carregando itens..." desc="Aguarde um momento." />}
        {errorMsg && (
          <div style={{ marginTop: 24, padding: 16, borderRadius: 12, background: alpha(theme.danger, '22'), border: `1px solid ${theme.danger}`, color: theme.danger, textAlign: "center", fontSize: 13, fontWeight: 500 }}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {mode === "prova" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: theme.surface, padding: "4px 8px", borderRadius: 8, color: theme.text, fontSize: 13, fontWeight: 700 }}>
                <Timer size={14} /> {formatTime(timeLeft)}
              </div>
            )}
            <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>
              {currentIndex + 1} / {items.length}
            </div>
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
              // Disable feedback in Exam Mode
              showFeedback={mode !== "prova"}
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

  if (step === "finished") {
    if (mode !== "flashcards") {
      const isProva = mode === "prova";
      let correct = 0;
      
      if (isProva) {
        items.forEach((q, idx) => {
          const answer = examAnswers[idx]?.selected;
          if (answer === q.correct_option) correct++;
        });
      } else {
        correct = sessionAnswers.filter(a => a.correct).length;
      }

      const percent = Math.round((correct / items.length) * 100);

      let status = "PRECISA REFORÇO";
      let statusColor = theme.danger;
      if (percent >= 80) { status = "DOMINADO"; statusColor = theme.primary; }
      else if (percent >= 60) { status = "REVISAR"; statusColor = theme.secondary; }

      const timeTaken = isProva ? (600 - timeLeft) : null;
      const mins = isProva ? Math.floor(timeTaken / 60) : 0;
      const secs = isProva ? timeTaken % 60 : 0;
      
      const topicStats = {};
      sessionAnswers.forEach(ans => {
        if (!topicStats[ans.topicId]) topicStats[ans.topicId] = { total: 0, correct: 0, name: topics.find(t => t.id === ans.topicId)?.title || 'Tópico' };
        topicStats[ans.topicId].total++;
        if (ans.correct) topicStats[ans.topicId].correct++;
      });

      return (
        <div style={{ padding: "20px 16px 90px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", overflowY: "auto", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: alpha(statusColor, '20'), display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto 20px" }}>
            <Trophy size={40} color={statusColor} />
          </div>
          <h1 className="bs-display" style={{ fontSize: 32, fontWeight: 700, color: theme.text, margin: 0 }}>{percent}%</h1>
          <div style={{ fontSize: 18, fontWeight: 600, color: statusColor, marginTop: 8 }}>{status}</div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4, marginBottom: 24 }}>
            Você acertou {correct} de {items.length} questões.
            {isProva && <><br />Tempo: {mins}m {secs}s</>}
          </div>

          <Card padding={20} style={{ background: theme.surface, border: `1px solid ${theme.line}`, marginBottom: 24, width: "100%", maxWidth: 400 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 12 }}>Análise da Sessão</div>
            <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, textAlign: "left" }}>
              {percent < 80 ?
                "Ainda existem lacunas no seu conhecimento. Recomendamos revisar os tópicos onde houve erro antes de avançar." :
                "Excelente desempenho! Você demonstra domínio sólido sobre este conteúdo."}
            </div>
            
            {!isProva && Object.keys(topicStats).length > 0 && (
              <div style={{ marginTop: 16, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, marginBottom: 8, textTransform: "uppercase" }}>Desempenho por Assunto</div>
                {Object.values(topicStats).map((st, i) => {
                  const p = Math.round((st.correct / st.total) * 100);
                  const isGood = p >= 70;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "8px 0", borderBottom: `1px solid ${theme.line}` }}>
                      <div style={{ fontSize: 13, color: theme.text }}>{st.name}</div>
                      <Badge tone={isGood ? "success" : "critical"}>{p}%</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          <button
            onClick={() => setStep("mode-selection")}
            style={{ padding: "12px 24px", borderRadius: 12, background: theme.primary, color: theme.bg, border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}
          >
            <RotateCcw size={18} /> Tentar Novamente
          </button>
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

  return null;
}
