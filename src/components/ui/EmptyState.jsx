import React from "react";

export default function EmptyState({ title, desc, icon: Icon, action, actionLabel }) {
  return (
    <div style={{ textAlign: "center", padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 32, background: "var(--theme-surface)", border: "1px solid var(--theme-line)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        {Icon && <Icon size={28} color="var(--theme-muted)" />}
      </div>
      <div style={{ fontWeight: 600, color: "var(--theme-text)", fontSize: 16, marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 14, color: "var(--theme-text-secondary)", lineHeight: 1.5, maxWidth: 280 }}>{desc}</div>
      {action && (
        <button 
          onClick={action}
          style={{ 
            marginTop: 20, 
            padding: "10px 24px", 
            background: "var(--theme-primary)", 
            color: "#000", 
            borderRadius: 24, 
            fontWeight: 600, 
            fontSize: 14 
          }}
        >
          {actionLabel || "Tentar novamente"}
        </button>
      )}
    </div>
  );
}
