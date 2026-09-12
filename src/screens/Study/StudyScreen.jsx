import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchFlashcards, fetchQuestions, saveStudySession } from "../../services/supabaseService";
import * as content from "../../services/contentService";
import { useAuth } from "../../state/AuthContext";
import { useCachedQuery } from "../../state/DataCacheContext";
import Card from "../../components/ui/Card";
import SectionHeader from "../../components/ui/SectionHeader";
import EmptyState from "../../components/ui/EmptyState";
import FlashcardEngine from "../../components/study/FlashcardEngine";
import QuestionEngine from "../../components/study/QuestionEngine";
import ExamEngine from "../../components/study/ExamEngine";
import StudyResult from "../../components/study/StudyResult";
import { ChevronLeft, Brain, HelpCircle, Timer, FileText, CheckCircle } from "lucide-react";

export default function StudyScreen() {
  const { user } = useAuth();
  
  // Steps: mode-selection -> disc-selection -> topic-selection -> config-selection (simulado) -> studying -> finished
  const [step, setStep] = useState("mode-selection");
  const [mode, setMode] = useState("flashcards"); 
  
  const { data: discData, invalidate } = useCachedQuery(user ? 'disciplines:' + user.id : null, () => fetchDisciplinesWithProgress(user.id));
  const disciplines = discData || [];
  
  const [selectedDisc, setSelectedDisc] = useState(null);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Results
  const [resultData, setResultData] = useState(null);

  // Load Topics when a discipline is selected
  useEffect(() => {
    if (selectedDisc) {
      const loadTopics = async () => {
        const dTopics = content.getTopicsByDiscipline(selectedDisc.id).filter(t => t.has_content);
        setTopics(dTopics);
      };
      loadTopics();
    }
  }, [selectedDisc]);

  const startStudying = async (disc, topicId = null, limit = null) => {
    setLoading(true);
    setErrorMsg("");
    setSelectedTopic(topicId);
    
    try {
      const data = mode === "flashcards"
        ? await fetchFlashcards(disc.id, topicId)
        : await fetchQuestions(disc.id, topicId, mode === "simulado" || mode === "prova", limit || (mode === "simulado" ? 20 : null));

      if (!data || data.length === 0) {
        setErrorMsg(`Nenhum(a) ${mode === "flashcards" ? "flashcard" : "questão"} encontrado(a).`);
        setLoading(false);
        return;
      }

      setItems(data);
      setStep("studying");
    } catch (err) {
      console.error("Error loading study items:", err);
      setErrorMsg("Erro ao carregar os itens.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async (result) => {
    setResultData(result);
    setStep("finished");

    if (user && mode !== "flashcards") {
      try {
        await saveStudySession({
          user_id: user.id,
          discipline_id: selectedDisc.id,
          topic_id: selectedTopic === 'all' ? null : selectedTopic,
          mode: mode,
          score_percent: result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0,
          correct_count: result.correct,
          total_count: result.total,
          duration_seconds: result.timeTaken || 0,
          session_type: mode === "prova" ? "exam" : "study"
        });
        invalidate(); // Refresh progress in home/disciplines
      } catch(e) {
        console.error("Error saving session:", e);
      }
    }
  };

  const resetFlow = () => {
    setStep("mode-selection");
    setSelectedDisc(null);
    setSelectedTopic(null);
    setItems([]);
    setResultData(null);
    setErrorMsg("");
  };

  // 1. MODE SELECTION
  if (step === "mode-selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <h1 className="bs-display" style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: 0 }}>Estudar</h1>
        <p style={{ fontSize: 14, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
          Escolha o método de estudo ativo para a sessão de hoje.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 24 }}>
          <Card padding={24} onClick={() => { setMode("flashcards"); setStep("disc-selection"); }} style={{ cursor: "pointer", textAlign: "center", border: "none", background: theme.card }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.primary, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Brain size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Flashcards</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Revisão rápida</div>
          </Card>

          <Card padding={24} onClick={() => { setMode("questions"); setStep("disc-selection"); }} style={{ cursor: "pointer", textAlign: "center", border: "none", background: theme.card }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.primary, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <HelpCircle size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Questões</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Prática focada</div>
          </Card>

          <Card padding={24} onClick={() => { setMode("simulado"); setStep("disc-selection"); }} style={{ cursor: "pointer", textAlign: "center", border: "none", background: theme.card }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.secondary, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <FileText size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Simulado</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Aleatório geral</div>
          </Card>

          <Card padding={24} onClick={() => { setMode("prova"); setStep("disc-selection"); }} style={{ cursor: "pointer", textAlign: "center", border: "none", background: theme.card }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, background: theme.danger, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Timer size={24} />
            </div>
            <div style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Modo Prova</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4 }}>Com cronômetro</div>
          </Card>
        </div>
      </div>
    );
  }

  // 2. DISCIPLINE SELECTION
  if (step === "disc-selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <button onClick={() => setStep("mode-selection")} style={{ background: "none", border: "none", color: theme.textSecondary, display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 20 }}>
          <ChevronLeft size={18} /> Voltar
        </button>
        <SectionHeader title="Escolha a Disciplina" />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {disciplines.length === 0 ? (
            <EmptyState icon={Brain} title="Nenhuma disciplina encontrada" />
          ) : (
            disciplines.map(d => (
              <Card key={d.id} padding={16} onClick={() => { setSelectedDisc(d); setStep("topic-selection"); }} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>{d.name}</div>
                    <div style={{ fontSize: 13, color: theme.primary, marginTop: 4 }}>{d.topics_count} tópicos • {d.progress_percent}% concluído</div>
                  </div>
                  <ChevronLeft size={18} style={{ transform: "rotate(180deg)", color: theme.textSecondary }} />
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // 3. TOPIC SELECTION
  if (step === "topic-selection") {
    return (
      <div style={{ padding: "20px 16px 90px" }}>
        <button onClick={() => setStep("disc-selection")} style={{ background: "none", border: "none", color: theme.textSecondary, display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 20 }}>
          <ChevronLeft size={18} /> {selectedDisc.name}
        </button>
        <SectionHeader title="Selecione o Assunto" />
        
        {errorMsg && <div style={{ padding: 12, borderRadius: 8, background: theme.danger + '22', color: theme.danger, marginBottom: 16, fontSize: 14 }}>{errorMsg}</div>}
        
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Card padding={16} onClick={() => startStudying(selectedDisc, 'all')} style={{ cursor: loading ? "not-allowed" : "pointer", border: `1px solid ${theme.primary}` }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.primary, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={18} /> Todos os tópicos misturados
            </div>
          </Card>
          
          {topics.length === 0 && !loading ? (
             <EmptyState icon={FileText} title="Sem tópicos nesta disciplina" />
          ) : (
             topics.map(t => (
              <Card key={t.id} padding={16} onClick={() => startStudying(selectedDisc, t.id)} style={{ cursor: loading ? "not-allowed" : "pointer" }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: theme.text }}>{t.title}</div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  // 4. STUDYING
  if (step === "studying") {
    return (
      <div style={{ padding: "16px 16px 90px", height: "100%", display: "flex", flexDirection: "column" }}>
        <button onClick={() => { if(window.confirm("Deseja cancelar a sessão?")) resetFlow(); }} style={{ background: "none", border: "none", color: theme.textSecondary, display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 16 }}>
          <ChevronLeft size={18} /> Sair
        </button>

        {mode === "flashcards" && (
          <FlashcardEngine items={items} onFinish={handleFinish} />
        )}
        
        {mode === "questions" && (
          <QuestionEngine items={items} allTopics={topics} onFinish={handleFinish} />
        )}

        {(mode === "simulado" || mode === "prova") && (
          <ExamEngine items={items} allTopics={topics} isExamMode={mode === "prova"} onFinish={handleFinish} />
        )}
      </div>
    );
  }

  // 5. FINISHED
  if (step === "finished") {
    return (
      <StudyResult 
        mode={mode}
        correctCount={resultData?.correct}
        totalCount={resultData?.total}
        timeTaken={resultData?.timeTaken}
        topicStats={resultData?.topicStats}
        onRetry={() => startStudying(selectedDisc, selectedTopic)}
        onFinish={resetFlow}
      />
    );
  }

  return null;
}
