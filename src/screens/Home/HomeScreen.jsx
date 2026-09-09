import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchGlobalStats } from "../../services/supabaseService";
import { STUDY_MODES } from "../../data/mock/studyModes";
import { UPCOMING_EXAMS, REVIEWS } from "../../data/mock/progress";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import SectionHeader from "../../components/ui/SectionHeader";
import DisciplineCard from "../../components/domain/DisciplineCard";
import { TrendingUp, Flame, Calendar, BookOpenCheck } from "lucide-react";
import { resolveIcon } from "../../utils/iconResolver";

export default function HomeScreen({ onOpenDiscipline, onOpenProgress, onGoTab }) {
  const [disciplines, setDisciplines] = useState([]);
  const [stats, setStats] = useState(null);
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDisciplinesWithProgress(user.id).then(setDisciplines);
      fetchGlobalStats(user.id).then(setStats);
    }
  }, [user]);

  const recent = [...disciplines].filter((d) => d.progress > 0).sort((a, b) => b.progress - a.progress).slice(0, 3);
  const next = disciplines.filter((d) => d.progress === 0).slice(0, 2);
  const overall = disciplines.length ? Math.round(disciplines.reduce((s, d) => s + d.progress, 0) / disciplines.length) : 0;

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Estudante';

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textSecondary }}>Olá,</div>
          <h1 className="bs-display" style={{ fontSize: 24, fontWeight: 700, color: theme.text, margin: "2px 0 0" }}>{userName}! 👋</h1>
        </div>
        <button onClick={onOpenProgress} style={{ width: 40, height: 40, borderRadius: 12, background: theme.surface, border: `1px solid ${theme.line}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          <TrendingUp size={18} color={theme.primary} />
        </button>
      </div>

      <Card style={{ marginTop: 18, background: theme.card, border: "none" }} padding={18}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: theme.textSecondary, fontSize: 12 }}>Progresso geral</div>
            <div className="bs-display" style={{ color: theme.text, fontSize: 30, fontWeight: 700, marginTop: 2 }}>{overall}%</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.05)", padding: "6px 10px", borderRadius: 999 }}>
            <Flame size={14} color="#F3C77A" />
            <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{stats?.streak || 0} dias</span>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <ProgressBar value={overall} tint="#F3C77A" track="rgba(255,255,255,0.15)" />
        </div>
        <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 8 }}>
          Meta semanal: {profile?.weeklyDone || 0} de {profile?.weeklyGoal || 10} horas estudadas
        </div>
      </Card>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Continuar estudando" action="Ver todas" onAction={() => onGoTab("disciplines")} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map((d) => <DisciplineCard key={d.id} discipline={d} onClick={() => onOpenDiscipline(d)} />)}
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, marginTop: 22 }}>
        <div style={{ flex: 1 }}>
          <SectionHeader title="Próximas revisões" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REVIEWS.map((r) => (
              <Card key={r.id} padding={12} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: theme.surface, padding: 8, borderRadius: 8 }}>
                  <BookOpenCheck size={16} color={theme.primary} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: theme.textSecondary }}>{r.count} flashcards</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Próximas provas" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {UPCOMING_EXAMS.map((e) => (
            <Card key={e.id} padding={14} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: `3px solid ${theme.primary}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{e.title}</div>
                <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{e.discipline}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: theme.surface, padding: "4px 8px", borderRadius: 8 }}>
                <Calendar size={12} color={theme.textSecondary} />
                <span style={{ fontSize: 11, color: theme.textSecondary }}>{e.date}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Disciplinas em destaque" />
        <div style={{ display: "flex", gap: 10, overflowX: "auto" }} className="bs-scroll">
          {next.map((d) => {
            const Icon = resolveIcon(d.icon);
            return (
            <Card key={d.id} padding={14} style={{ minWidth: 160, flexShrink: 0, cursor: 'pointer' }} onClick={() => onOpenDiscipline(d)}>
              <Icon size={20} color={theme.primary} />
              <div style={{ fontWeight: 600, fontSize: 13, color: theme.text, marginTop: 10 }}>{d.name}</div>
              <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{d.topicsCount} tópicos</div>
            </Card>
          )})}
        </div>
      </div>
    </div>
  );
}
