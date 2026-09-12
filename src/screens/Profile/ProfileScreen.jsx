import React, { useState, useRef } from "react";
import { useAuth } from "../../state/AuthContext";
import { useAppTheme } from "../../state/ThemeContext";
import { fetchGlobalStats, uploadAvatar, updateUserProfile } from "../../services/supabaseService";
import { useCachedQuery } from "../../state/DataCacheContext";
import Card from "../../components/ui/Card";
import CircularProgress from "../../components/ui/CircularProgress";
import { User, Trophy, LogOut, ChevronRight, Camera, Flame, Loader2, Moon, Sun } from "lucide-react";
import EditProfileModal from "./EditProfileModal";

export default function ProfileScreen({ onOpenLeaderboard, onGoTab }) {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const { themeMode, toggleTheme } = useAppTheme();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const { data: statsData } = useCachedQuery(
    user ? 'stats:' + user.id : null, 
    () => fetchGlobalStats(user.id)
  );
  const stats = statsData || null;

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    try {
      setUploadingImage(true);
      const url = await uploadAvatar(user.id, file);
      await updateUserProfile(user.id, { avatar_url: url });
      await refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair?")) {
      await signOut();
    }
  };

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Estudante';
  const initial = userName.substring(0, 2).toUpperCase();
  const overallProgress = stats?.overallProgress || 0;
  const disciplinesCount = stats?.startedDisciplines || 0;
  const streak = stats?.streak || 0;

  return (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <User size={28} color="var(--theme-text)" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--theme-text)", margin: 0 }}>Perfil</h1>
      </div>

      {/* USER INFO */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(28, 230, 121, 0.2)", border: "2px solid var(--theme-primary)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", color: "var(--theme-primary)", fontSize: 24, fontWeight: 700 }}>
            {uploadingImage ? (
              <Loader2 size={24} color="var(--theme-primary)" style={{ animation: "spin 2s linear infinite" }} />
            ) : profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              initial
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{ position: "absolute", bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, background: "var(--theme-primary)", color: "#000", border: "2px solid var(--theme-bg)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}
          >
            <Camera size={14} />
          </button>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--theme-text)", marginBottom: 4 }}>{userName}</div>
          <div style={{ fontSize: 14, color: "var(--theme-text-secondary)" }}>{profile?.bio || "Estudante de Biomedicina"}</div>
          <button onClick={() => setIsEditingProfile(true)} style={{ background: "none", border: "none", color: "var(--theme-primary)", fontSize: 12, fontWeight: 600, padding: 0, marginTop: 8, cursor: "pointer" }}>Editar perfil</button>
        </div>
      </div>

      {/* STATS ROW */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        <Card padding={16} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress value={overallProgress} size={50} strokeWidth={5} />
          <div style={{ fontSize: 12, color: "var(--theme-text)", marginTop: 8, textAlign: "center", lineHeight: 1.2 }}>Progresso<br/>geral</div>
        </Card>
        
        <Card padding={16} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 32, fontWeight: 700, color: "var(--theme-text)", lineHeight: 1 }}>{disciplinesCount}</div>
          <div style={{ fontSize: 12, color: "var(--theme-text)", marginTop: 8, textAlign: "center", lineHeight: 1.2 }}>Disciplinas<br/>em andamento</div>
        </Card>
        
        <Card padding={16} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <Flame size={32} color="#ff4757" fill="#ff4757" style={{ marginBottom: 4 }} />
          <div style={{ fontSize: 24, fontWeight: 700, color: "var(--theme-text)", lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: 12, color: "var(--theme-text)", marginTop: 4, textAlign: "center", lineHeight: 1.2 }}>Dias de<br/>sequência</div>
        </Card>
      </div>

      {/* MENU */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* "Meu plano de estudos" → navega para Disciplinas, que é o ponto de entrada real
            para ver/acessar os planos de estudo de cada tópico.
            Decisão: opção (a) — entrega rápida, sem forçar StudyPlanScreen sem contexto. */}
        <MenuItem icon={User} label="Meu plano de estudos" onClick={() => onGoTab && onGoTab("disciplines")} />

        {/* Ranking: funcionalidade real via LeaderboardScreen */}
        <MenuItem icon={Trophy} label="Ranking" onClick={() => onOpenLeaderboard && onOpenLeaderboard()} />

        {/* Tema dark/light toggle — funcionalidade real que já existia */}
        <MenuItem 
          icon={themeMode === "dark" ? Moon : Sun} 
          label={`Tema: ${themeMode === "dark" ? "Escuro" : "Claro"}`} 
          onClick={toggleTheme} 
        />

        <div style={{ height: 1, background: "var(--theme-line)", margin: "8px 0" }} />
        
        <MenuItem icon={LogOut} label="Sair" onClick={handleLogout} color="var(--theme-danger)" />
      </div>

      {isEditingProfile && (
        <EditProfileModal 
          profile={profile}
          onClose={() => setIsEditingProfile(false)} 
          onSave={async (data) => {
            if (!user) return;
            await updateUserProfile(user.id, data);
            await refreshProfile();
            setIsEditingProfile(false);
          }} 
        />
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick, color = "var(--theme-text)" }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        display: "flex", alignItems: "center", justifyContent: "space-between", 
        background: "var(--theme-surface)", border: "1px solid var(--theme-line)", 
        borderRadius: 16, padding: "16px 20px", cursor: "pointer", transition: "all 0.2s ease",
        width: "100%"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Icon size={20} color={color} />
        <span style={{ fontSize: 15, fontWeight: 600, color }}>{label}</span>
      </div>
      <ChevronRight size={18} color="var(--theme-muted)" />
    </button>
  );
}
