import React from "react";
import { theme } from "../../theme/tokens";
import { DISCIPLINES } from "../../data/mock/disciplines";
import { PROGRESS_TOTALS } from "../../data/mock/progress";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import StatTile from "../../components/ui/StatTile";
import SectionHeader from "../../components/ui/SectionHeader";
import { X, Clock, Target, Star, LogOut } from "lucide-react";
import { useAuth } from "../../state/useAuth";

export default function ProgressOverlay({ onClose }) {
  const sorted = [...DISCIPLINES].sort((a, b) => b.progress - a.progress);
  const { signOut } = useAuth();

  return (
    <div style={{ position: "absolute", inset: 0, background: theme.bg, zIndex: 20, overflowY: "auto" }} className="bs-scroll">
      <div style={{ padding: "20px 16px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Progresso</h1>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={signOut} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${theme.line}`, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <LogOut size={14} color={theme.textSecondary} />
            </button>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${theme.line}`, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <X size={16} color={theme.textSecondary} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <StatTile label="Horas estudadas" value={PROGRESS_TOTALS.hoursStudied} icon={Clock} />
          <StatTile label="Questões respondidas" value={PROGRESS_TOTALS.questionsAnswered} icon={Target} />
          <StatTile label="Taxa de acerto" value={`${PROGRESS_TOTALS.accuracyRate}%`} icon={Star} />
        </div>

        <div style={{ marginTop: 24 }}>
          <SectionHeader title="Evolução semanal" />
          <Card padding={16} style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 120, justifyContent: "space-between" }}>
            {[3, 5, 2, 8, 4, 6, 7].map((val, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
                <div style={{ width: "100%", background: theme.surface, borderRadius: 4, height: 70, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${(val / 8) * 100}%`, background: i === 6 ? theme.primary : theme.textSecondary, borderRadius: 4 }} />
                </div>
                <div style={{ fontSize: 10, color: theme.textSecondary }}>{"DSTQQSS"[i]}</div>
              </div>
            ))}
          </Card>
        </div>

        <div style={{ marginTop: 24 }}>
          <SectionHeader title="Desempenho por disciplina" />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {sorted.map((d) => (
              <Card key={d.id} padding={13}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: theme.text, fontWeight: 500 }}>{d.name}</span>
                  <span style={{ color: theme.textSecondary }}>{d.progress}%</span>
                </div>
                <ProgressBar value={d.progress} height={5} />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
