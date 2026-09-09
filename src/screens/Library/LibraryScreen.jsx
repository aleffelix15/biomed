import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import { fetchDisciplinesWithProgress, fetchAllBooks } from "../../services/supabaseService";
import { useAuth } from "../../state/AuthContext";
import BookCard from "../../components/domain/BookCard";
import { Search } from "lucide-react";

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

export default function LibraryScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("todos");
  const [search, setSearch] = useState("");
  const [allBooks, setAllBooks] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [booksData, discsData] = await Promise.all([
          fetchAllBooks(),
          fetchDisciplinesWithProgress(user?.id)
        ]);
        setAllBooks(booksData || []);
        setDisciplines(discsData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  const filtered = allBooks.filter((b) => {
    const matchFilter = filter === "todos" || b.disciplineId === filter;
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
          filtered.map((b) => <BookCard key={b.id} book={b} onClick={() => alert("Abrindo " + b.title)} />)
        )}
      </div>
    </div>
  );
}
