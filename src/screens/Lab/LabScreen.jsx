import React, { useState, useEffect } from "react";
import { theme } from "../../theme/tokens";
import Card from "../../components/ui/Card";
import { ChevronRight, ChevronLeft, Search, Beaker, CheckCircle } from "lucide-react";
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
    const [prog, favs] = await Promise.all([
      fetchLabProgress(user.id),
      fetchFavoriteItems(user.id)
    ]);
    
    const pMap = {};
    prog.forEach(p => pMap[p.item_id] = p.completed);
    setProgressData(pMap);

    const fMap = {};
    favs.forEach(f => fMap[f.item_id] = true);
    setFavoritesData(fMap);
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
    <div style={{ padding: "20px 16px 90px" }}>
      {!selectedCategory ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Beaker size={20} color={theme.bg} />
            </div>
            <h1 className="bs-display" style={{ fontSize: 24, fontWeight: 800, color: theme.text, margin: 0 }}>Laboratório</h1>
          </div>
          
          <p style={{ color: theme.textSecondary, fontSize: 14, margin: "0 0 20px" }}>
            Técnicas, equipamentos e exames que fazem a diferença na rotina do biomédico.
          </p>

          <div style={{ position: 'relative', marginBottom: 24 }}>
            <Search size={18} color={theme.textSecondary} style={{ position: 'absolute', left: 16, top: 14 }} />
            <input 
              type="text"
              placeholder="Buscar equipamento, técnica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '14px 16px 14px 44px',
                background: theme.surface, border: `1px solid ${theme.line}`,
                borderRadius: 12, color: theme.text, fontSize: 15
              }}
            />
          </div>

          {searchQuery ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <h3 style={{ color: theme.text, fontSize: 15, fontWeight: 600, margin: '0 0 8px' }}>Resultados da busca</h3>
              {filteredItems.length === 0 ? (
                <p style={{ color: theme.textSecondary, fontSize: 14 }}>Nenhum item encontrado.</p>
              ) : (
                filteredItems.map(item => (
                  <Card key={item.id} padding={16} onClick={() => setSelectedItem(item)} style={{ cursor: "pointer" }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 15, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {item.title}
                          {progressData[item.id] && <CheckCircle size={14} color={theme.primary} />}
                        </div>
                        <div style={{ fontSize: 12, color: theme.primary, marginTop: 4 }}>{item.tags[0]}</div>
                      </div>
                      <ChevronRight size={18} color={theme.textSecondary} />
                    </div>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {labCategories.map((c) => (
                <Card key={c.id} padding={16} onClick={() => setSelectedCategory(c)} style={{ cursor: "pointer", display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{c.title}</div>
                </Card>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <button 
            onClick={() => setSelectedCategory(null)} 
            style={{ background: "none", border: "none", color: theme.textSecondary, display: "flex", alignItems: "center", gap: 6, fontSize: 14, cursor: "pointer", padding: 0, marginBottom: 20 }}
          >
            <ChevronLeft size={18} /> Voltar
          </button>

          <h2 style={{ fontSize: 20, fontWeight: 800, color: theme.text, margin: '0 0 8px' }}>{selectedCategory.title}</h2>
          <p style={{ color: theme.textSecondary, fontSize: 14, margin: '0 0 20px' }}>{selectedCategory.desc}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredItems.length === 0 ? (
              <Card padding={20} style={{ textAlign: 'center', background: 'transparent' }}>
                <p style={{ color: theme.textSecondary, margin: 0, fontSize: 14 }}>Conteúdo em breve.</p>
              </Card>
            ) : (
              filteredItems.map(item => (
                <Card key={item.id} padding={16} onClick={() => setSelectedItem(item)} style={{ cursor: "pointer" }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: theme.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {item.title}
                        {progressData[item.id] && <CheckCircle size={14} color={theme.primary} />}
                      </div>
                      <div style={{ fontSize: 13, color: theme.textSecondary, marginTop: 4 }}>{item.description.substring(0, 50)}...</div>
                    </div>
                    <ChevronRight size={18} color={theme.textSecondary} />
                  </div>
                </Card>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
