import React from "react";
import Card from "../ui/Card";
import ProgressBar from "../ui/ProgressBar";
import { ChevronRight } from "lucide-react";
import { resolveIcon } from "../../utils/iconResolver";

export default function DisciplineCard({ discipline, onClick, index = 0 }) {
  const d = discipline;
  const IconComponent = resolveIcon(d.icon);
  
  // Fake colors for visual variety based on index, as requested in Mockup
  const colors = [
    { bg: "rgba(30, 144, 255, 0.15)", fg: "var(--theme-info)" },     // Blue
    { bg: "rgba(255, 165, 2, 0.15)", fg: "var(--theme-warning)" },  // Orange
    { bg: "rgba(255, 71, 87, 0.15)", fg: "var(--theme-danger)" },   // Red
    { bg: "rgba(28, 230, 121, 0.15)", fg: "var(--theme-primary)" }, // Green
    { bg: "rgba(181, 134, 248, 0.15)", fg: "var(--theme-accent-light)" } // Purple
  ];
  const color = colors[index % colors.length];

  const totalTopics = d.topics_count || d.topicsCount || 0;
  const completedTopics = Math.round(((d.progress_percent || 0) / 100) * totalTopics);

  return (
    <Card onClick={onClick} padding={16} style={{ marginBottom: 12 }} className="theme-nocturne">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Colorful Box */}
        <div style={{ width: 44, height: 44, borderRadius: 12, background: color.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <IconComponent size={22} color={color.fg} strokeWidth={2} />
        </div>
        
        {/* Details */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: "var(--theme-text)", marginBottom: 2 }}>{d.name}</div>
          <div style={{ fontSize: 13, color: "var(--theme-text-secondary)" }}>
            {completedTopics}/{totalTopics} tópicos
          </div>
        </div>
        
        {/* Right Arrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronRight size={20} color="var(--theme-muted)" />
        </div>
      </div>
      
      {/* Progress */}
      <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
        <ProgressBar value={d.progress_percent || 0} height={4} tint={color.fg} track="var(--theme-line)" />
        <div style={{ fontSize: 12, color: "var(--theme-text-secondary)", fontWeight: 600, width: 35, textAlign: "right" }}>
          {d.progress_percent || 0}%
        </div>
      </div>
    </Card>
  );
}
