import React from "react";
import { theme } from "../../theme/tokens";
import Card from "./Card";

export default function StatTile({ label, value, icon: Icon }) {
  return (
    <Card padding={14} style={{ flex: 1 }}>
      <Icon size={17} color={theme.primary} strokeWidth={2} />
      <div className="bs-display" style={{ fontSize: 20, fontWeight: 700, color: theme.text, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{label}</div>
    </Card>
  );
}
