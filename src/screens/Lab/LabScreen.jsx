import React, { useState, useEffect } from "react";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { fetchLabProgress } from "../../services/supabaseService";
import { labItems } from "../../content/laboratory/labData";
import LabDetailView from "./LabDetailView";
import { FlaskConical, Stethoscope, ClipboardList, ChevronRight } from "lucide-react";

export default function LabScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Casos");
  const [selectedCase, setSelectedCase] = useState(null);
  
  // Real cases from labData
  const cases = labItems.filter(item => item.categoryId === "clinicalCases");

  if (selectedCase) {
    return <LabDetailView item={selectedCase} onBack={() => setSelectedCase(null)} />;
  }

  return (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <FlaskConical size={28} color="var(--theme-text)" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--theme-text)", margin: 0 }}>Laboratório</h1>
      </div>
      <div style={{ fontSize: 14, color: "var(--theme-text-secondary)", marginBottom: 24 }}>
        Casos reais para aplicar o que você aprendeu.
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--theme-surface)", padding: 4, borderRadius: 24, border: "1px solid var(--theme-line)" }}>
        {["Casos", "Simulados"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 20,
              background: activeTab === tab ? "rgba(28, 230, 121, 0.15)" : "transparent",
              color: activeTab === tab ? "var(--theme-primary)" : "var(--theme-text-secondary)",
              fontWeight: activeTab === tab ? 600 : 500,
              fontSize: 14,
              border: "none",
              transition: "all 0.2s ease"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Casos" ? (
        <div>
          {cases.length > 0 ? (
            cases.map((c, index) => (
              <Card key={c.id} padding={16} onClick={() => setSelectedCase(c)} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 72, height: 72, borderRadius: 16, background: "rgba(255, 255, 255, 0.05)", border: "1px solid var(--theme-line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Stethoscope size={32} color="var(--theme-primary)" opacity={0.8} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--theme-text)", marginBottom: 4 }}>
                      Caso {index + 1} - {c.title.split(' em ')[0]}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--theme-text-secondary)", marginBottom: 8 }}>
                      {c.tags?.[0] || 'Geral'} • Nível: Intermediário
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-primary)" }}>
                      Ler diagnóstico completo
                    </div>
                  </div>
                  <ChevronRight size={20} color="var(--theme-muted)" />
                </div>
              </Card>
            ))
          ) : (
            <EmptyState icon={FlaskConical} title="Nenhum caso clínico" desc="Os casos clínicos estão sendo preparados." />
          )}
        </div>
      ) : (
        <div>
          <EmptyState 
             icon={ClipboardList} 
             title="Simulados em Breve" 
             desc="Nós estamos preparando um banco de questões focado para você treinar para as principais provas e concursos." 
          />
        </div>
      )}
    </div>
  );
}
