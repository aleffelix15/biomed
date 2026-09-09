import React, { useState } from "react";
import { theme } from "../../theme/tokens";
import { BOOKS } from "../../data/mock/books";
import { DISCIPLINES } from "../../data/mock/disciplines";
import BookCard from "../../components/domain/BookCard";

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
  const [filter, setFilter] = useState("todos");
  const disciplinesWithBooks = [...new Set(BOOKS.map((b) => b.disciplineId))];
  const filtered = filter === "todos" ? BOOKS : BOOKS.filter((b) => b.disciplineId === filter);

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <h1 className="bs-display" style={{ fontSize: 22, fontWeight: 700, color: theme.text, margin: 0 }}>Biblioteca</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto" }} className="bs-scroll">
        <button onClick={() => setFilter("todos")} style={filterBtnStyle(filter === "todos")}>Todos</button>
        {disciplinesWithBooks.map((id) => {
          const d = DISCIPLINES.find((x) => x.id === id);
          return <button key={id} onClick={() => setFilter(id)} style={filterBtnStyle(filter === id)}>{d.name}</button>;
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
        {filtered.map((b) => <BookCard key={b.id} book={b} />)}
      </div>
    </div>
  );
}
