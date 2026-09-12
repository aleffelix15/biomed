import React from "react";
import { theme } from "../../theme/tokens";

export default function CircularProgress({ value, size = 80, strokeWidth = 8, tint = 'var(--theme-primary)', track = 'var(--theme-line)' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          stroke={track}
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke={tint}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset: offset, transition: "stroke-dashoffset 0.5s ease" }}
          strokeLinecap="round"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div style={{ position: "absolute", fontSize: size * 0.28, fontWeight: 700, color: "var(--theme-text)" }}>
        {value}%
      </div>
    </div>
  );
}

