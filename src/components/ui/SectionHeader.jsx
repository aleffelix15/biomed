import React from "react";
import { theme } from "../../theme/tokens";

export default function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
      <h2 className="bs-display" style={{ fontSize: 17, fontWeight: 600, color: theme.text, margin: 0 }}>{title}</h2>
      {action && (
        <button onClick={onAction} style={{ background: "none", border: "none", color: theme.primary, fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}>
          {action}
        </button>
      )}
    </div>
  );
}
