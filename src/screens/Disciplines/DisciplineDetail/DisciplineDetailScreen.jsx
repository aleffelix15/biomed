import React, { useState, useEffect } from "react";
import { theme } from "../../../theme/tokens";
import { fetchTopicsByDiscipline, fetchBooksByDiscipline, getLastStudiedTopic, fetchTopicProgress, toggleTopicCompletion } from "../../../services/supabaseService";
import { useAuth } from "../../../state/AuthContext";
import { fetchTopicContent } from "../../../services/contentService";
import { marked } from "marked";
import Card from "../../../components/ui/Card";
import ProgressBar from "../../../components/ui/ProgressBar";
import SectionHeader from "../../../components/ui/SectionHeader";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import BookCard from "../../../components/domain/BookCard";
import { ChevronLeft, Library, X, Play, CheckCircle, Circle } from "lucide-react";
import { resolveIcon } from "../../../utils/iconResolver";
import StudyTimer from "../../../components/domain/StudyTimer";
import StudyPlanScreen from "../../StudyPlan/StudyPlanScreen";

const STATUS_LABEL = { concluido: "Concluído", "em-andamento": "Em andamento", pendente: "Pendente" };
const STATUS_TONE = { concluido: "teal", "em-andamento": "amber", pendente: "neutral" };

export default function DisciplineDetailScreen({ discipline, onBack }) {
  const [topics, setTopics] = useState([]);
  const [books, setBooks] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [lastTopicId, setLastTopicId] = useState(null);
  const [topicProgress, setTopicProgress] = useState([]);
  const [disciplineProgress, setDisciplineProgress] = useState(discipline.progress);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchTopicsByDiscipline(discipline),
      fetchBooksByDiscipline(discipline.id),
      user ? getLastStudiedTopic(user.id, discipline.id) : Promise.resolve(null),
      user ? fetchTopicProgress(user.id, discipline.id) : Promise.resolve([])
    ]).then(([t, b, last, prog]) => {
      setTopics(t);
      setBooks(b);
      setLastTopicId(last);
      setTopicProgress(prog);
      setLoading(false);
    });
  }, [discipline, user]);

  const handleToggleCompletion = async (topicId) => {
    if (!user) return;
    try {
      const result = await toggleTopicCompletion(user.id, topicId, discipline.id);
      if (result) {
        // Update local topic progress
        setTopicProgress(prev => {
          const exists = prev.find(p => p.topic_id === topicId);
          if (exists) {
            return prev.map(p => p.topic_id === topicId ? { ...p, completed: result.completed } : p);
          }
          return [...prev, { topic_id: topicId, completed: result.completed }];
        });
        // Update aggregate progress
        setDisciplineProgress(result.percent_complete);
      }
    } catch (err) {
      console.error("Error toggling topic completion:", err);
    }
  };

  const getTopicStatus = (topicId) => {
    const prog = topicProgress.find(p => p.topic_id === topicId);
    return prog ? (prog.completed ? "concluido" : "em-andamento") : "pendente";
  };

  const Icon = resolveIcon(discipline.icon);

  if (selectedTopic) {
    return <StudyPlanScreen topic={selectedTopic} discipline={discipline} onBack={() => setSelectedTopic(null)} />;
  }

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.textSecondary, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>
        <ChevronLeft size={16} /> Disciplinas
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={22} color={theme.primary} />
        </div>
        <div>
          <h1 className="bs-display" style={{ fontSize: 20, fontWeight: 700, color: theme.text, margin: 0 }}>{discipline.name}</h1>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{discipline.category}</div>
        </div>
      </div>

      <Card style={{ marginTop: 18 }} padding={16}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textSecondary }}>
          <span>Progresso</span><span style={{ color: theme.text, fontWeight: 600 }}>{disciplineProgress}%</span>
        </div>
        <div style={{ marginTop: 8 }}><ProgressBar value={disciplineProgress} /></div>
      </Card>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Carregando módulos...</div>
      ) : (
      <>
        <div style={{ marginTop: 16 }}>
          <StudyTimer
          userId={user?.id}
          disciplineId={discipline.id}
          topicId={selectedTopic?.id || topics[0]?.id}
          onSessionEnd={() => {
            // Recalcular progresso ou notificar usuário
          }}
        />
      </div>

      {discipline.description && (
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, margin: 0 }}>
          {discipline.description}
        </p>
      </div>
      )}

      <button
        onClick={() => {
          const nextTopic = topics.find(t => t.id === lastTopicId) || topics[0];
          if (nextTopic) setSelectedTopic(nextTopic);
        }}
        style={{ width: "100%", marginTop: 16, background: theme.primary, color: theme.bg, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <Play size={18} fill={theme.bg} /> {lastTopicId ? "Continuar estudando" : "Iniciar estudo"}
      </button>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Módulos" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {topics.map((t) => (
            <Card
              key={t.id}
              padding={12}
              onClick={t.hasContent ? () => setSelectedTopic(t) : undefined}
              style={{ cursor: t.hasContent ? "pointer" : "default" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: theme.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t.title}
                  {t.hasContent && <Badge tone="teal">Ler Resumo</Badge>}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleCompletion(t.id);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {getTopicStatus(t.id) === "concluido" ?
                      <CheckCircle size={18} color={theme.primary} /> :
                      <Circle size={18} color={theme.line} />
                    }
                  </button>
                  <Badge tone={STATUS_TONE[getTopicStatus(t.id)]}>{STATUS_LABEL[getTopicStatus(t.id)]}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Biblioteca recomendada" />
        {books.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {books.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        ) : (
          <EmptyState icon={Library} title="Ainda sem livros cadastrados" desc="Esta disciplina receberá indicações bibliográficas em breve." />
        )}
      </div>
      </>
      )}
    </div>
  );
}
