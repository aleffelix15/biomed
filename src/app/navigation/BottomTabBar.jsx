import React from "react";
import { theme } from "../../theme/tokens";
import { TABS } from "./tabs";

export default function BottomTabBar({ active, onChange }) {
  return (
    <div className="bottom-nav">
      {TABS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="bottom-nav-item"
          >
            <t.icon size={19} color={isActive ? theme.primary : theme.textSecondary} strokeWidth={isActive ? 2.4 : 2} />
            <span style={{ fontSize: 10.5, color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? 600 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
