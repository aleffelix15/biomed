import React, { useState } from "react";
import { theme, alpha } from "../../theme/tokens";
import { completeLesson } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import { marked } from "marked";
import { ChevronLeft, Check, BookOpen, AlertTriangle, ListChecks, Play } from "lucide-react";
import QuizScreen from "../Quiz/QuizScreen";
import AiAssistant from "../../components/domain/AiAssistant";
import ContentRenderer from "../../components/common/ContentRenderer";

export default function LessonScreen({ lesson, topic, discipline, onBack }) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const { user } = useAuth();

  const handleComplete = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await completeLesson(user.id, lesson.id, topic.id);
      onBack(); // Voltar para o plano
    } catch (err) {
      console.error("Erro ao salvar conclusão da aula:", err);
      setErrorMsg("Não foi possível salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (activeQuiz) {
    return <QuizScreen topicId={topic.id} disciplineId={discipline.id} lessonId={lesson.id} isSimulado={false} onBack={() => setActiveQuiz(false)} />;
  }

  return (
    <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 60, overflowY: "auto" }} className="bs-scroll">
      <div style={{ padding: "20px 16px 120px" }}>
        
        {/* Header */}
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.textSecondary, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20 }}>
          <ChevronLeft size={16} /> Voltar ao Plano
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: theme.primary, textTransform: "uppercase" }}>{lesson.difficulty}</span>
          <span style={{ color: theme.textSecondary, fontSize: 12 }}>•</span>
          <span style={{ fontSize: 12, color: theme.textSecondary }}>{lesson.estimated_minutes} min</span>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 800, color: theme.text, marginBottom: 8, lineHeight: 1.3 }}>
          {lesson.title}
        </h1>
        
        <p style={{ fontSize: 15, color: theme.textSecondary, marginBottom: 24, lineHeight: 1.5 }}>
          {lesson.description}
        </p>

        {/* AI Assistant Contextual */}
        <Card padding={16} style={{ marginBottom: 24, background: alpha(theme.primary, '10'), borderColor: alpha(theme.primary, '20') }}>
          <AiAssistant context={`Aula: ${lesson.title}. Disciplina: ${discipline.name}. Tópico: ${topic.title}`} compact />
        </Card>

        {/* Conteúdo Principal Renderizado */}
        <ContentRenderer blocks={lesson.content_blocks} fallbackMarkdown={lesson.content_markdown} />

        {/* Imagens (se existirem) */}
        {lesson.images && lesson.images.length > 0 && (
          <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            {lesson.images.map((img, idx) => (
              <figure key={idx} style={{ margin: 0 }}>
                <img
                  src={img.url}
                  alt={img.caption}
                  loading="lazy"
                  style={{ width: "100%", borderRadius: 12, border: `1px solid ${theme.line}` }}
                />
                <figcaption style={{ fontSize: 12, color: theme.textSecondary, marginTop: 6, lineHeight: 1.4 }}>
                  {img.caption}
                  {img.source && <span> — Fonte: {img.source} ({img.license})</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* Aplicação Clínica */}
        {lesson.clinical_application && (
          <Card padding={16} style={{ background: alpha(theme.danger, '15'), border: `1px solid ${alpha(theme.danger, '40')}`, marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <AlertTriangle size={18} color={theme.danger} />
              <span style={{ fontSize: 14, fontWeight: 700, color: theme.danger }}>Aplicação Clínica</span>
            </div>
            <div style={{ fontSize: 14, color: theme.text, lineHeight: 1.5 }}>{lesson.clinical_application}</div>
          </Card>
        )}

        {/* Resumo e Pontos Chave */}
        {lesson.summary && (
          <div style={{ marginTop: 32 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <ListChecks size={18} color={theme.primary} /> Resumo Rápido
            </div>
            <Card padding={16} style={{ background: theme.surface, border: `1px solid ${theme.line}` }}>
              <div style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, marginBottom: 16 }}>{lesson.summary}</div>
              
              {(() => {
                const keyPoints = Array.isArray(lesson.key_points)
                  ? lesson.key_points
                  : (typeof lesson.key_points === 'string'
                      ? (() => { try { return JSON.parse(lesson.key_points); } catch { return []; } })()
                      : []);
                
                return keyPoints.length > 0 ? (
                  <ul style={{ margin: 0, padding: "0 0 0 20px", color: theme.text, fontSize: 14 }}>
                    {keyPoints.map((kp, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>{kp}</li>
                    ))}
                  </ul>
                ) : null;
              })()}
            </Card>
          </div>
        )}

        {/* Quiz da Aula */}
        <div style={{ marginTop: 32 }}>
           <Card padding={16} style={{ background: theme.surface, border: `1px dashed ${alpha(theme.textSecondary, '40')}`, textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: theme.text, marginBottom: 4 }}>Fixe o conhecimento</div>
              <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 12 }}>Responda questões rápidas sobre esta aula para testar sua retenção.</div>
              <button
                onClick={() => setActiveQuiz(true)}
                style={{ background: theme.bg, color: theme.text, border: `1px solid ${theme.line}`, borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Play size={14} /> FAZER MINI-QUIZ
              </button>
           </Card>
        </div>

        {/* AI Assistant Integration */}
        <AiAssistant topic={topic?.name || lesson.title} />

      </div>

      {/* Fixed Bottom Bar for Completion */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px", background: theme.card, borderTop: `1px solid ${theme.line}`, zIndex: 10 }}>
        {errorMsg && (
          <div style={{ background: alpha(theme.danger, '22'), color: theme.danger, padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 12, textAlign: "center" }}>
            {errorMsg}
          </div>
        )}
        <button 
          onClick={handleComplete}
          disabled={submitting}
          style={{ width: "100%", background: theme.primary, color: theme.bg, border: "none", borderRadius: 12, padding: 16, fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: submitting ? 0.7 : 1 }}
        >
          <Check size={20} strokeWidth={3} /> {submitting ? "SALVANDO..." : "MARCAR COMO CONCLUÍDO"}
        </button>
      </div>

    </div>
  );
}
