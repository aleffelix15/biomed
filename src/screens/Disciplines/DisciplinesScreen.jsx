import React, { useMemo, useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import SectionHeader from "../../components/ui/SectionHeader";
import EmptyState from "../../components/ui/EmptyState";
import DisciplineCard from "../../components/domain/DisciplineCard";
import { Search } from "lucide-react";

export default function DisciplinesScreen({ onOpenDiscipline }) {
  const [query, setQuery] = useState("");
  const [disciplines, setDisciplines] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDisciplinesWithProgress(user.id).then(setDisciplines);
    }
  }, [user]);

  const grouped = useMemo(() => {
    const filtered = disciplines.filter((d) => d.name.toLowerCase().includes(query.toLowerCase()));
    return filtered.reduce((acc, d) => {
      (acc[d.category] ||= []).push(d);
      return acc;
    }, {});
  }, [query, disciplines]);

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Disciplinas</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 12, padding: "9px 12px" }}>
        <Search size={16} color={theme.textSecondary} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar disciplina"
          style={{ border: "none", outline: "none", fontSize: 14, flex: 1, color: theme.text, background: "transparent" }}
        />
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginTop: 22 }}>
          <SectionHeader title={category} />
          <div className="responsive-grid">
            {items.map((d) => <DisciplineCard key={d.id} discipline={d} onClick={() => onOpenDiscipline(d)} />)}
          </div>
        </div>
      ))}

      {Object.keys(grouped).length === 0 && (
        <EmptyState icon={Search} title="Nenhuma disciplina encontrada" desc="Tente buscar por outro nome." />
      )}
    </div>
  );
}
