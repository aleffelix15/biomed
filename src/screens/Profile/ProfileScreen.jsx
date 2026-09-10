import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { useAuth } from "../../state/AuthContext";
import { updateUserProfile, fetchGlobalStats } from "../../services/supabaseService";
import Card from "../../components/ui/Card";
import SectionHeader from "../../components/ui/SectionHeader";
import { User, BookOpen, GraduationCap, Save, X, Edit2, LogOut, Clock, Target, Star, TrendingUp } from "lucide-react";

export default function ProfileScreen({ onOpenLeaderboard }) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    course: profile?.course || "",
    period: profile?.period || "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setStatsLoading(true);
      fetchGlobalStats(user.id).then(data => {
        setStats(data);
        setStatsLoading(false);
      }).catch(() => setStatsLoading(false));
    }
  }, [user]);

  // Sync form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        course: profile.course || "",
        period: profile.period || "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg(false);
    try {
      await updateUserProfile(user.id, formData);
      if (refreshProfile) await refreshProfile();
      setSuccessMsg(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || "",
      course: profile?.course || "",
      period: profile?.period || "",
    });
    setIsEditing(false);
  };

  const formatHours = (val) => {
    if (!val && val !== 0) return "0h";
    const h = Math.floor(val / 3600);
    const m = Math.floor((val % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Meu Perfil</h1>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 24, marginBottom: 24 }}>
        <div style={{ width: 100, height: 100, borderRadius: 50, background: theme.surface, border: `2px solid ${theme.primary}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <User size={48} color={theme.primary} />
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <button
          onClick={isEditing ? handleCancel : () => setIsEditing(true)}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.primary, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >
          {isEditing ? <><X size={16} /> Cancelar</> : <><Edit2 size={16} /> Editar Perfil</>}
        </button>
      </div>

      <Card padding={20} style={{ background: theme.card, border: "none" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Nome */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>Nome Completo</label>
            {isEditing ? (
              <input
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
                style={{ padding: 12, borderRadius: 8, border: `1px solid ${theme.line}`, background: theme.surface, color: theme.text }}
              />
            ) : (
              <div style={{ fontSize: 16, color: theme.text, fontWeight: 500 }}>{profile?.full_name || "Não informado"}</div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>E-mail</label>
            <div style={{ fontSize: 16, color: theme.text, fontWeight: 500 }}>{user?.email}</div>
          </div>

          {/* Curso */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>Curso</label>
            {isEditing ? (
              <input
                value={formData.course}
                onChange={e => setFormData({...formData, course: e.target.value})}
                style={{ padding: 12, borderRadius: 8, border: `1px solid ${theme.line}`, background: theme.surface, color: theme.text }}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: theme.text, fontWeight: 500 }}>
                <BookOpen size={16} color={theme.primary} /> {profile?.course || "Não informado"}
              </div>
            )}
          </div>

          {/* Período */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>Período</label>
            {isEditing ? (
              <input
                value={formData.period}
                onChange={e => setFormData({...formData, period: e.target.value})}
                style={{ padding: 12, borderRadius: 8, border: `1px solid ${theme.line}`, background: theme.surface, color: theme.text }}
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 16, color: theme.text, fontWeight: 500 }}>
                <GraduationCap size={16} color={theme.primary} /> {profile?.period || "Não informado"}
              </div>
            )}
          </div>

        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            disabled={loading}
            style={{ width: "100%", marginTop: 24, padding: 14, borderRadius: 12, background: theme.primary, color: theme.bg, border: "none", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Salvando..." : <><Save size={18} /> Salvar Alterações</>}
          </button>
        )}

        {successMsg && (
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: theme.primary, fontWeight: 600 }}>
            Perfil atualizado com sucesso!
          </div>
        )}
      </Card>

      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Estatísticas Acadêmicas" />
        {statsLoading ? (
          <div style={{ textAlign: "center", padding: 20, color: theme.textSecondary, fontSize: 13 }}>Carregando estatísticas...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Card padding={16}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Clock size={14} color={theme.primary} />
                <span style={{ fontSize: 12, color: theme.textSecondary }}>Horas Estudadas</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{formatHours(stats?.totalStudySeconds || 0)}</div>
            </Card>
            <Card padding={16}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Target size={14} color={theme.primary} />
                <span style={{ fontSize: 12, color: theme.textSecondary }}>Questões Respondidas</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{stats?.totalQuestions || 0}</div>
            </Card>
            <Card padding={16}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Star size={14} color={theme.primary} />
                <span style={{ fontSize: 12, color: theme.textSecondary }}>Taxa de Acerto</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{stats?.accuracyRate || 0}%</div>
            </Card>
            <Card padding={16}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <TrendingUp size={14} color={theme.primary} />
                <span style={{ fontSize: 12, color: theme.textSecondary }}>Sequência</span>
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{stats?.currentStreak || 0} dias</div>
            </Card>
          </div>
        )}
      </div>

      {/* Botão Ranking */}
      <button
        onClick={onOpenLeaderboard}
        style={{
          width: "100%",
          marginBottom: 12,
          padding: 14,
          borderRadius: 12,
          background: theme.surface,
          color: theme.text,
          border: `1px solid ${theme.line}`,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <Trophy size={18} color={theme.primary} /> Ver Ranking Global
      </button>

      {/* Botão de Logout */}
      <button
        onClick={signOut}
        style={{
          width: "100%",
          marginTop: 0,
          padding: 14,
          borderRadius: 12,
          background: "transparent",
          color: theme.danger,
          border: `1px solid ${theme.danger}`,
          fontWeight: 700,
          fontSize: 15,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <LogOut size={18} /> Sair da Conta
      </button>
    </div>
  );
}
