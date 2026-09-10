import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchGlobalStats } from "../../services/supabaseService";

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([
        fetchDisciplinesWithProgress(user.id),
        fetchGlobalStats(user.id)
      ]).then(([discs, st]) => {
        setDisciplines(discs);
        setStats(st);
        setLoading(false);
      });
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

      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Carregando dados...</div>
      ) : (
      <>

      <Card style={{ marginTop: 18, background: theme.card, border: "none" }} padding={18}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 600 }}>Progresso Geral</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: theme.text }}>{overall}%</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: alpha(theme.text, '11'), padding: "6px 10px", borderRadius: 999 }}>
            <Flame size={14} color="#F3C77A" />
            <span style={{ color: theme.text, fontSize: 13, fontWeight: 600 }}>{stats?.streak || 0} dias</span>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <ProgressBar value={overall} tint="#F3C77A" track={alpha(theme.text, '22')} />
        </div>

      </Card>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Continuar estudando" action="Ver todas" onAction={() => onGoTab("disciplines")} />
        <div className="responsive-grid">
          {recent.map((d) => <DisciplineCard key={d.id} discipline={d} onClick={() => onOpenDiscipline(d)} />)}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Próximas revisões" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Replaced mock with an empty state until real spaced repetition is wired in later sprints */}
          <Card padding={16} style={{ textAlign: "center" }}>
            <BookOpenCheck size={24} color={theme.textSecondary} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div style={{ fontSize: 13, color: theme.textSecondary }}>Nenhuma revisão pendente no momento.</div>
          </Card>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Próximas provas" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Replaced mock with an empty state since exams table doesn't exist yet */}
          <Card padding={16} style={{ textAlign: "center" }}>
            <Calendar size={24} color={theme.textSecondary} style={{ marginBottom: 8, opacity: 0.5 }} />
            <div style={{ fontSize: 13, color: theme.textSecondary }}>Nenhuma prova agendada.</div>
          </Card>
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
      </>
      )}
    </div>
  );
}
