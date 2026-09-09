import React from "react";
import { theme } from "../../theme/tokens";

const TONES = {
  teal: { bg: `${theme.primary}22`, fg: theme.primary },
  amber: { bg: `${theme.primary}22`, fg: "#F59E0B" },
  neutral: { bg: theme.surface, fg: theme.textSecondary },
  danger: { bg: `${theme.danger}22`, fg: theme.danger },
};

export default function Badge({ children, tone = "teal" }) {
  const t = TONES[tone] || TONES.teal;
  return (
    <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 999 }}>
      {children}
    </span>
  );
}
