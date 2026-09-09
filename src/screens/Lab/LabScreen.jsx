import React, { useState } from "react";
import { theme } from "../../theme/tokens";
import { LAB_SECTIONS } from "../../data/mock/labSections";
import Card from "../../components/ui/Card";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function LabScreen() {
  const [selectedSection, setSelectedSection] = useState(null);

  if (selectedSection) {
    return (
      <div style={{ padding: "20px 16px 90px", minHeight: "100%" }}>
        <button 
          onClick={() => setSelectedSection(null)} 
          style={{ background: "none", border: "none", color: theme.textSecondary, display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 20 }}
        >
          <ChevronLeft size={16} /> Voltar ao Laboratório
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <selectedSection.icon size={22} color={theme.primary} />
          </div>
          <div>
            <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>{selectedSection.title}</h1>
          </div>
        </div>

        <Card padding={20} style={{ color: theme.text, fontSize: 14, lineHeight: 1.6, border: "none", background: theme.card }}>
          <p style={{ margin: "0 0 16px 0", color: theme.textSecondary }}>{selectedSection.desc}</p>
          <div style={{ padding: 16, background: theme.surface, borderRadius: 12, border: `1px solid ${theme.line}`, textAlign: "center" }}>
            <p style={{ margin: 0, color: theme.textSecondary, fontSize: 13 }}>Conteúdo de {selectedSection.title} em desenvolvimento. Em breve você poderá acessar protocolos práticos, lista de equipamentos e simulações.</p>
          </div>
        </Card>
      </div>
    );
  }

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
          <Card key={s.id} padding={14} onClick={() => setSelectedSection(s)} style={{ cursor: "pointer", transition: "transform 0.2s" }}>
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
