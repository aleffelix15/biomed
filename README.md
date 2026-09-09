# BioStudy — Fundação do MVP

App de estudos para estudantes de Biomedicina. Este pacote contém a **base**
do projeto: navegação, design system, telas principais e dados mock —
conforme escopo definido para esta primeira etapa (sem IA, sem backend,
sem pagamento).

## Rodando o projeto

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Estrutura de pastas

```
src/
├── app/
│   ├── App.jsx                 # composição raiz + roteamento de telas
│   └── navigation/
│       ├── BottomTabBar.jsx
│       └── tabs.js
├── screens/                    # uma pasta por tela
│   ├── Home/
│   ├── Disciplines/
│   │   └── DisciplineDetail/
│   ├── Study/
│   ├── Lab/
│   ├── Library/
│   └── Progress/
├── components/
│   ├── ui/                     # Card, Badge, ProgressBar, SectionHeader...
│   └── domain/                 # DisciplineCard, BookCard
├── data/
│   ├── mock/                   # disciplines, books, topics, studyModes...
│   └── models/                 # formato dos dados (JSDoc typedefs)
├── services/                   # mockService.js — hoje simula uma API
├── state/                      # useAppNavigation.js — estado de navegação
├── theme/                      # tokens.js (cores/tipografia) + GlobalStyles
└── utils/
```

## Princípios da arquitetura

- **Telas não sabem de onde vêm os dados.** Elas recebem props ou chamam
  `services/`. Trocar o mock por uma API real não deve exigir tocar em UI.
- **Componentes de `ui/` são cegos ao domínio** (não sabem o que é uma
  "disciplina"); componentes de `domain/` combinam `ui/` com os modelos do
  BioStudy.
- **Navegação centralizada** em `state/useAppNavigation.js`, para que trocar
  por React Router / React Navigation no futuro seja uma mudança localizada.
- **Tokens de design em um único lugar** (`theme/tokens.js`) — cor, tipografia
  e espaçamento não estão espalhados pelos componentes.

## Próximos passos (fora do escopo deste MVP)

1. Conteúdo real por disciplina, com fontes acadêmicas confiáveis
2. Estudar: flashcards, questões e revisão espaçada funcionais
3. Laboratório: casos práticos interativos
4. Persistência real de progresso
5. Autenticação e backend
6. Tutor de IA
# biomed
