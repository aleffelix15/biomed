import React, { useState, useEffect } from "react";
import { fetchLessonQuiz, fetchTopicSimulado, saveQuestionAttempt, addWrongQuestionToReview } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import QuestionCard from "../../components/domain/QuestionCard";
import { ChevronLeft, Flag, Trophy, AlertTriangle, ArrowRight } from "lucide-react";
import { resolveIcon } from "../../utils/iconResolver";

export default function QuizScreen({ topicId, disciplineId, lessonId, isSimulado, onBack, discipline }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();
  
  const IconComponent = resolveIcon(discipline?.icon);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      let q = [];
      if (isSimulado) {
        q = await fetchTopicSimulado(topicId);
      } else {
        q = await fetchLessonQuiz(lessonId);
      }
      setQuestions(q);
      setLoading(false);
    };

    loadQuestions();
  }, [topicId, lessonId, isSimulado]);

  const handleAnswer = (optionId) => {
    if (answers[questions[currentIndex].id]) return;
    setAnswers({ ...answers, [questions[currentIndex].id]: optionId });
  };

  const handleNext = async () => {
    if (saving) return;
    const currentQ = questions[currentIndex];
    const selected = answers[currentQ.id];
    const isCorrect = selected === currentQ.correct_option;

    setSaving(true);
    try {
      if (user) {
        await saveQuestionAttempt(user.id, currentQ, selected);
        if (!isCorrect) {
          await addWrongQuestionToReview(disciplineId, topicId, currentQ);
        }
      }
    } catch (err) {
      console.error("Erro salvando questao:", err);
      alert("Não foi possível salvar seu progresso. Verifique sua conexão.");
    } finally {
      setSaving(false);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "var(--theme-bg)", zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--theme-text-secondary)" }}>
        Carregando questões...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "var(--theme-bg)", zIndex: 60, padding: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "var(--theme-text)", fontSize: 15, fontWeight: 600, cursor: "pointer", padding: 0 }}>
          <ChevronLeft size={20} /> Voltar
        </button>
        <div style={{ textAlign: "center", marginTop: 100, color: "var(--theme-text-secondary)" }}>
          Nenhuma questão cadastrada para este módulo ainda.
        </div>
      </div>
    );
  }

  if (finished) {
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) correct++;
    });
    const percent = Math.round((correct / questions.length) * 100);
    let status = "Precisa Reforço";
    let statusColor = "var(--theme-danger)";
    if (percent >= 80) { status = "Dominado"; statusColor = "var(--theme-primary)"; }
    else if (percent >= 60) { status = "Revisar"; statusColor = "var(--theme-warning)"; }

    return (
      <div style={{ position: "absolute", inset: 0, background: "var(--theme-bg)", zIndex: 60, overflowY: "auto", padding: "20px 16px" }} className="bs-scroll">
        <div style={{ textAlign: "center", marginTop: 60, marginBottom: 40 }}>
          <div style={{ width: 96, height: 96, borderRadius: 48, background: `color-mix(in srgb, ${statusColor} 15%, transparent)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: `2px solid ${statusColor}` }}>
            <Trophy size={48} color={statusColor} />
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 700, color: "var(--theme-text)", margin: 0 }}>{percent}%</h1>
          <div style={{ fontSize: 18, fontWeight: 600, color: statusColor, marginTop: 12 }}>{status}</div>
          <div style={{ fontSize: 15, color: "var(--theme-text-secondary)", marginTop: 8 }}>Você acertou {correct} de {questions.length} questões.</div>
        </div>

        <Card padding={24} style={{ maxWidth: 400, margin: "0 auto 24px" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--theme-text)", marginBottom: 16 }}>Análise de Desempenho</div>
          {percent < 100 && (
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", background: "rgba(255, 71, 87, 0.1)", padding: 16, borderRadius: 12, border: "1px solid rgba(255, 71, 87, 0.2)" }}>
              <AlertTriangle size={24} color="var(--theme-danger)" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--theme-danger)", marginBottom: 4 }}>Recomendação</div>
                <div style={{ fontSize: 13, color: "var(--theme-text)", lineHeight: 1.5 }}>Recomendamos revisar os conceitos básicos antes de avançar. As questões erradas foram salvas para revisão (Flashcards).</div>
              </div>
            </div>
          )}
          <button 
            onClick={onBack}
            style={{ width: "100%", background: "var(--theme-primary)", color: "#000", border: "none", borderRadius: 16, padding: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 24 }}
          >
            Continuar estudando
          </button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const hasAnsweredCurrent = !!answers[currentQ.id];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--theme-bg)", zIndex: 60, display: "flex", flexDirection: "column" }}>
      
      {/* HEADER */}
      <div style={{ padding: "16px 16px 20px", background: "var(--theme-bg)", borderBottom: "1px solid var(--theme-line)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", border: "none", color: "var(--theme-text)", fontSize: 16, fontWeight: 600, cursor: "pointer", padding: 0 }}>
            <ChevronLeft size={24} /> Quiz
          </button>
          <Flag size={20} color="var(--theme-text)" />
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
           <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
             {IconComponent && <IconComponent size={20} color="var(--theme-primary)" />}
           </div>
           <div>
             <div style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)" }}>{discipline?.name || 'Disciplina'}</div>
             <div style={{ fontSize: 12, color: "var(--theme-text-secondary)" }}>Testando conhecimentos</div>
           </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text-secondary)" }}>
            {currentIndex + 1} / {questions.length}
          </div>
          {/* Mock timer since we don't have a real one implemented yet, to match UI */}
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)" }}>00:45</div>
        </div>
        <ProgressBar value={progress} height={6} />
      </div>

      <div style={{ flex: 1, padding: "32px 16px", overflowY: "auto" }} className="bs-scroll">
        <QuestionCard 
          question={currentQ}
          onAnswer={handleAnswer}
          selectedOption={answers[currentQ.id]}
          isAnswered={hasAnsweredCurrent}
        />
      </div>

      <div style={{ padding: "16px 20px 32px", background: "var(--theme-card)", borderTop: "1px solid var(--theme-line)" }}>
        <button 
          onClick={handleNext}
          disabled={!hasAnsweredCurrent || saving}
          style={{ 
            width: "100%", 
            background: "var(--theme-primary)", 
            color: "#000", 
            border: "none", 
            borderRadius: 16, 
            padding: 16, 
            fontSize: 16, 
            fontWeight: 700, 
            cursor: (!hasAnsweredCurrent || saving) ? "not-allowed" : "pointer", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            opacity: (!hasAnsweredCurrent || saving) ? 0.5 : 1,
            transition: "opacity 0.2s ease"
          }}
        >
          {saving ? "Salvando..." : (currentIndex === questions.length - 1 && hasAnsweredCurrent ? "Ver Resultado" : "Confirmar")} 
        </button>
      </div>
    </div>
  );
}
