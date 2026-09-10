import React, { useState } from "react";
import { theme } from "../../theme/tokens";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { X, BookOpen, ExternalLink, Heart } from "lucide-react";
import { toggleFavoriteBook } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";

export default function BookDetailScreen({ book, onBack }) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false); // Simplified for now, should be passed as prop

  const handleToggleFavorite = async () => {
    if (!user) return;
    try {
      await toggleFavoriteBook(user.id, {
        work_key: book.id,
        title: book.title,
        author: book.author
      });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div style={{ padding: "20px 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", color: theme.textSecondary, cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 4 }}
        >
          <X size={20} /> Voltar
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div style={{ width: 160, height: 240, background: theme.surface, borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          {book.cover_url ? (
            <img src={book.cover_url} alt={book.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: theme.textSecondary, fontSize: 14, textAlign: "center", padding: 16 }}>
              Sem imagem disponível
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <h1 className="bs-display" style={{ fontSize: 24, fontWeight: 700, color: theme.text, marginBottom: 8 }}>{book.title}</h1>
          <div style={{ fontSize: 16, color: theme.primary, fontWeight: 600, marginBottom: 16 }}>{book.author}</div>

          <Card padding={20} style={{ background: theme.card, border: 'none', textAlign: 'left', lineHeight: 1.6, color: theme.textSecondary, fontSize: 14 }}>
            {book.description || "Nenhuma descrição disponível para este livro."}
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 300 }}>
          <button
            onClick={() => window.open(`https://openlibrary.org${book.work_key}`, '_blank')}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px", borderRadius: 12, background: theme.primary, color: theme.bg,
              border: "none", fontWeight: 700, cursor: "pointer", fontSize: 15
            }}
          >
            <ExternalLink size={18} /> Abrir no OpenLibrary
          </button>

          <button
            onClick={handleToggleFavorite}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px", borderRadius: 12, background: theme.surface, color: theme.text,
              border: `1px solid ${theme.line}`, fontWeight: 600, cursor: "pointer", fontSize: 15
            }}
          >
            <Heart size={18} color={isFavorite ? "#EF4444" : theme.textSecondary} fill={isFavorite ? "#EF4444" : "none"} />
            {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
          </button>
        </div>
      </div>
    </div>
  );
}
