import React, { useState } from "react";
import { fetchDisciplinesWithProgress } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import { useCachedQuery } from "../../state/DataCacheContext";
import EmptyState from "../../components/ui/EmptyState";
import DisciplineCard from "../../components/domain/DisciplineCard";
import { Search } from "lucide-react";

export default function DisciplinesScreen({ onOpenDiscipline }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todas");
  const { user } = useAuth();

  const { data: discData, loading } = useCachedQuery(
    user ? 'disciplines:' + user.id : null,
    () => fetchDisciplinesWithProgress(user.id)
  );
  
  const disciplines = discData || [];

  const filters = ["Todas", "Básicas", "Clínicas", "Específicas"];

  const filtered = disciplines.filter((d) => {
    const matchesQuery = d.name.toLowerCase().includes(query.toLowerCase());
    const cat = d.category || "Geral";
    const matchesFilter = activeFilter === "Todas" || 
                         (activeFilter === "Básicas" && cat.toLowerCase().includes("básica")) ||
                         (activeFilter === "Clínicas" && cat.toLowerCase().includes("clínica")) ||
                         (activeFilter === "Específicas" && cat.toLowerCase().includes("específica"));
    
    // If categorization is incomplete, fallback to showing all when not searching by specific known string
    return matchesQuery && (activeFilter === "Todas" || matchesFilter || !d.category);
  });

  return (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      {/* HEADER */}
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--theme-text)", margin: "0 0 4px" }}>
        Disciplinas
      </h1>
      <div style={{ fontSize: 14, color: "var(--theme-text-secondary)", marginBottom: 24, lineHeight: 1.4 }}>
        Explore todas as disciplinas e acompanhe seu progresso.
      </div>

      {/* SEARCH */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <Search size={18} color="var(--theme-muted)" />
        </div>
        <input 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text" 
          placeholder="Buscar disciplina..." 
          style={{
            width: "100%",
            height: 48,
            background: "var(--theme-surface)",
            border: "1px solid var(--theme-line)",
            borderRadius: 16,
            padding: "0 16px 0 44px",
            color: "var(--theme-text)",
            fontSize: 15,
            outline: "none"
          }}
        />
      </div>

      {/* FILTERS */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 16 }} className="bs-scroll">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: `1px solid ${activeFilter === f ? "var(--theme-primary)" : "var(--theme-line)"}`,
              background: activeFilter === f ? "rgba(28, 230, 121, 0.15)" : "transparent",
              color: activeFilter === f ? "var(--theme-primary)" : "var(--theme-text-secondary)",
              fontWeight: activeFilter === f ? 600 : 500,
              fontSize: 14,
              whiteSpace: "nowrap",
              transition: "all 0.2s ease"
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--theme-text-secondary)" }}>Carregando dados...</div>
      ) : filtered.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {filtered.map((d, i) => (
            <DisciplineCard key={d.id} discipline={d} index={i} onClick={() => onOpenDiscipline(d)} />
          ))}
        </div>
      ) : (
        <EmptyState icon={Search} title="Nenhuma disciplina" desc="Não encontramos nada com esse nome." />
      )}
    </div>
  );
}
