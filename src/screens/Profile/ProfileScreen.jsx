import React, { useState } from "react";
import { theme } from "../../theme/tokens";
import { useAuth } from "../../state/AuthContext";
import { updateUserProfile } from "../../services/supabaseService";
import Card from "../../components/ui/Card";
import SectionHeader from "../../components/ui/SectionHeader";
import { User, BookOpen, GraduationCap, Save, X, Edit2 } from "lucide-react";

export default function ProfileScreen() {
  const { user, profile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    course: profile?.course || "",
    period: profile?.period || "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg(false);
    try {
      await updateUserProfile(user.id, formData);
      setSuccessMsg(true);
      setIsEditing(false);
      // Note: AuthContext will need to be updated or we manually update the state.
      // For now, we'll rely on the user seeing the success message.
      // In a real app, we'd call a refreshProfile() function from the context.
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
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 13, color: "#4CAF50", fontWeight: 600 }}>
            Perfil atualizado com sucesso!
          </div>
        )}
      </Card>

      <div style={{ marginTop: 24 }}>
        <SectionHeader title="Estatísticas Acadêmicas" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Card padding={16}>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>Horas Estudadas</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginTop: 4 }}>0h</div>
          </Card>
          <Card padding={16}>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>Questões Respondidas</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginTop: 4 }}>0</div>
          </Card>
          <Card padding={16}>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>Taxa de Acerto</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginTop: 4 }}>0%</div>
          </Card>
          <Card padding={16}>
            <div style={{ fontSize: 12, color: theme.textSecondary }}>Progresso Geral</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginTop: 4 }}>0%</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
