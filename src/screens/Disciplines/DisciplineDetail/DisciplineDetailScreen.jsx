import React from "react";
import { theme } from "../../../theme/tokens";
import { TOPICS, genericTopics } from "../../../data/mock/topics";
import { BOOKS } from "../../../data/mock/books";
import Card from "../../../components/ui/Card";
import ProgressBar from "../../../components/ui/ProgressBar";
import SectionHeader from "../../../components/ui/SectionHeader";
import Badge from "../../../components/ui/Badge";
import EmptyState from "../../../components/ui/EmptyState";
import BookCard from "../../../components/domain/BookCard";
import { ChevronLeft, Library } from "lucide-react";

const STATUS_LABEL = { concluido: "Concluído", "em-andamento": "Em andamento", pendente: "Pendente" };
const STATUS_TONE = { concluido: "teal", "em-andamento": "amber", pendente: "neutral" };

export default function DisciplineDetailScreen({ discipline, onBack }) {
  const topics = TOPICS[discipline.id] || genericTopics(discipline.topicsCount);
  const books = BOOKS.filter((b) => b.disciplineId === discipline.id);

  return (
    <div style={{ padding: "20px 16px 90px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: theme.textSecondary, fontSize: 13, cursor: "pointer", padding: 0, marginBottom: 16 }}>
        <ChevronLeft size={16} /> Disciplinas
      </button>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 46, height: 46, borderRadius: 12, background: theme.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <discipline.icon size={22} color={theme.primary} />
        </div>
        <div>
          <h1 className="bs-display" style={{ fontSize: 20, fontWeight: 700, color: theme.text, margin: 0 }}>{discipline.name}</h1>
          <div style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{discipline.category}</div>
        </div>
      </div>

      <Card style={{ marginTop: 18 }} padding={16}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: theme.textSecondary }}>
          <span>Progresso</span><span style={{ color: theme.text, fontWeight: 600 }}>{discipline.progress}%</span>
        </div>
        <div style={{ marginTop: 8 }}><ProgressBar value={discipline.progress} /></div>
      </Card>

      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5, margin: 0 }}>
          O estudo fundamental da forma e estrutura do corpo humano. Explore sistemas vitais, órgãos, e suas inter-relações em nível macro e microscópico para entender o funcionamento clínico.
        </p>
      </div>

      <button style={{ width: "100%", marginTop: 16, background: theme.primary, color: theme.bg, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        Iniciar estudo
      </button>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Módulos" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {topics.map((t) => (
            <Card key={t.id} padding={12}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: theme.text }}>{t.title}</span>
                <Badge tone={STATUS_TONE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionHeader title="Biblioteca recomendada" />
        {books.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {books.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        ) : (
          <EmptyState icon={Library} title="Ainda sem livros cadastrados" desc="Esta disciplina receberá indicações bibliográficas em breve." />
        )}
      </div>
    </div>
  );
}
