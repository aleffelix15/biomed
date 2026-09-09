import React from "react";
import { theme } from "../../theme/tokens";

export default function ProgressBar({ value, tint = theme.primary, track = theme.surface, height = 6 }) {
  return (
    <div style={{ width: "100%", height, borderRadius: height, background: track, overflow: "hidden" }}>
      <div style={{ width: `${value}%`, height: "100%", borderRadius: height, background: tint, transition: "width 300ms ease" }} />
    </div>
  );
}
