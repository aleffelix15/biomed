import React from "react";

export default function Card({ children, onClick, style, padding = 16, className = "" }) {
  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        background: "var(--theme-card)",
        border: `1px solid var(--theme-line)`,
        borderRadius: 20,
        padding,
        cursor: onClick ? "pointer" : "default",
        transition: "border-color 150ms ease, background 150ms ease, transform 150ms ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (onClick) {
           e.currentTarget.style.borderColor = "var(--theme-primary)";
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
           e.currentTarget.style.borderColor = "var(--theme-line)";
        }
      }}
    >
      {children}
    </div>
  );
}
