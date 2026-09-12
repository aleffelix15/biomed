import React, { useState } from "react";
import { fetchDisciplinesWithProgress } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import { useCachedQuery } from "../../state/DataCacheContext";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import EmptyState from "../../components/ui/EmptyState";
import { Layers, Brain } from "lucide-react";

export default function FlashcardScreen() {
  const [activeTab, setActiveTab] = useState("Revisão");
  const { user } = useAuth();

  // For UI mockup purposes, we'll fetch disciplines to generate dummy "Decks" based on actual content
  const { data: discData, loading } = useCachedQuery(
    user ? 'disciplines:' + user.id : null,
    () => fetchDisciplinesWithProgress(user.id)
  );

  const disciplines = discData || [];
  const startedDisciplines = disciplines.filter(d => d.progress_percent > 0).slice(0, 4); // Limit to 4 for UI

  return (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <Layers size={28} color="var(--theme-text)" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--theme-text)", margin: 0 }}>Flashcards</h1>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, background: "var(--theme-surface)", padding: 4, borderRadius: 24, border: "1px solid var(--theme-line)" }}>
        {["Revisão", "Meus decks"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 20,
              background: activeTab === tab ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeTab === tab ? "var(--theme-text)" : "var(--theme-text-secondary)",
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

      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--theme-text-secondary)" }}>Carregando dados...</div>
      ) : activeTab === "Revisão" ? (
        <div>
          {startedDisciplines.length > 0 ? (
            startedDisciplines.map((d, idx) => (
              <Card key={d.id} padding={20} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--theme-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Brain size={24} color="var(--theme-primary)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: "var(--theme-text)", marginBottom: 4 }}>{d.name}</div>
                    <div style={{ fontSize: 13, color: "var(--theme-text-secondary)", marginBottom: 16 }}>
                      {Math.max(10, Math.floor(Math.random() * 100))} cards • {idx + 1} decks ativos
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                      <ProgressBar value={d.progress_percent} height={6} tint="var(--theme-primary)" track="var(--theme-line)" />
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-text-secondary)" }}>{d.progress_percent}%</div>
                    </div>
                    <button style={{ width: "100%", background: "var(--theme-primary)", color: "#000", border: "none", borderRadius: 12, padding: 12, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                      Revisar
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
             <EmptyState icon={Brain} title="Nenhuma revisão hoje" desc="Comece a estudar para popular seus flashcards automaticamente com seus erros ou crie decks." />
          )}
        </div>
      ) : (
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--theme-text)", marginBottom: 16 }}>Seus decks</div>
          {startedDisciplines.length > 0 ? (
            startedDisciplines.map((d) => (
              <Card key={d.id} padding={16} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--theme-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Layers size={20} color="var(--theme-accent-light)" />
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "var(--theme-text)", marginBottom: 2 }}>{d.name}</div>
                      <div style={{ fontSize: 12, color: "var(--theme-text-secondary)" }}>{Math.max(20, Math.floor(Math.random() * 80))} cards • {Math.floor(Math.random() * 10)} revisões hoje</div>
                    </div>
                  </div>
                  <button style={{ background: "transparent", border: "1px solid var(--theme-primary)", color: "var(--theme-primary)", padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                    Revisar
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <EmptyState icon={Layers} title="Nenhum deck encontrado" desc="Você ainda não possui nenhum deck ativo." />
          )}
        </div>
      )}
    </div>
  );
}

