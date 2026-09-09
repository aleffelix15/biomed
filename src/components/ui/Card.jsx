import React from "react";
import { theme } from "../../theme/tokens";

export default function Card({ children, onClick, style, padding = 16 }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.line}`,
        borderRadius: 16,
        padding,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 120ms ease",
        ...style,
      }}
      onMouseEnter={(e) => onClick && (e.currentTarget.style.borderColor = theme.primary)}
      onMouseLeave={(e) => onClick && (e.currentTarget.style.borderColor = theme.line)}
    >
      {children}
    </div>
  );
}
