import React from "react";
import { theme } from "../../theme/tokens";
import { TABS } from "./tabs";

export default function BottomTabBar({ active, onChange }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: theme.surface, borderTop: `1px solid ${theme.line}`, display: "flex", padding: "8px 4px 10px", zIndex: 10 }}>
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: 4 }}
          >
            <t.icon size={19} color={isActive ? theme.primary : theme.textSecondary} strokeWidth={isActive ? 2.4 : 2} />
            <span style={{ fontSize: 10.5, color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? 600 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
