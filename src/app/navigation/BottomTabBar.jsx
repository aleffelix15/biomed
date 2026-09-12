import React from "react";
import { theme } from "../../theme/tokens";
import { TABS } from "./tabs";

export default function BottomTabBar({ active, onChange }) {
  return (
    <div className="bottom-nav">
      <div className="bottom-nav-inner">
        {TABS.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className="bottom-nav-item"
              style={{
                position: 'relative'
              }}
            >
              <t.icon 
                size={22} 
                color={isActive ? 'var(--theme-primary)' : 'var(--theme-muted)'} 
                strokeWidth={isActive ? 2.5 : 2} 
              />
              <span 
                style={{ 
                  fontSize: 11, 
                  marginTop: 2,
                  color: isActive ? 'var(--theme-primary)' : 'var(--theme-muted)', 
                  fontWeight: isActive ? 600 : 500 
                }}
              >
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
