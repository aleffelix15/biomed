import React from "react";
import { theme } from "../../theme/tokens";

export default function EmptyState({ title, desc, icon: Icon }) {
  return (
    <div style={{ textAlign: "center", padding: "36px 20px", color: theme.textSecondary }}>
      <Icon size={26} color={theme.textSecondary} style={{ marginBottom: 10 }} />
      <div style={{ fontWeight: 600, color: theme.text, fontSize: 14 }}>{title}</div>
      <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{desc}</div>
    </div>
  );
}
