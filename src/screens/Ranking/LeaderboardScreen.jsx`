import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Trophy, Medal, ChevronLeft, User } from "lucide-react";
import { fetchLeaderboard } from "../../services/supabaseService";

export default function LeaderboardScreen({ onBack }) {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRankings() {
      try {
        const data = await fetchLeaderboard();
        setRankings(data);
      } catch (err) {
        console.error("Error loading leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    loadRankings();
  }, []);

  return (
    <div style={{ padding: "20px 16px 90px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}
        >
          <ChevronLeft size={20} /> Voltar
        </button>
        <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Ranking Global</h1>
      </div>

      <div style={{
        background: theme.primary,
        color: theme.bg,
        padding: "32px 20px",
        borderRadius: 24,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
      }}>
        <Trophy size={48} />
        <div style={{ fontSize: 18, fontWeight: 700 }}>Top Estudantes</div>
        <div style={{ fontSize: 14, opacity: 0.9 }}>Pontue respondendo questões corretamente!</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Carregando ranking...</div>
        ) : rankings.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Nenhum estudante ranqueado ainda.</div>
        ) : (
          rankings.map((user, index) => (
            <Card
              key={user.id}
              padding={16}
              style={{
                background: index === 0 ? theme.card : theme.surface,
                border: index === 0 ? `2px solid ${theme.primary}` : `1px solid ${theme.line}`,
                display: "flex",
                alignItems: "center",
                gap: 16
              }}
            >
              <div style={{
                width: 32,
                textAlign: "center",
                fontWeight: 800,
                fontSize: 16,
                color: index === 0 ? theme.primary : theme.textSecondary
              }}>
                {index + 1}º
              </div>

              <div style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                background: theme.surface,
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: `1px solid ${theme.line}`
              }}>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={20} color={theme.textSecondary} />
                )}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: theme.text, fontSize: 15 }}>{user.full_name || "Estudante"}</div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 700, color: theme.primary, fontSize: 16 }}>{user.total_points || 0} pts</div>
                <div style={{ fontSize: 10, color: theme.textSecondary, fontWeight: 600, textTransform: "uppercase" }}>Pontos</div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
