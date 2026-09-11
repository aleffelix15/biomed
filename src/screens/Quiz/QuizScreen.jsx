import React, { useState, useEffect } from "react";
import { theme, alpha } from "../../theme/tokens";
import { fetchLessonQuiz, fetchTopicSimulado, saveQuestionAttempt } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import QuestionCard from "../../components/domain/QuestionCard";
import { ChevronLeft, Trophy, AlertTriangle, ArrowRight } from "lucide-react";

export default function QuizScreen({ topicId, disciplineId, lessonId, isSimulado, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

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
    setAnswers(prev => ({ ...prev, [questions[currentIndex].id]: optionId }));
  };

  const handleNext = async () => {
    const currentQ = questions[currentIndex];
    const selected = answers[currentQ.id];
    
    // Salvar attempt silenciosamente no Supabase
    if (user && selected) {
      setSaving(true);
      try {
        await saveQuestionAttempt(user.id, currentQ, selected);
        // Se errou, adiciona ao sistema de flashcards para revisao
        if (selected !== currentQ.correct_option) {
          const { addWrongQuestionToReview } = await import('../../services/supabaseService');
          await addWrongQuestionToReview(disciplineId, topicId, currentQ);
        }
      } catch (err) {
        console.error("Failed to save attempt", err);
      }
      setSaving(false);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textSecondary }}>Carregando questões...</div>;
  }

  if (questions.length === 0) {
    return (
      <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 50, padding: 20 }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.textSecondary, fontSize: 13, cursor: "pointer", padding: 0 }}>
          <ChevronLeft size={16} /> Voltar
        </button>
        <div style={{ textAlign: "center", marginTop: 100, color: theme.textSecondary }}>Nenhuma questão cadastrada para este módulo ainda.</div>
      </div>
    );
  }

  if (finished) {
    // Calcular resultado
    let correct = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_option) correct++;
    });
    const percent = Math.round((correct / questions.length) * 100);
    let status = "PRECISA REFORÇO";
    let statusColor = theme.danger;
    if (percent >= 80) { status = "DOMINADO"; statusColor = theme.primary; }
    else if (percent >= 60) { status = "REVISAR"; statusColor = theme.secondary; }

    return (
      <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 50, overflowY: "auto", padding: "20px 16px" }}>
        <div style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: `${statusColor}20`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Trophy size={40} color={statusColor} />
          </div>
          <h1 className="bs-display" style={{ fontSize: 32, fontWeight: 700, color: theme.text, margin: 0 }}>{percent}%</h1>
          <div style={{ fontSize: 16, fontWeight: 600, color: statusColor, marginTop: 8 }}>{status}</div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginTop: 4 }}>Você acertou {correct} de {questions.length} questões.</div>
        </div>

        <Card padding={20} style={{ background: theme.surface, border: `1px solid ${theme.line}`, marginBottom: 24 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16 }}>Análise de Desempenho</div>
          {percent < 100 && (
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start", background: alpha(theme.danger, '15'), padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <AlertTriangle size={18} color={theme.danger} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.danger, marginBottom: 4 }}>Recomendação</div>
                <div style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.5 }}>Identificamos pontos fracos nas questões erradas. Recomendamos revisar os conceitos básicos antes de avançar para a próxima aula.</div>
              </div>
            </div>
          )}
          <button 
            onClick={onBack}
            style={{ width: "100%", background: theme.card, border: `1px solid ${theme.line}`, color: theme.text, borderRadius: 8, padding: 12, fontSize: 14, fontWeight: 600, cursor: "pointer", marginTop: 8 }}
          >
            VOLTAR
          </button>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const hasAnsweredCurrent = !!answers[currentQ.id];
  const progress = Math.round(((currentIndex) / questions.length) * 100);

  return (
    <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 50, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 16px 16px", background: theme.surface, borderBottom: `1px solid ${theme.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.textSecondary, fontSize: 13, cursor: "pointer", padding: 0 }}>
            <ChevronLeft size={16} /> Abandonar
          </button>
          <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
            Questão {currentIndex + 1} / {questions.length}
          </div>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div style={{ flex: 1, padding: "20px 16px", overflowY: "auto" }}>
        <QuestionCard 
          question={currentQ}
          onAnswer={handleAnswer}
          selectedOption={answers[currentQ.id]}
          isAnswered={hasAnsweredCurrent}
        />
      </div>

      <div style={{ padding: "16px", background: theme.surface, borderTop: `1px solid ${theme.line}` }}>
        <button 
          onClick={handleNext}
          disabled={!hasAnsweredCurrent || saving}
          style={{ width: "100%", background: theme.primary, color: theme.bg, border: "none", borderRadius: 12, padding: 16, fontSize: 15, fontWeight: 700, cursor: (!hasAnsweredCurrent || saving) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: (!hasAnsweredCurrent || saving) ? 0.5 : 1 }}
        >
          {saving ? "SALVANDO..." : (currentIndex === questions.length - 1 ? "VER RESULTADO" : "PRÓXIMA QUESTÃO")} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
