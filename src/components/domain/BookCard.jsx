import React from "react";
import { theme } from "../../theme/tokens";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import { BookOpen, Heart } from "lucide-react";

export default function BookCard({ book, onClick, isFavorite, onToggleFavorite }) {
  const b = book;
  const disciplines = b.disciplines || ["Geral"];
  return (
    <Card padding={14} style={{ display: "flex", gap: 14, cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <div style={{ width: 72, height: 100, background: theme.surface, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {b.cover_url ? <img src={b.cover_url} alt={b.title} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8}} /> : <BookOpen size={24} color={theme.textSecondary} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{b.title}</div>
            <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{b.author} · {b.edition}</div>
          </div>
          {onToggleFavorite && (
            <button 
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(b); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <Heart size={18} fill={isFavorite ? theme.primary : 'none'} color={isFavorite ? theme.primary : theme.textSecondary} />
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
           <Badge tone="teal">{b.category || "Acadêmico"}</Badge>
           <Badge tone="neutral">{b.level}</Badge>
        </div>
        <p style={{ fontSize: 12, color: theme.textSecondary, marginTop: 8, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{b.description}</p>
        <div style={{ fontSize: 11, color: theme.primary, marginTop: 8, fontWeight: 600 }}>
          {disciplines.join(", ")}
        </div>
      </div>
    </Card>
  );
}
