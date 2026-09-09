import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchGlobalStats } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import Card from "../../components/ui/Card";
import ProgressBar from "../../components/ui/ProgressBar";
import StatTile from "../../components/ui/StatTile";
import SectionHeader from "../../components/ui/SectionHeader";
import { X, Clock, Target, Star, LogOut } from "lucide-react";

export default function ProgressOverlay({ onClose }) {
  const { user, signOut } = useAuth();
  const [disciplines, setDisciplines] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        const [discs, globalStats] = await Promise.all([
          fetchDisciplinesWithProgress(user.id),
          fetchGlobalStats(user.id),
        ]);
        setDisciplines(discs.sort((a, b) => (b.progress || 0) - (a.progress || 0)));
        setStats(globalStats);
      } catch (err) {
        console.error("Error loading progress:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const formatHours = (val) => {
    if (!val && val !== 0) return "0";
    const h = Math.floor(val / 3600);
    return h > 0 ? h : "<1";
  };

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

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Carregando progresso...</div>
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
              <StatTile label="Horas estudadas" value={formatHours(stats?.totalStudySeconds || 0)} icon={Clock} />
              <StatTile label="Questões respondidas" value={stats?.totalQuestions || 0} icon={Target} />
              <StatTile label="Taxa de acerto" value={`${stats?.accuracyRate || 0}%`} icon={Star} />
            </div>

            <div style={{ marginTop: 24 }}>
              <SectionHeader title="Desempenho por disciplina" />
              {disciplines.length === 0 ? (
                <div style={{ textAlign: "center", padding: 20, color: theme.textSecondary, fontSize: 13 }}>
                  Nenhum progresso registrado ainda. Comece a estudar!
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {disciplines.map((d) => (
                    <Card key={d.id} padding={13}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                        <span style={{ color: theme.text, fontWeight: 500 }}>{d.name}</span>
                        <span style={{ color: theme.textSecondary }}>{d.progress || 0}%</span>
                      </div>
                      <ProgressBar value={d.progress || 0} height={5} />
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
