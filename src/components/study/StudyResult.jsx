import React from 'react';
import { theme, alpha } from '../../theme/tokens';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { Trophy, RotateCcw, ArrowRight } from 'lucide-react';

export default function StudyResult({ 
  mode, // 'flashcards', 'questions', 'simulado', 'prova'
  correctCount,
  totalCount,
  timeTaken, // in seconds (for exam mode)
  topicStats, // { 'topic_id': { name: '', correct: 0, total: 0 } }
  onRetry,
  onFinish
}) {
  const percent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  
  let status = "PRECISA REFORÇO";
  let statusColor = theme.danger;
  if (percent >= 80) { status = "DOMINADO"; statusColor = theme.primary; }
  else if (percent >= 60) { status = "REVISAR"; statusColor = theme.secondary; }

  const mins = timeTaken ? Math.floor(timeTaken / 60) : 0;
  const secs = timeTaken ? timeTaken % 60 : 0;
  
  const topicsArray = Object.values(topicStats || {}).map(st => ({
    ...st,
    percent: st.total > 0 ? Math.round((st.correct / st.total) * 100) : 0
  })).sort((a, b) => b.percent - a.percent);

  const needsReview = topicsArray.filter(t => t.percent < 70);
  const mastered = topicsArray.filter(t => t.percent >= 70);

  return (
    <div style={{ padding: "20px 16px 90px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", overflowY: "auto", textAlign: "center" }}>
      <div style={{ width: 80, height: 80, borderRadius: 40, background: alpha(statusColor, '20'), display: "flex", alignItems: "center", justifyContent: "center", margin: "20px auto 20px" }}>
        <Trophy size={40} color={statusColor} />
      </div>
      
      <h1 className="bs-display" style={{ fontSize: 36, fontWeight: 800, color: theme.text, margin: 0 }}>
        {mode === 'flashcards' ? 'Concluído!' : `${percent}%`}
      </h1>
      
      {mode !== 'flashcards' && (
        <div style={{ fontSize: 18, fontWeight: 700, color: statusColor, marginTop: 8 }}>{status}</div>
      )}
      
      <div style={{ fontSize: 15, color: theme.textSecondary, marginTop: 12, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {mode === 'flashcards' ? (
          <span>Você revisou {totalCount} flashcards.</span>
        ) : (
          <span>Você acertou {correctCount} de {totalCount} questões.</span>
        )}
        {timeTaken != null && (
          <span style={{ fontWeight: 600 }}>Tempo: {mins}m {secs.toString().padStart(2, '0')}s</span>
        )}
      </div>

      {(mode === 'questions' || mode === 'simulado' || mode === 'prova') && topicsArray.length > 0 && (
        <Card padding={20} style={{ background: theme.surface, border: `1px solid ${theme.line}`, marginBottom: 24, width: "100%", maxWidth: 500, textAlign: "left" }}>
          
          <h3 style={{ fontSize: 16, fontWeight: 700, color: theme.text, marginBottom: 16, borderBottom: `1px solid ${theme.line}`, paddingBottom: 8 }}>
            Desempenho por Assunto
          </h3>
          
          {topicsArray.map((st, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 14, color: theme.text, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingRight: 10 }}>
                {st.name}
              </div>
              <Badge tone={st.percent >= 70 ? "success" : "critical"}>{st.percent}%</Badge>
            </div>
          ))}

          {needsReview.length > 0 && (
            <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${theme.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.danger, marginBottom: 8, textTransform: "uppercase" }}>Recomendamos Revisar:</div>
              <ul style={{ margin: 0, paddingLeft: 20, color: theme.textSecondary, fontSize: 14 }}>
                {needsReview.map((t, i) => <li key={i} style={{ marginBottom: 4 }}>{t.name}</li>)}
              </ul>
            </div>
          )}
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 400 }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{ padding: "16px", borderRadius: 12, background: theme.surface, color: theme.primary, border: `2px solid ${theme.primary}`, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          >
            <RotateCcw size={18} /> {mode === 'flashcards' ? 'Revisar Novamente' : 'Tentar Novamente'}
          </button>
        )}
        <button
          onClick={onFinish}
          style={{ padding: "16px", borderRadius: 12, background: theme.primary, color: theme.bg, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          Voltar para Estudar <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

