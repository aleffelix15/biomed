import React, { useState, useRef, useEffect } from "react";
import { theme, alpha } from "../../theme/tokens";
import { useAuth } from "../../state/AuthContext";
import { useAppTheme } from "../../state/ThemeContext";
import { updateUserProfile, fetchGlobalStats, uploadAvatar } from "../../services/supabaseService";
import { useCachedQuery } from "../../state/DataCacheContext";
import { Moon, Sun, User, Camera, BookOpen, GraduationCap, Clock, Target, Star, TrendingUp, Trophy, LogOut, ChevronRight, Edit2, Mail, Lock, Settings, Bell, ChevronLeft, Loader2, Trash2 } from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import AuthSettingsModal from "./AuthSettingsModal";

export default function ProfileScreen({ onOpenLeaderboard }) {
  const { themeMode, toggleTheme } = useAppTheme();
  const { user, profile, signOut, refreshProfile, isOfflineMode, updateLocalProfile } = useAuth();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [authModalType, setAuthModalType] = useState(null); // 'email' | 'password' | null
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  
  const fileInputRef = useRef(null);

  const { data: statsData, loading: statsLoading } = useCachedQuery(
    user ? 'stats:' + user.id : null, 
    () => fetchGlobalStats(user.id)
  );
  const stats = statsData || null;

  const handleSaveProfile = async (formData) => {
    setIsSavingProfile(true);
    try {
      if (isOfflineMode) {
        updateLocalProfile(formData);
      } else {
        await updateUserProfile(user.id, formData);
        if (refreshProfile) await refreshProfile();
      }
      setIsEditingProfile(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Não foi possível salvar as alterações. Tente novamente.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageError("A imagem deve ter no máximo 5MB.");
      return;
    }

    setUploadingImage(true);
    setImageError('');

    try {
      if (isOfflineMode) {
        throw new Error("Não é possível alterar foto offline.");
      }
      
      const publicUrl = await uploadAvatar(user.id, file);
      
      await updateUserProfile(user.id, { avatar_url: publicUrl });
      if (refreshProfile) await refreshProfile();
      
    } catch (err) {
      console.error("Error uploading image:", err);
      setImageError("Erro ao enviar a imagem. Tente novamente.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm("Deseja realmente remover sua foto de perfil?")) return;
    
    setUploadingImage(true);
    setImageError('');
    try {
      await updateUserProfile(user.id, { avatar_url: null });
      if (refreshProfile) await refreshProfile();
    } catch (err) {
      console.error("Error removing image:", err);
      setImageError("Erro ao remover a imagem.");
    } finally {
      setUploadingImage(false);
    }
  };

  const formatHours = (val) => {
    if (!val && val !== 0) return "0h";
    const h = Math.floor(val / 3600);
    const m = Math.floor((val % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getHandle = () => {
    if (profile?.display_name) {
      return '@' + profile.display_name.toLowerCase().replace(/\s+/g, '');
    }
    if (user?.email) {
      return '@' + user.email.split('@')[0];
    }
    return '';
  };

  const MenuItem = ({ icon, title, subtitle, onClick, danger, value }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px', background: theme.card, border: 'none', borderBottom: `1px solid ${theme.line}`,
        cursor: 'pointer', textAlign: 'left'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ color: danger ? theme.danger : theme.textSecondary }}>{icon}</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: danger ? theme.danger : theme.text }}>{title}</span>
          {subtitle && <span style={{ fontSize: 13, color: theme.textSecondary }}>{subtitle}</span>}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {value && <span style={{ fontSize: 14, color: theme.textSecondary }}>{value}</span>}
        <ChevronRight size={18} color={theme.textSecondary} opacity={0.5} />
      </div>
    </button>
  );

  const SectionTitle = ({ title }) => (
    <div style={{ fontSize: 13, fontWeight: 700, color: theme.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, padding: '24px 16px 8px' }}>
      {title}
    </div>
  );

  return (
    <div style={{ paddingBottom: 90, background: theme.bg, minHeight: '100vh' }}>
      {/* App Header (simulated) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', position: 'sticky', top: 0, background: alpha(theme.bg, '90'), backdropFilter: 'blur(8px)', zIndex: 10 }}>
        <h1 className="bs-display" style={{ fontSize: 18, fontWeight: 700, color: theme.text, margin: 0 }}>Perfil</h1>
      </div>

      {/* Header Profile Area */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 16px 24px" }}>
        
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <div style={{ 
            width: 110, height: 110, borderRadius: 55, background: theme.surface, 
            border: `3px solid ${theme.primary}`, display: "flex", alignItems: "center", 
            justifyContent: "center", overflow: "hidden", position: 'relative'
          }}>
            {uploadingImage ? (
              <Loader2 size={32} color={theme.primary} style={{ animation: 'spin 2s linear infinite' }} />
            ) : profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <User size={48} color={theme.primary} />
            )}
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            style={{
              position: 'absolute', bottom: 0, right: 0, width: 36, height: 36, borderRadius: 18,
              background: theme.primary, border: `3px solid ${theme.bg}`, display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: theme.bg, cursor: 'pointer',
              padding: 0
            }}
          >
            <Camera size={18} />
          </button>
          
          {profile?.avatar_url && (
            <button 
              onClick={handleRemoveImage}
              disabled={uploadingImage}
              style={{
                position: 'absolute', bottom: 0, left: 0, width: 32, height: 32, borderRadius: 16,
                background: theme.card, border: `2px solid ${theme.bg}`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', color: theme.danger, cursor: 'pointer',
                padding: 0
              }}
            >
              <Trash2 size={14} />
            </button>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/jpeg,image/png,image/webp" 
            style={{ display: 'none' }} 
          />
        </div>

        {imageError && <div style={{ color: theme.danger, fontSize: 13, marginBottom: 12 }}>{imageError}</div>}

        <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.text, margin: '0 0 4px', textAlign: 'center' }}>
          {profile?.display_name || profile?.full_name || "Estudante"}
        </h2>
        <div style={{ fontSize: 15, color: theme.primary, fontWeight: 600, marginBottom: 12 }}>
          {getHandle()}
        </div>

        {(profile?.course || profile?.institution) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: theme.textSecondary, marginBottom: profile?.bio ? 12 : 0 }}>
            {profile.course && <span>{profile.course}</span>}
            {profile.course && profile.institution && <span>•</span>}
            {profile.institution && <span>{profile.institution}</span>}
          </div>
        )}
        
        {profile?.bio && (
          <div style={{ fontSize: 14, color: theme.text, textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>
            {profile.bio}
          </div>
        )}
      </div>

      {/* Sections */}
      <div style={{ background: theme.card, borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}` }}>
        <SectionTitle title="Minha Conta" />
        <MenuItem icon={<Edit2 size={20} />} title="Editar Perfil" onClick={() => setIsEditingProfile(true)} />
        <MenuItem icon={<Mail size={20} />} title="E-mail" value={user?.email} onClick={() => setAuthModalType('email')} />
        <MenuItem icon={<Lock size={20} />} title="Senha" onClick={() => setAuthModalType('password')} />
      </div>

      <div style={{ marginTop: 16, background: theme.card, borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}` }}>
        <SectionTitle title="Estudos & Progresso" />
        <div style={{ padding: '0 16px 16px' }}>
          {statsLoading ? (
            <div style={{ textAlign: "center", padding: 20, color: theme.textSecondary, fontSize: 13 }}>Carregando estatísticas...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div style={{ background: theme.surface, padding: 16, borderRadius: 12, border: `1px solid ${theme.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Clock size={14} color={theme.primary} />
                  <span style={{ fontSize: 12, color: theme.textSecondary }}>Horas Estudadas</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{formatHours(stats?.totalStudySeconds || 0)}</div>
              </div>
              <div style={{ background: theme.surface, padding: 16, borderRadius: 12, border: `1px solid ${theme.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Target size={14} color={theme.primary} />
                  <span style={{ fontSize: 12, color: theme.textSecondary }}>Questões (Corretas)</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{stats?.correctQuestions || 0} <span style={{fontSize: 14, color: theme.textSecondary, fontWeight: 500}}>de {stats?.totalQuestions || 0}</span></div>
              </div>
              <div style={{ background: theme.surface, padding: 16, borderRadius: 12, border: `1px solid ${theme.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <Star size={14} color={theme.primary} />
                  <span style={{ fontSize: 12, color: theme.textSecondary }}>Taxa de Acerto</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{stats?.accuracyRate || 0}%</div>
              </div>
              <div style={{ background: theme.surface, padding: 16, borderRadius: 12, border: `1px solid ${theme.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <TrendingUp size={14} color={theme.primary} />
                  <span style={{ fontSize: 12, color: theme.textSecondary }}>Sequência</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: theme.text }}>{stats?.streak || 0} dias</div>
              </div>
            </div>
          )}
          <button
            onClick={onOpenLeaderboard}
            style={{
              width: "100%", marginTop: 12, padding: 14, borderRadius: 12, background: theme.bg, color: theme.text,
              border: `1px solid ${theme.line}`, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Trophy size={18} color={theme.primary} /> Ver Ranking Global
          </button>
        </div>
      </div>

      <div style={{ marginTop: 16, background: theme.card, borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}` }}>
        <SectionTitle title="Preferências" />
        <MenuItem 
          icon={themeMode === 'light' ? <Sun size={20} /> : <Moon size={20} />} 
          title="Modo Escuro" 
          value={themeMode === 'dark' ? 'Ligado' : 'Desligado'}
          onClick={toggleTheme} 
        />
      </div>

      <div style={{ marginTop: 16, background: theme.card, borderTop: `1px solid ${theme.line}`, borderBottom: `1px solid ${theme.line}` }}>
        <SectionTitle title="Conta" />
        <MenuItem icon={<LogOut size={20} />} title="Sair da Conta" danger onClick={signOut} />
      </div>

      {isEditingProfile && (
        <EditProfileModal 
          profile={profile} 
          onClose={() => setIsEditingProfile(false)} 
          onSave={handleSaveProfile}
          loading={isSavingProfile}
        />
      )}

      {authModalType && (
        <AuthSettingsModal
          type={authModalType}
          user={user}
          onClose={() => setAuthModalType(null)}
        />
      )}

      {/* Global CSS for spinner */}
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
