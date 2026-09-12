import React, { useState, useEffect } from "react";
import { theme, alpha } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchFlashcards, updateFlashcardProgress, fetchQuestions, saveQuestionAttempt, ensureFlashcardExists } from "../../services/supabaseService";
import * as content from "../../services/contentService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SectionHeader from "../../components/ui/SectionHeader";
import EmptyState from "../../components/ui/EmptyState";
import Flashcard from "../../components/domain/Flashcard";
import QuestionCard from "../../components/domain/QuestionCard";
import { ChevronLeft, Brain, RotateCcw, CheckCircle, HelpCircle, Timer, Trophy } from "lucide-react";

export default function StudyScreen() {
  const { user } = useAuth();
  const [step, setStep] = useState("mode-selection"); // mode-selection | disc-selection | studying | finished
  const [mode, setMode] = useState("flashcards"); // flashcards | questions | simulado | prova
  const [disciplines, setDisciplines] = useState([]);
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

  useEffect(() => {
    fetchDisciplinesWithProgress(user?.id).then(setDisciplines);
  }, [user]);

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
        setAnsweredOption(null);
        setExamAnswers([]);

        if (mode !== "flashcards") {
      const isProva = mode === "prova";
      let correct = 0;
      
      if (isProva) {
        items.forEach((q, idx) => {
          const answer = examAnswers[idx]?.selected;
          if (answer === q.correct_option) correct++;
        });
        
        // Save Prova attempts to DB
        useEffect(() => {
          const saveProva = async () => {
            try {
              // save attempts in batch
              await Promise.all(items.map((q, idx) => {
                const opt = examAnswers[idx]?.selected;
                if (opt) return saveQuestionAttempt(user.id, q, opt).catch(e => console.error(e));
                return Promise.resolve();
              }));
              
              // save study session
              import { supabase } from '../../services/supabaseClient';
              
              await saveStudySession({
                user_id: user.id,
                discipline_id: selectedDisc?.id,
                topic_id: selectedTopic,
                mode: mode,
                score_percent: Math.round((correct / items.length) * 100),
                correct_count: correct,
                total_count: items.length,
                duration_seconds: 600 - timeLeft
              });
            } catch(e) {
              console.error("Error saving exam:", e);
            }
          };
          saveProva();
        }, []); // run once when finished step mounts for prova

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
      
      // Calculate performance by topic
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

          <Card padding={20} style={{ background: theme.surface, border: 1px solid , marginBottom: 24, width: "100%", maxWidth: 400 }}>
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
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, padding: "8px 0", borderBottom: 1px solid  }}>
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
