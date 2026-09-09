import React from "react";
import { theme } from "../../theme/tokens";

const TONES = {
  teal: { bg: theme.surface, fg: theme.card },
  amber: { bg: theme.surface, fg: theme.primary },
  neutral: { bg: "#EEF2F1", fg: theme.textSecondary },
};

export default function Badge({ children, tone = "teal" }) {
  const t = TONES[tone];
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 999 }}>
      {children}
    </span>
  );
}
