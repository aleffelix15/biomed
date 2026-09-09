import React from "react";
import { theme } from "../../theme/tokens";
import { LAB_SECTIONS } from "../../data/mock/labSections";
import Card from "../../components/ui/Card";
import { ChevronRight } from "lucide-react";

export default function LabScreen() {
  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Laboratório</h1>
      
      <Card padding={16} style={{ marginTop: 16, background: theme.primary, border: "none" }}>
        <div style={{ color: theme.bg, fontWeight: 700, fontSize: 16 }}>Central Biomédica</div>
        <p style={{ fontSize: 13, color: theme.bg, opacity: 0.9, marginTop: 4, lineHeight: 1.5, margin: "4px 0 0" }}>
          Conteúdo prático voltado à rotina laboratorial — técnicas, equipamentos, biossegurança e interpretação.
        </p>
      </Card>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {LAB_SECTIONS.map((s) => (
          <Card key={s.id} padding={14}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={18} color={theme.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{s.title}</div>
                <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{s.desc}</div>
              </div>
              <ChevronRight size={16} color={theme.textSecondary} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
