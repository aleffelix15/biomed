import React from "react";
import { theme } from "../../theme/tokens";
import { STUDY_MODES } from "../../data/mock/studyModes";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SectionHeader from "../../components/ui/SectionHeader";

export default function StudyScreen() {
  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Estudar</h1>
      <p style={{ fontSize: 13, color: theme.textSecondary, marginTop: 6, lineHeight: 1.5 }}>
        Ferramentas de estudo ativo, organizadas por método. O conteúdo completo chega nas próximas versões.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
        {STUDY_MODES.map((m) => (
          <Card key={m.id} padding={14}>
            <m.icon size={18} color={theme.primary} />
            <div style={{ fontWeight: 600, fontSize: 14, color: theme.text, marginTop: 10 }}>{m.title}</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 4, lineHeight: 1.4 }}>{m.desc}</div>
            <div style={{ marginTop: 10 }}><Badge tone="neutral">{m.count} itens de exemplo</Badge></div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Exemplo — flashcard" />
        <Card padding={20} style={{ textAlign: "center" }}>
          <Badge tone="amber">Bioquímica</Badge>
          <div className="bs-display" style={{ fontSize: 16, fontWeight: 600, color: theme.text, marginTop: 14 }}>
            Qual enzima catalisa a primeira etapa irreversível da glicólise?
          </div>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 10 }}>Toque para revelar a resposta (exemplo estático)</div>
        </Card>
      </div>
    </div>
  );
}
