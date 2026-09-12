import React, { useState } from "react";
import { useAuth } from "../../state/AuthContext";
import { useCachedQuery } from "../../state/DataCacheContext";
import { fetchDisciplinesWithProgress } from "../../services/supabaseService";
import { Bell, Search, BookOpenCheck, Layers, ClipboardList, FlaskConical, ChevronRight } from "lucide-react";
import Card from "../../components/ui/Card";
import CircularProgress from "../../components/ui/CircularProgress";
import { resolveIcon } from "../../utils/iconResolver";

export default function HomeScreen({ onOpenDiscipline, onGoTab }) {
  const { user, profile } = useAuth();
  
  const { data: discData, loading: loadingDisc } = useCachedQuery(
    user ? 'disciplines:' + user.id : null, 
    () => fetchDisciplinesWithProgress(user.id)
  );

  const disciplines = discData || [];
  const startedDisciplines = disciplines.filter(d => d.progress_percent > 0);
  const overall = disciplines.length ? Math.round(startedDisciplines.reduce((s, d) => s + (d.progress_percent || 0), 0) / disciplines.length) : 0;
  
  // Sort by recent/highest progress for the "Continue estudando" section
  const recent = [...startedDisciplines].sort((a, b) => b.progress_percent - a.progress_percent)[0];

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Estudante';
  const firstName = userName.split(' ')[0];

  return (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "var(--theme-text)", margin: "0 0 4px" }}>
            Olá, {firstName}! 👋
          </h1>
          <div style={{ fontSize: 14, color: "var(--theme-text-secondary)" }}>
            Disciplina hoje, foco no seu objetivo!
          </div>
        </div>
        <button style={{ width: 44, height: 44, borderRadius: 22, background: "var(--theme-surface)", border: "1px solid var(--theme-line)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--theme-text)" }}>
          <Bell size={20} />
        </button>
      </div>

      {/* SEARCH */}
      <div style={{ position: "relative", marginBottom: 24 }}>
        <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <Search size={18} color="var(--theme-muted)" />
        </div>
        <input 
          type="text" 
          placeholder="Buscar disciplina, tópico ou aula..." 
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

      {loadingDisc ? (
        <div style={{ padding: 40, textAlign: "center", color: "var(--theme-text-secondary)" }}>Carregando dados...</div>
      ) : (
        <>
          {/* PROGRESSO GERAL CARD */}
          <Card style={{ marginBottom: 24, position: "relative", overflow: "hidden", borderColor: "var(--theme-primary)" }} padding={20}>
            {/* Subtle glow effect */}
            <div style={{ position: "absolute", top: -50, left: -50, width: 150, height: 150, background: "var(--theme-primary)", filter: "blur(80px)", opacity: 0.1, pointerEvents: "none" }} />
            
            <div style={{ fontSize: 15, color: "var(--theme-text-secondary)", fontWeight: 600, marginBottom: 16 }}>
              Seu progresso geral
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <CircularProgress value={overall} size={86} strokeWidth={8} tint="var(--theme-primary)" track="var(--theme-line)" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--theme-text)", marginBottom: 4 }}>
                  {startedDisciplines.length} de {disciplines.length} disciplinas
                </div>
                <div style={{ fontSize: 13, color: "var(--theme-text-secondary)" }}>
                  Continue assim para bater sua meta semanal.
                </div>
              </div>
            </div>
          </Card>

          {/* SHORTCUTS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
            <ShortcutCard 
              icon={BookOpenCheck} title="Estudar" subtitle="Aulas e conteúdos" 
              color="var(--theme-primary)" bg="rgba(28, 230, 121, 0.12)" onClick={() => onGoTab("disciplines")} 
            />
            <ShortcutCard 
              icon={Layers} title="Flashcards" subtitle="Revisão inteligente" 
              color="var(--theme-accent-light)" bg="rgba(181, 134, 248, 0.12)" onClick={() => onGoTab("flashcards")} 
            />
            <ShortcutCard 
              icon={ClipboardList} title="Simulados" subtitle="Teste seus conhecimentos" 
              color="var(--theme-info)" bg="rgba(30, 144, 255, 0.12)" onClick={() => onGoTab("lab")} 
            />
            <ShortcutCard 
              icon={FlaskConical} title="Laboratório" subtitle="Prática e casos reais" 
              color="var(--theme-secondary)" bg="rgba(0, 210, 211, 0.12)" onClick={() => onGoTab("lab")} 
            />
          </div>

          {/* CONTINUE ESTUDANDO */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Continue estudando</h2>
            <button onClick={() => onGoTab("disciplines")} style={{ color: "var(--theme-primary)", fontSize: 14, fontWeight: 600 }}>Ver tudo</button>
          </div>

          {recent ? (
            <Card padding={16} onClick={() => onOpenDiscipline(recent)}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "var(--theme-line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(() => {
                    const Icon = resolveIcon(recent.icon);
                    return <Icon size={32} color="var(--theme-text)" />;
                  })()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--theme-text)", marginBottom: 4 }}>
                    {recent.name}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--theme-text-secondary)", marginBottom: 8 }}>
                    {recent.progress_percent}% concluído
                  </div>
                  <button style={{ background: "var(--theme-primary)", color: "#000", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 600, display: "inline-block" }}>
                    Continuar
                  </button>
                </div>
                <div style={{ width: 40, height: 40, borderRadius: 20, border: "1px solid var(--theme-line)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "var(--theme-text)" }}>{recent.progress_percent}%</span>
                </div>
              </div>
            </Card>
          ) : (
            <Card padding={20} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, color: "var(--theme-text)", fontWeight: 600, marginBottom: 8 }}>
                Nenhum estudo iniciado
              </div>
              <div style={{ fontSize: 13, color: "var(--theme-text-secondary)", marginBottom: 16 }}>
                Comece sua primeira aula acessando as disciplinas.
              </div>
              <button onClick={() => onGoTab("disciplines")} style={{ background: "var(--theme-primary)", color: "#000", border: "none", borderRadius: 12, padding: "10px 20px", fontSize: 14, fontWeight: 600 }}>
                Escolher disciplina
              </button>
            </Card>
          )}

        </>
      )}
    </div>
  );
}

function ShortcutCard({ icon: Icon, title, subtitle, color, bg, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{ 
        background: "var(--theme-surface)", 
        border: "1px solid var(--theme-line)", 
        borderRadius: 16, 
        padding: 16, 
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 12
      }}
    >
      <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--theme-text)", marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: "var(--theme-text-secondary)", lineHeight: 1.3 }}>{subtitle}</div>
      </div>
    </div>
  );
}
