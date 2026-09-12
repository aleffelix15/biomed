import React from "react";
import { theme } from "../../theme/tokens";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import { ChevronRight, Zap } from "lucide-react";
import { resolveIcon } from "../../utils/iconResolver";

export default function DisciplineCard({ discipline, onClick }) {
  const d = discipline;
  const difficulty = d.difficulty || "Médio";
  const IconComponent = resolveIcon(d.icon);
  
  return (
    <Card onClick={onClick} padding={14}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <IconComponent size={18} color={theme.primary} strokeWidth={2} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{d.name}</div>
            <div style={{ fontSize: 9, fontWeight: 600, background: theme.surface, color: theme.textSecondary, padding: "2px 6px", borderRadius: 4, textTransform: "uppercase" }}>{difficulty}</div>
          </div>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 1 }}>{d.topics_count || d.topicsCount || 0} tópicos</div>
        </div>
        {d.progress_percent > 0 && (
           <div style={{ display: "flex", alignItems: "center", gap: 4, background: theme.primary, color: theme.bg, padding: "4px 8px", borderRadius: 8, fontSize: 11, fontWeight: 600 }}>
             Continuar
           </div>
        )}
        {d.progress_percent === 0 && <ChevronRight size={16} color={theme.textSecondary} />}
      </div>
      <div style={{ marginTop: 12 }}>
        <ProgressBar value={d.progress_percent} />
        <div style={{ fontSize: 11, color: theme.textSecondary, marginTop: 4 }}>{d.progress_percent}% concluído</div>
      </div>
    </Card>
  );
}
