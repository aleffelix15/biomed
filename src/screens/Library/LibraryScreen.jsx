import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchFavoriteBooks, toggleFavoriteBook } from "../../services/supabaseService";
import { fetchAllBooks } from "../../services/bookService";
import { useAuth } from "../../state/AuthContext";
import BookCard from "../../components/domain/BookCard";
import { Search, Heart } from "lucide-react";

const filterBtnStyle = (active) => ({
  padding: "7px 13px",
  borderRadius: 999,
  border: `1px solid ${active ? theme.primary : theme.line}`,
  background: active ? theme.primary : theme.surface,
  color: active ? "#fff" : theme.textSecondary,
  fontSize: 12.5,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
  flexShrink: 0,
});

export default function LibraryScreen({ onOpenBook }) {
  const { user } = useAuth();
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [booksData, discsData, favsData] = await Promise.all([
        fetchAllBooks(),
        fetchDisciplinesWithProgress(user?.id),
        user ? fetchFavoriteBooks(user.id) : Promise.resolve([])
      ]);
      setAllBooks(booksData || []);
      setDisciplines(discsData || []);
      setFavorites(favsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleToggleFavorite = async (book) => {
    if (!user) return;
    const isFav = favorites.some(f => f.work_key === book.id);
    
    // update optimistic UI
    if (isFav) {
      setFavorites(prev => prev.filter(f => f.work_key !== book.id));
    } else {
      setFavorites(prev => [...prev, { work_key: book.id, title: book.title, author: book.author }]);
    }
    
    // save to backend
    await toggleFavoriteBook(user.id, { work_key: book.id, title: book.title, author: book.author });
  };

  const filtered = allBooks.filter((b) => {
    const isFav = favorites.some(f => f.work_key === b.id);
    const matchFilter = filter === "todos" || b.disciplineId === filter || (filter === "favoritos" && isFav);
    const matchSearch = search.trim() === "" || 
                        b.title.toLowerCase().includes(search.toLowerCase()) || 
                        (b.author && b.author.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Biblioteca</h1>

      <div style={{ position: "relative", marginTop: 16 }}>
        <Search size={16} color={theme.textSecondary} style={{ position: "absolute", left: 14, top: 12 }} />
        <input 
          type="text" 
          placeholder="Buscar título ou autor..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "12px 16px 12px 40px", borderRadius: 12, background: theme.surface, border: `1px solid ${theme.line}`, color: theme.text, outline: "none" }}
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 16, overflowX: "auto" }} className="bs-scroll">
        <button onClick={() => setFilter("todos")} style={filterBtnStyle(filter === "todos")}>Todos</button>
        <button onClick={() => setFilter("favoritos")} style={filterBtnStyle(filter === "favoritos")}>
           Favoritos
        </button>
        {disciplines.map((d) => (
          <button key={d.id} onClick={() => setFilter(d.id)} style={filterBtnStyle(filter === d.id)}>{d.name}</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Carregando livros...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: theme.textSecondary, fontSize: 14 }}>Nenhum livro encontrado.</div>
        ) : (
          filtered.map((b) => {
            const isFav = favorites.some(f => f.work_key === b.id);
            return (
              <BookCard 
                key={b.id} 
                book={b} 
                isFavorite={isFav}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => onOpenBook(b)}
              />
            )
          })
        )}
      </div>
    </div>
  );
}
