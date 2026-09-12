import React, { useState } from "react";
import { completeLesson } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import { ChevronLeft, Bookmark, Type, ArrowRight, Play, AlertTriangle } from "lucide-react";
import QuizScreen from "../Quiz/QuizScreen";
import ContentRenderer from "../../components/common/ContentRenderer";
import AiAssistant from "../../components/domain/AiAssistant";
import { resolveIcon } from "../../utils/iconResolver";

export default function LessonScreen({ lesson, topic, discipline, module, onBack }) {
  const [submitting, setSubmitting] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const { user } = useAuth();
  const IconComponent = resolveIcon(discipline?.icon);

  const handleComplete = async () => {
    if (!user || submitting) return;
    setSubmitting(true);
    try {
      await completeLesson(user.id, lesson.id, topic.id);
      setActiveQuiz(true); // Na UI 2.0, avançar leva ao Quiz!
    } catch (err) {
      console.error(err);
      // Fallback in case of error
      setActiveQuiz(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (activeQuiz) {
    return <QuizScreen topicId={topic.id} disciplineId={discipline.id} lessonId={lesson.id} isSimulado={false} onBack={onBack} />;
  }

  // Determine Module/Topic texts for the UI
  const breadcrumb = `${discipline?.name || 'Disciplina'} • ${topic?.title || 'Tópico'}`;
  const subBreadcrumb = `Módulo ${module?.order !== undefined ? module.order + 1 : 1} • Tópico ${topic?.order !== undefined ? topic.order + 1 : 1} • Aula ${lesson?.order !== undefined ? lesson.order + 1 : 1}`;

  return (
    <div style={{ position: "absolute", inset: 0, background: "var(--theme-bg)", zIndex: 60, overflowY: "auto", display: "flex", flexDirection: "column" }} className="bs-scroll">
      
      {/* HEADER FIXO */}
      <div style={{ position: "sticky", top: 0, background: "var(--theme-bg)", zIndex: 10, padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--theme-line)" }}>
        <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 12, background: "none", color: "var(--theme-text)", fontSize: 16, fontWeight: 600 }}>
          <ChevronLeft size={24} /> Aula
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "var(--theme-text)" }}>
          <Bookmark size={20} />
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Type size={14} />
            <Type size={18} />
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px 120px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
        
        {/* CABEÇALHO DA AULA */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255, 255, 255, 0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {IconComponent && <IconComponent size={24} color="var(--theme-primary)" />}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--theme-text)" }}>{breadcrumb}</div>
            <div style={{ fontSize: 12, color: "var(--theme-text-secondary)", marginTop: 2 }}>
              {subBreadcrumb}
            </div>
          </div>
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--theme-text)", marginBottom: 16, lineHeight: 1.3 }}>
          {lesson.title}
        </h1>
        
        <p style={{ fontSize: 15, color: "var(--theme-text-secondary)", marginBottom: 24, lineHeight: 1.6 }}>
          {lesson.description}
        </p>

        {/* IMAGENS DE DESTAQUE (mocked visual layout for actual images) */}
        {lesson.images && lesson.images.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {lesson.images.map((img, idx) => (
              <figure key={idx} style={{ margin: "0 0 16px 0" }}>
                <img
                  src={img.url}
                  alt={img.caption}
                  style={{ width: "100%", borderRadius: 16, border: "1px solid var(--theme-line)", display: "block" }}
                />
                <figcaption style={{ fontSize: 12, color: "var(--theme-text-secondary)", marginTop: 8 }}>
                  {img.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        )}

        {/* CONTEÚDO PRINCIPAL */}
        <div style={{ color: "var(--theme-text)", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          <ContentRenderer blocks={lesson.content_blocks} fallbackMarkdown={lesson.content_markdown || lesson.content} />
        </div>

        {/* PONTOS PRINCIPAIS */}
        {(() => {
          const keyPoints = Array.isArray(lesson.key_points)
            ? lesson.key_points
            : (typeof lesson.key_points === 'string'
                ? (() => { try { return JSON.parse(lesson.key_points); } catch { return []; } })()
                : []);
          
          if (keyPoints.length > 0) {
            return (
              <Card padding={20} style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-line)", marginBottom: 32 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--theme-text)", marginBottom: 16 }}>Pontos principais</div>
                <ul style={{ margin: 0, padding: "0 0 0 20px", color: "var(--theme-text-secondary)", fontSize: 14 }}>
                  {keyPoints.map((kp, idx) => (
                    <li key={idx} style={{ marginBottom: 8, paddingLeft: 4 }}>{kp}</li>
                  ))}
                </ul>
              </Card>
            );
          }
          return null;
        })()}

        <AiAssistant topic={topic?.name || lesson.title} />

      </div>

      {/* BOTTOM BAR (Ação de Avançar) */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, padding: "16px 20px 32px", background: "var(--theme-card)", borderTop: "1px solid var(--theme-line)", zIndex: 10 }}>
        <button 
          onClick={handleComplete}
          disabled={submitting}
          style={{ 
            width: "100%", 
            background: "var(--theme-primary)", 
            color: "#000", 
            border: "none", 
            borderRadius: 16, 
            padding: "16px", 
            fontSize: 16, 
            fontWeight: 700, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            gap: 8,
            transition: "opacity 0.2s ease"
          }}
        >
          {submitting ? "SALVANDO..." : "Testar conhecimento"}
        </button>
      </div>
    </div>
  );
}
