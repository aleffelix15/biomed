import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchModulesAndLessons, getOrCreateStudyPlan } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import Badge from "../../components/ui/Badge";
import { ChevronLeft, Play, Target, CheckCircle, Circle, ArrowRight } from "lucide-react";
import LessonScreen from "../Lesson/LessonScreen";
import QuizScreen from "../Quiz/QuizScreen";

export default function StudyPlanScreen({ topic, discipline, onBack }) {
  const [modules, setModules] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeSimulado, setActiveSimulado] = useState(false);
  const { user } = useAuth();

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const p = await getOrCreateStudyPlan(user.id, topic.id);
    const m = await fetchModulesAndLessons(topic.id, user.id);
    setPlan(p);
    setModules(m);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [topic, user]);

  const handleLessonBack = () => {
    setActiveLesson(null);
    loadData(); // refresh progress
  };

  const handleSimuladoBack = () => {
    setActiveSimulado(false);
    loadData();
  };

  if (activeLesson) {
    return <LessonScreen lesson={activeLesson} topic={topic} discipline={discipline} onBack={handleLessonBack} />;
  }

  if (activeSimulado) {
    return <QuizScreen topicId={topic.id} disciplineId={discipline.id} isSimulado={true} onBack={handleSimuladoBack} />;
  }

  // Count metrics
  let totalLessons = 0;
  let completedLessons = 0;
  modules.forEach(m => {
    m.lessons.forEach(l => {
      totalLessons++;
      if (l.completed) completedLessons++;
    });
  });

  return (
    <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 30, overflowY: "auto" }} className="bs-scroll">
      <div style={{ padding: "20px 16px 90px" }}>
        
        {/* Header */}
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.textSecondary, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>
          <ChevronLeft size={16} /> {discipline.name}
        </button>

        <h1 className="bs-display" style={{ fontSize: 24, fontWeight: 700, color: theme.text, margin: 0, textTransform: "uppercase" }}>{topic.title}</h1>
        <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>Fundamentos e metabolismo</div>

        {/* Progresso Geral */}
        <Card padding={16} style={{ marginTop: 20, background: theme.surface, border: `1px solid ${theme.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 14, color: theme.text, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              <Target size={16} color={theme.primary} /> Plano de Estudo
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.primary }}>{plan?.percent_complete || 0}%</div>
          </div>
          <ProgressBar value={plan?.percent_complete || 0} />
          
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: theme.textSecondary }}>
            <div><strong style={{color: theme.text}}>{totalLessons}</strong> aulas</div>
            <div><strong style={{color: theme.text}}>{completedLessons}</strong> concluídas</div>
            <div><strong style={{color: theme.text}}>{totalLessons - completedLessons}</strong> pendentes</div>
          </div>
        </Card>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Carregando aulas...</div>
        ) : (
          <>
            {/* Lista de Módulos */}
            <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 20 }}>
              {modules.map((m, i) => (
                <div key={m.id}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: theme.textSecondary, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10, paddingLeft: 4 }}>
                    Módulo {i + 1} • {m.title}
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {m.lessons.map(l => (
                      <Card 
                        key={l.id} 
                        padding={14} 
                        onClick={() => setActiveLesson(l)}
                        style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 12, background: l.completed ? theme.bg : theme.surface, border: `1px solid ${l.completed ? theme.line : "transparent"}` }}
                      >
                        {l.completed ? (
                          <CheckCircle size={20} color={theme.primary} />
                        ) : (
                          <Circle size={20} color={theme.textSecondary} />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, color: l.completed ? theme.textSecondary : theme.text, fontWeight: 500, textDecoration: l.completed ? "line-through" : "none" }}>{l.title}</div>
                          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4, display: "flex", gap: 8 }}>
                            <span>{l.estimated_minutes} min</span>
                            <span>•</span>
                            <span style={{ color: l.difficulty === 'Iniciante' ? theme.primary : l.difficulty === 'Avançado' ? theme.danger : theme.secondary }}>{l.difficulty}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Simulado Final */}
            <div style={{ marginTop: 32 }}>
              <div style={{ height: 1, background: theme.line, marginBottom: 24 }} />
              <Card padding={20} style={{ background: `linear-gradient(135deg, ${theme.card} 0%, ${theme.bg} 100%)`, border: `1px solid ${theme.primary}33` }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 6 }}>Mini-simulado: {topic.title}</div>
                <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 16, lineHeight: 1.5 }}>Teste seus conhecimentos em todo o assunto com 10 questões e identifique seus pontos fracos.</div>
                
                <button 
                  onClick={() => setActiveSimulado(true)}
                  style={{ width: "100%", background: theme.primary, color: theme.bg, border: "none", borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                >
                  <Play size={16} fill={theme.bg} /> FAZER SIMULADO
                </button>
              </Card>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
