import React, { useState, useEffect } from "react";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { ChevronRight, ChevronLeft, Search, FlaskConical, CheckCircle } from "lucide-react";
import { labCategories, labItems } from "../../content/laboratory/labData";
import LabDetailView from "./LabDetailView";
import { useAuth } from "../../state/AuthContext";
import { fetchLabProgress, fetchFavoriteItems } from "../../services/supabaseService";

export default function LabScreen() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [progressData, setProgressData] = useState({});
  const [favoritesData, setFavoritesData] = useState({});

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const [prog, favs] = await Promise.all([
        fetchLabProgress(user.id),
        fetchFavoriteItems(user.id)
      ]);

      const pMap = {};
      (prog || []).forEach(p => pMap[p.item_id] = p.completed);
      setProgressData(pMap);

      const fMap = {};
      (favs || []).forEach(f => fMap[f.item_id] = true);
      setFavoritesData(fMap);
    } catch (err) {
      console.error("Erro ao carregar dados do lab:", err);
    }
  };

  const handleUpdateStatus = (itemId, completed, favorited) => {
    setProgressData(prev => ({ ...prev, [itemId]: completed }));
    setFavoritesData(prev => ({ ...prev, [itemId]: favorited }));
  };

  const filteredItems = labItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory ? item.categoryId === selectedCategory.id : true;
    return matchesSearch && matchesCategory;
  });

  // Item detail view
  if (selectedItem) {
    return (
      <LabDetailView
        item={selectedItem}
        onBack={() => setSelectedItem(null)}
        initialCompleted={!!progressData[selectedItem.id]}
        initialFavorited={!!favoritesData[selectedItem.id]}
        onUpdateStatus={handleUpdateStatus}
      />
    );
  }

  return (
    <div style={{ padding: "16px 16px 100px", maxWidth: 600, margin: "0 auto" }}>
      {!selectedCategory ? (
        <>
          {/* HEADER */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <FlaskConical size={28} color="var(--theme-text)" />
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--theme-text)", margin: 0 }}>Laboratório</h1>
          </div>
          <p style={{ color: "var(--theme-text-secondary)", fontSize: 14, margin: "0 0 20px", lineHeight: 1.4 }}>
            Técnicas, equipamentos e exames que fazem a diferença na rotina do biomédico.
          </p>

          {/* SEARCH */}
          <div style={{ position: "relative", marginBottom: 24 }}>
            <div style={{ position: "absolute", left: 16, top: 0, bottom: 0, display: "flex", alignItems: "center", pointerEvents: "none" }}>
              <Search size={18} color="var(--theme-muted)" />
            </div>
            <input
              type="text"
              placeholder="Buscar equipamento, técnica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                height: 48,
                background: "var(--theme-surface)",
                border: "1px solid var(--theme-line)",
                borderRadius: 16,
                padding: "0 16px 0 44px",
                color: "var(--theme-text)",
                fontSize: 15,
                outline: "none"
              }}
            />
          </div>

          {searchQuery ? (
            /* SEARCH RESULTS */
            <div>
              <h3 style={{ color: "var(--theme-text)", fontSize: 15, fontWeight: 600, margin: "0 0 12px" }}>
                Resultados da busca
              </h3>
              {filteredItems.length === 0 ? (
                <EmptyState icon={Search} title="Nenhum item encontrado" desc="Tente buscar por outro termo." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {filteredItems.map(item => (
                    <LabItemCard
                      key={item.id}
                      item={item}
                      completed={progressData[item.id]}
                      onClick={() => setSelectedItem(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* CATEGORY GRID */
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {labCategories.map((c) => {
                const count = labItems.filter(i => i.categoryId === c.id).length;
                return (
                  <Card
                    key={c.id}
                    padding={20}
                    onClick={() => setSelectedCategory(c)}
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--theme-text)" }}>{c.title}</div>
                    <div style={{ fontSize: 12, color: "var(--theme-text-secondary)", lineHeight: 1.4 }}>{c.desc}</div>
                    <div style={{ fontSize: 12, color: "var(--theme-primary)", fontWeight: 600, marginTop: 4 }}>
                      {count} {count === 1 ? "item" : "itens"}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* CATEGORY DETAIL */
        <>
          <button
            onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
            style={{ background: "none", border: "none", color: "var(--theme-text)", display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 20 }}
          >
            <ChevronLeft size={20} /> Laboratório
          </button>

          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--theme-text)", margin: "0 0 4px" }}>
            {selectedCategory.title}
          </h2>
          <p style={{ color: "var(--theme-text-secondary)", fontSize: 14, margin: "0 0 20px", lineHeight: 1.4 }}>
            {selectedCategory.desc}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filteredItems.length === 0 ? (
              <EmptyState icon={FlaskConical} title="Conteúdo em breve" desc="Estamos preparando os itens para esta categoria." />
            ) : (
              filteredItems.map(item => (
                <LabItemCard
                  key={item.id}
                  item={item}
                  completed={progressData[item.id]}
                  onClick={() => setSelectedItem(item)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

function LabItemCard({ item, completed, onClick }) {
  return (
    <Card padding={16} onClick={onClick}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 15, color: "var(--theme-text)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</span>
            {completed && <CheckCircle size={14} color="var(--theme-primary)" style={{ flexShrink: 0 }} />}
          </div>
          <div style={{ fontSize: 13, color: "var(--theme-text-secondary)", marginTop: 4 }}>
            {item.description.length > 60 ? item.description.substring(0, 60) + "..." : item.description}
          </div>
          {item.tags && item.tags.length > 0 && (
            <div style={{ fontSize: 12, color: "var(--theme-primary)", marginTop: 6, fontWeight: 600 }}>
              {item.tags[0]}
            </div>
          )}
        </div>
        <ChevronRight size={18} color="var(--theme-muted)" style={{ flexShrink: 0, marginLeft: 12 }} />
      </div>
    </Card>
  );
}
