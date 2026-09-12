# BIOSTUDY — MASTER UPGRADE SPECIFICATION

===============================================================
## 1. AUDITORIA ATUAL
===============================================================

**Estado Geral:**
O BioStudy superou a fase de protótipo. O banco Supabase foi conectado e problemas críticos (como RLS, tipos de IDs incompatíveis entre UUID e slugs textuais) foram recentemente resolvidos. A performance inicial melhorou drasticamente com a adoção de code splitting real e metadados JSON gerados (`topics-index.json`). 

**Arquitetura:**
- Frontend: React + Vite.
- Estado Global: Gerenciado via Context API (`AuthContext`, `DataCacheContext`) e um hook isolado para rotas (`useAppNavigation`), o que respeita a regra de **não persistir navegação**.
- Backend/DB: Supabase (PostgreSQL).
- Conteúdo: Armazenado majoritariamente em arquivos locais (`.json`), agindo como single source of truth para a árvore de disciplinas.

**Achados Positivos:**
- O roteamento via `useAppNavigation` já força o estado inicial para "home", cumprindo perfeitamente a regra de FASE 3.
- Existe cache em memória (`DataCacheContext`) evitando sobrecarga no Supabase.
- A árvore local de disciplinas reflete fielmente o banco (IDs foram migrados para slugs).
- Os quizzes do laboratório estão funcionais e a interface responde.

**Deficiências e Áreas de Risco:**
- **Estudar (Engine):** Os 4 modos de estudo atuais ainda são básicos. Faltam algoritmos de repetição espaçada (Spaced Repetition) reais nos Flashcards.
- **Resultados:** O relatório final de simulados não quebra o desempenho por tópico/dificuldade.
- **Home:** É apenas um painel rudimentar com saudação e as "próximas" disciplinas. Não funciona como um hub inteligente ("O que devo fazer hoje?").
- **Offline/PWA:** Ausente. O cache atual é apenas de estado (SWR-like), sem Service Worker para boot offline ou fila de sincronização de respostas (Offline Mutation Queue).
- **Conteúdo das Aulas:** Ainda é muito linear. Faltam objetivos claros, resumos e mini-quizzes integrados ao fluxo de leitura.
- **Acessibilidade:** Contrastes e navegação por teclado não foram plenamente validados.

===============================================================
## 2. MAPA DE FUNCIONALIDADES
===============================================================

| FUNCIONALIDADE | EXISTE? | FUNCIONA? | QUALIDADE | PROBLEMA | UPGRADE |
|---|---|---|---|---|---|
| HOME | Sim | Sim | Básica | Muito passiva; não direciona o estudo do dia. | Home 2.0 |
| DISCIPLINAS | Sim | Sim | Boa | Faltam filtros avançados e distinção visual clara. | Disciplinas 2.0 |
| TÓPICOS/AULAS | Sim | Sim | Básica | Fluxo linear de texto. Falta interatividade. | Experiência de Aula |
| QUESTÕES | Sim | Sim | Média | Histórico de erros subutilizado; falta feedback profundo. | Questões e Resultados |
| FLASHCARDS | Sim | Sim | Básica | Não usa Repetição Espaçada (Spaced Repetition) real. | Flashcards e Revisão |
| SIMULADOS/PROVA | Sim | Sim | Básica | Relatório final pobre. Modo prova não bloqueia saídas acidentais. | Simulados/Prova |
| LABORATÓRIO | Sim | Sim | Boa | Casos clínicos incipientes. Falta imersão. | Laboratório 2.0 |
| BIBLIOTECA | Sim | Parcial | Mock/Básica | Provavelmente usa dados falsos ou estáticos insuficientes. | Biblioteca |
| PERFIL | Sim | Sim | Básica | Não mostra painel acadêmico detalhado (streak, XP). | Perfil e Progresso |
| PLANO DE ESTUDOS | Não | - | - | Inexistente. | Plano de Estudos |
| RANKING (Gamificação)| Sim | Parcial | Básica | Não há economia de XP/Metas sólidas estruturadas no banco. | Gamificação |
| IA | Parcial | Parcial | Básica | Risco de gerar "alucinações" que substituem o conteúdo. | IA Complementar |
| AUTENTICAÇÃO | Sim | Sim | Alta | Estável via Supabase. | QA Final |

===============================================================
## 3. PROBLEMAS P0 / P1 / P2 / P3
===============================================================

- **[P0] Integridade de Flashcards:** Sem SR (Spaced Repetition) real, o usuário revisará o mesmo card eternamente ou nunca mais.
- **[P1] Home não acionável:** O usuário entra no app e precisa procurar o que fazer.
- **[P1] Feedback de Simulados:** Apenas acertar/errar não guia o aprendizado. Faltam recomendações (Ex: "Revise Glicólise").
- **[P2] Estrutura da Aula:** Textos longos reduzem retenção.
- **[P3] Offline / PWA:** Queda de internet perde a sessão de estudo em andamento.

===============================================================
## 4. ARQUITETURA RECOMENDADA
===============================================================

- **Persistência & Boot:** `useAppNavigation` deve continuar definindo `tab="home"` como estado inicial absoluto (na ausência de Deep Links). Dados acadêmicos vivem no Supabase e fluem pelo `DataCacheContext`.
- **Spaced Repetition System (SRS):** Adicionar campos `ease_factor`, `interval`, `next_review_date`, `repetitions` na tabela `user_flashcard_progress` baseados no algoritmo SM-2 ou SuperMemo modificado.
- **Fila de Sincronização (Sync Queue):** Implementar um Service Worker (Workbox) e IndexedDB local. Quando offline, respostas e progresso vão para o IndexedDB. Ao voltar online, o app processa o queue silenciosamente para o Supabase.
- **Conteúdo Estruturado:** Modificar o renderizador de Markdown/Conteúdo para injetar automaticamente um `<MiniQuiz />` antes de marcar a aula como concluída.

===============================================================
## 5. ROADMAP COMPLETO
===============================================================

*Nota: A ordem prioriza a fundação (Banco, Navegação), passa pelo core value (Aulas, Estudo), expande para retenção (Home, Gamificação, Plano) e termina em polimento técnico (Offline, A11y).*

- **UPGRADE 00 — Estabilidade e Integridade do Banco** (Auditar FKs, Constraints e Types).
- **UPGRADE 01 — Navegação e Inicialização** (Reforçar estado isolado da Home e Loading states unificados).
- **UPGRADE 02 — Repetição Espaçada (SRS)** (Lógica algorítmica para Flashcards no frontend e banco).
- **UPGRADE 03 — Flashcards 2.0** (UX de revisão: Não sei, Difícil, Fácil, Dominei usando o SRS).
- **UPGRADE 04 — Questões e Resultado Educacional** (Insights detalhados: pontos fracos e recomendações).
- **UPGRADE 05 — Simulados e Modo Prova** (Timer confiável, bloqueios de saída e geração inteligente de testes).
- **UPGRADE 06 — Experiência das Aulas** (Fluxo: Conteúdo → Aplicação → Resumo → Mini-Quiz).
- **UPGRADE 07 — Disciplinas 2.0** (Filtros: Em andamento, Não iniciadas. UI de progresso aprimorada).
- **UPGRADE 08 — Home 2.0** (Painel "Plano de Hoje", "Revisões Pendentes", "Continuar").
- **UPGRADE 09 — Laboratório 2.0** (Expandir imersão visual, Casos Clínicos integrados ao fluxo de estudo).
- **UPGRADE 10 — Biblioteca** (Conexão com API real ou estruturação profunda de links úteis).
- **UPGRADE 11 — Plano de Estudos** (Gestão de metas: Hoje, Esta Semana).
- **UPGRADE 12 — Gamificação** (XP, Metas, Streak Real, Níveis na tabela de profile).
- **UPGRADE 13 — Perfil Acadêmico** (Gráficos de desempenho, hitórico).
- **UPGRADE 14 — IA Complementar** (Contexto restrito ao conteúdo local, gerador de revisões curtas).
- **UPGRADE 15 — Qualidade do Conteúdo e Visuais** (Design System para diagramas, exclusão de imagens inúteis).
- **UPGRADE 16 — Performance Mobile** (Touch targets > 44px, safe areas insets).
- **UPGRADE 17 — Offline / PWA** (Service Workers, IndexedDB Sync Queue).
- **UPGRADE 18 — Acessibilidade** (ARIA tags, navegação por teclado, contrastes).
- **UPGRADE 19 — QA Final e Testes Automatizados**.

===============================================================
## 6. DEPENDÊNCIAS ENTRE UPGRADES
===============================================================
- UPGRADE 03 (Flashcards UI) exige UPGRADE 02 (SRS).
- UPGRADE 04 (Resultados) deve vir antes do UPGRADE 05 (Simulados), pois o simulado usa a tela de resultados.
- UPGRADE 08 (Home) deve vir depois do UPGRADE 02 e 04, pois a Home vai puxar "Revisões Pendentes" (SRS) e "Pontos Fracos" (Resultados).
- UPGRADE 12 (Gamificação) precede UPGRADE 13 (Perfil), pois o perfil exibirá o XP/Streak.

===============================================================
## 7. CRITÉRIOS DE ACEITE GERAIS (Para o Antigravity)
===============================================================
- **Obrigatório buildar sem erros** (`npm run build`). Se falhar, consertar antes de prosseguir.
- **Sem falsos positivos:** Não silenciar avisos de lint ou build; resolver a causa.
- **Nenhum arquivo órfão:** Código antigo substituído deve ser deletado se inútil.
- **Banco intacto:** Sem DROPs não documentados, preserve histórico do usuário.
- **Mutações seguras:** Sempre usar UUID ou SLUG corretamente alinhados.

===============================================================
## PROMPTS PARA O ANTIGRAVITY (COPIAR UM DE CADA VEZ)
===============================================================

---
### PROMPT DO UPGRADE 00 — ESTABILIDADE E INTEGRIDADE
```text
# UPGRADE 00 — Estabilidade e Integridade do Banco

OBJETIVO: Garantir que o schema do Supabase está perfeito antes de avançarmos. Validar FKs, on delete cascades, e tipos de dados sem perder histórico do usuário.

CONTEXTO: Recentemente migramos a tabela `disciplines` de UUID para slugs textuais. Precisamos garantir que todas as tabelas adjacentes (`user_progress`, `lesson_completions`, `user_flashcard_progress`, etc.) possuam as restrições de Foreign Key corretas e suporte a `ON DELETE CASCADE` para não gerar dados órfãos se alterarmos o conteúdo local.

ARQUIVOS ENVOLVIDOS:
- `supabase/schema.sql` (apenas leitura para entender estrutura ideal)
- `scratch/check_schema_integrity.js` (a ser criado por você)

BANCO ENVOLVIDO: Sim.

RESTRIÇÕES:
- NÃO delete nenhum dado do banco de produção.
- Faça alterações estruturais via nova migration SQL em `supabase/migrations/` e execute via `supabase db push`.

TESTES:
- Rodar script verificador que tenta apagar um dado dummy e atesta se o cascade funcionou.
- `npm run build` ao final.

CRITÉRIOS DE ACEITE:
- Nenhuma FK quebrada. Nenhuma linha órfã. Relatório claro gerado com o status do banco.
```

---
### PROMPT DO UPGRADE 01 — NAVEGAÇÃO E INICIALIZAÇÃO
```text
# UPGRADE 01 — Navegação e Inicialização

OBJETIVO: Garantir arquiteturalmente que o app SEMPRE abre na Home, mas preserva os dados acadêmicos com segurança de tipagem.

CONTEXTO: `useAppNavigation` já inicia em `tab: "home"`. Precisamos garantir que não haja vazamentos onde o usuário possa dar reload no navegador e cair em um estado quebrado dentro de uma tela de `StudyScreen` ou `QuizScreen` sem os parâmetros corretos. Além disso, unificar a tela de Loading do App inteiro usando uma UI amigável e não apenas um texto solto.

ARQUIVOS ENVOLVIDOS:
- `src/state/useAppNavigation.js`
- `src/app/App.jsx`
- Componente novo: `src/components/ui/FullPageLoader.jsx`

RESTRIÇÕES:
- O estado de navegação atual NUNCA deve ir para `localStorage`.

CRITÉRIOS DE ACEITE:
- Novo componente visual de Loading sendo usado no App e no Auth.
- Ao dar refresh numa aba, o usuário é re-autenticado e cai diretamente na Home, sem telas brancas.
- Build ok.
```

---
### PROMPT DO UPGRADE 02 — REPETIÇÃO ESPAÇADA (SRS)
```text
# UPGRADE 02 — Repetição Espaçada (SRS)

OBJETIVO: Preparar o banco de dados e os serviços de frontend para o algoritmo de repetição espaçada de flashcards.

CONTEXTO: Precisamos criar ou atualizar a tabela/view de flashcards do usuário (`user_flashcard_progress`) para armazenar `interval` (número), `ease_factor` (número, padrão 2.5), `next_review_date` (timestamp) e `repetitions` (número). Isso implementará a base do algoritmo SM-2.

ARQUIVOS ENVOLVIDOS:
- `supabase/migrations/[TIMESTAMP]_add_srs_fields.sql`
- `src/services/supabaseService.js`

BANCO ENVOLVIDO: Sim. Atualização de Schema via Migration.

RESTRIÇÕES:
- NÃO perca o histórico atual (`status` antigo). Faça um mapa inteligente (ex: se o usuário já havia acertado, set interval = 1).

TESTES:
- Criar a migration, rodar `supabase db push`.
- Adicionar função em `supabaseService.js` chamada `updateFlashcardSRS(userId, flashcardId, quality)`.

CRITÉRIOS DE ACEITE:
- Tabela de progresso de flashcards agora entende datas de próxima revisão.
- A função de atualização calcula corretamente a próxima data usando SM-2 básico.
```

---
### PROMPT DO UPGRADE 03 — FLASHCARDS 2.0
```text
# UPGRADE 03 — Flashcards 2.0

OBJETIVO: Refatorar a UI de Flashcards para consumir o motor SRS (Spaced Repetition System) criado no Upgrade 02.

CONTEXTO: O usuário deve ter 4 botões ao virar um flashcard: "Não sei" (Again), "Difícil" (Hard), "Bom" (Good), "Fácil" (Easy). O botão escolhido ditará o novo intervalo que será salvo no Supabase usando a função do UPGRADE 02.

ARQUIVOS ENVOLVIDOS:
- `src/components/study/FlashcardEngine.jsx`
- `src/screens/Study/StudyScreen.jsx`

BANCO ENVOLVIDO: Não. Apenas consumo de API local (`supabaseService`).

RESTRIÇÕES:
- Mantenha animações fluídas ao virar o card.
- Apenas mostre os 4 botões APÓS a resposta ser revelada.

TESTES:
- Simular estudo de 3 cards locais. Confirmar no banco se `next_review_date` foi alterado.

CRITÉRIOS DE ACEITE:
- UI clara e botões coloridos refletindo a dificuldade.
- Flashcards que já venceram a data de `next_review_date` aparecem primeiro na fila.
```

---
### PROMPT DO UPGRADE 04 — QUESTÕES E RESULTADO EDUCACIONAL
```text
# UPGRADE 04 — Questões e Resultado Educacional

OBJETIVO: Mostrar insights (pontos fortes, fracos e recomendações) após uma sessão de questões, simulado ou prova.

CONTEXTO: Hoje os resultados mostram apenas a nota. Precisamos ler o payload de respostas do usuário, agrupar por `topic_id`, ver onde o percentual foi baixo, e gerar recomendações automáticas (Ex: "Revisar aula X").

ARQUIVOS ENVOLVIDOS:
- `src/components/study/StudyResult.jsx` (ou novo componente para Resultados)
- `src/components/study/QuestionEngine.jsx`

RESTRIÇÕES:
- Não use IA externa para isso ainda; faça estatística local básica (agrupar array de erros).

TESTES:
- Finalizar um quiz curto errando de propósito 2 questões de um tópico e acertando 2 de outro.

CRITÉRIOS DE ACEITE:
- Tela de resultado mostra "Tópicos a Revisar" e "Pontos Fortes".
```

---
### PROMPT DO UPGRADE 05 — SIMULADOS E MODO PROVA
```text
# UPGRADE 05 — Simulados e Modo Prova

OBJETIVO: Aperfeiçoar as regras e imersão do Simulado e do Modo Prova.

CONTEXTO: O Modo Prova exige concentração rigorosa. Precisamos de um Timer visual persistente na UI, modal de confirmação "Deseja mesmo sair? Sua nota será 0" se o usuário tentar voltar, e indicação clara de quais questões foram puladas na navegação.

ARQUIVOS ENVOLVIDOS:
- `src/components/study/ExamEngine.jsx`
- `src/components/study/StudyTimer.jsx` (Aprimorar)

RESTRIÇÕES:
- O modo prova deve embaralhar alternativas aleatoriamente (se já não fizer).

CRITÉRIOS DE ACEITE:
- Navegação entre questões permite pular e ver painel lateral/inferior de "Questões Pendentes".
- Timer não zera se re-renderizar a tela (manter no context ou state superior).
```

---
### PROMPT DO UPGRADE 06 — EXPERIÊNCIA DAS AULAS
```text
# UPGRADE 06 — Experiência das AULAS

OBJETIVO: Quebrar o fluxo monótono de leitura adicionando estruturação e um Mini-Quiz integrado ao fluxo da Lesson.

CONTEXTO: Uma aula hoje é renderizada como Markdown de ponta a ponta. Precisamos processar o JSON/Markdown para que a leitura inclua seções como "Objetivos", "Resumo", e principalmente: um Mini-Quiz no rodapé da página (ou modal no fim do scroll) que DEVE ser respondido antes do botão "Concluir Aula" ficar verde.

ARQUIVOS ENVOLVIDOS:
- `src/screens/Lesson/LessonScreen.jsx`
- `src/components/domain/MarkdownRenderer.jsx` (se existir)

RESTRIÇÕES:
- O conteúdo local (`topic.json`) não deve ser reescrito aos milhares. Injete a lógica lendo as `questions.json` correspondentes ao tópico da aula para sortear 1-2 questões automáticas para o Mini-Quiz.

CRITÉRIOS DE ACEITE:
- Botão de Concluir bloqueado até interagir com o mini-quiz.
```

---
### PROMPT DO UPGRADE 07 — DISCIPLINAS 2.0
```text
# UPGRADE 07 — Disciplinas 2.0

OBJETIVO: Adicionar filtros úteis ("Em andamento", "Não iniciadas", "Concluídas") e melhorar a navegação interna.

CONTEXTO: A lista de disciplinas pode ficar muito grande. Adicione pill-buttons no topo de `DisciplinesScreen` para filtrar os cards. O card deve mostrar a data do "Último conteúdo acessado" (se houver histórico).

ARQUIVOS ENVOLVIDOS:
- `src/screens/Disciplines/DisciplinesScreen.jsx`
- `src/components/domain/DisciplineCard.jsx`

RESTRIÇÕES:
- A barra de pesquisa de texto existente deve funcionar em conjunto com os filtros (AND lógico).

CRITÉRIOS DE ACEITE:
- Filtros funcionais, design minimalista (pills do tipo iOS/Material 3).
- UI responde imediatamente por ser state local.
```

---
### PROMPT DO UPGRADE 08 — HOME 2.0
```text
# UPGRADE 08 — Home 2.0

OBJETIVO: Transformar a Home no coração do app, respondendo: "O que preciso fazer agora?".

CONTEXTO: A Home deve ler os dados do banco para criar as seções "Revisões Pendentes" (baseado nos flashcards atrasados do UPGRADE 02), "Plano de Hoje" (Aulas em andamento) e "Seu Progresso" (gráfico circular/linha simples).

ARQUIVOS ENVOLVIDOS:
- `src/screens/Home/HomeScreen.jsx`
- `src/services/supabaseService.js` (novas queries)

RESTRIÇÕES:
- Muito cuidado para não travar a Home com 5 requests lentos ao banco. Use Promise.all ou carregamento progressivo.

CRITÉRIOS DE ACEITE:
- Se houver flashcards atrasados, um Card especial de Alerta aparece "Você tem X revisões pendentes".
- Clicar nas ações redireciona o usuário perfeitamente para a engine de estudo ou aula.
```

---
### PROMPT DO UPGRADE 09 — LABORATÓRIO 2.0
```text
# UPGRADE 09 — Laboratório 2.0

OBJETIVO: Conectar a imersão educacional ao módulo laboratorial.

CONTEXTO: O LabScreen e LabDetail já estão bons, mas faltam filtros por Categoria visualmente bonitos no topo (Bioquímica, Urinálise, Biossegurança, etc.) e um atalho ligando a Interpretação de Exames com as aulas correspondentes.

ARQUIVOS ENVOLVIDOS:
- `src/screens/Lab/LabScreen.jsx`
- `src/content/laboratory/labData.js`

RESTRIÇÕES:
- Não insira imagens gigantes, utilize ícones Lucide consistentes para categorização.

CRITÉRIOS DE ACEITE:
- Botões de categoria na tela do lab que filtram os itens listados sem delay.
```

---
### PROMPT DO UPGRADE 10 — BIBLIOTECA E MATERIAIS EXTRAS
```text
# UPGRADE 10 — Biblioteca

OBJETIVO: Limpar dados estáticos falsos da biblioteca (se existirem) e usar links reais ou recomendações verídicas de material extra.

CONTEXTO: A Biblioteca deve agir como um HUB de referências bibliográficas reais da Biomedicina e PDFs/Guidelines de Domínio Público (ex: Manuais da ANVISA, Manuais do Ministério da Saúde).

ARQUIVOS ENVOLVIDOS:
- `src/screens/Library/LibraryScreen.jsx`
- `src/content/library/libraryData.json` (ou `.js`)

RESTRIÇÕES:
- Não crie links piratas nem PDFs locais protegidos por direitos autorais. Liste títulos clássicos com link para compra/pesquisa.

CRITÉRIOS DE ACEITE:
- Busca e categorização de guias úteis e oficiais da área.
```

---
### PROMPT DO UPGRADE 11 — PLANO DE ESTUDOS
```text
# UPGRADE 11 — Plano de Estudos

OBJETIVO: Permitir ao usuário marcar um Tópico/Aula como "Estudar Esta Semana".

CONTEXTO: Criar tabela no Supabase `study_plans` com relacionamento ao `user_id` e `topic_id`. Na tela da disciplina, o usuário pode clicar num ícone de Calendário/Target para adicionar o tópico ao seu plano. A Home 2.0 deve puxar isso.

ARQUIVOS ENVOLVIDOS:
- `supabase/migrations/[TIMESTAMP]_create_study_plans.sql`
- `src/screens/StudyPlan/StudyPlanScreen.jsx` (ou aba na Home)

BANCO ENVOLVIDO: Sim.

CRITÉRIOS DE ACEITE:
- Usuário consegue adicionar e remover um tópico do plano. Tópicos concluídos saem do plano automaticamente.
```

---
### PROMPT DO UPGRADE 12 — GAMIFICAÇÃO
```text
# UPGRADE 12 — Gamificação (XP e Metas)

OBJETIVO: Adicionar economia de XP real. 1 Aula lida = 50 XP. 1 Questão correta = 10 XP. 1 Revisão de Flashcard = 5 XP.

CONTEXTO: Hoje o app pode ter progresso em %, mas XP gera retenção. Adicione a coluna `xp_total` e `current_streak` na tabela `user_profiles` (se não existir). Atualizar esses valores no backend ao salvar `user_progress` e `question_attempts`.

ARQUIVOS ENVOLVIDOS:
- `src/services/supabaseService.js`

RESTRIÇÕES:
- O cálculo e a soma do XP devem acontecer de forma atômica no banco (RPC ou Triggers) se possível, para evitar race conditions no frontend.

CRITÉRIOS DE ACEITE:
- Ao terminar um quiz, a UI deve subir um brinde/toast "Você ganhou +50 XP!".
```

---
### PROMPT DO UPGRADE 13 — PERFIL E PROGRESSO
```text
# UPGRADE 13 — Perfil Acadêmico

OBJETIVO: Renovar a ProfileScreen para ser o painel de conquistas.

CONTEXTO: Exibir Nível (Calculado baseado no XP Total, ex: Nível 1 = 0 XP, Nível 2 = 1000 XP), Streak atual em chamas (Fire Icon), Gráfico de calor de estudo (GitHub-style contribution graph) se for viável usando bibliotecas simples ou blocos de divs.

ARQUIVOS ENVOLVIDOS:
- `src/screens/Profile/ProfileScreen.jsx`

RESTRIÇÕES:
- Design limpo e profissional, não parecendo um jogo infantil.

CRITÉRIOS DE ACEITE:
- Nível exibido corretamente, atualizando reativamente.
```

---
### PROMPT DO UPGRADE 14 — IA COMPLEMENTAR
```text
# UPGRADE 14 — IA Complementar (AiAssistant)

OBJETIVO: Transformar o AiAssistant em um tutor especializado sem "alucinar" conteúdos que substituem o próprio app.

CONTEXTO: O assistente deve receber na sua variável de System Prompt o contexto *específico* de que é o "BioStudy Tutor", devendo explicar os porquês das alternativas erradas caso o usuário peça, e evitar dar respostas diretas prontas de provas.

ARQUIVOS ENVOLVIDOS:
- `src/components/domain/AiAssistant.jsx`

RESTRIÇÕES:
- IA deve atuar como modalidade de tira-dúvidas (overlay/fab button), acessível nas telas de questões.

CRITÉRIOS DE ACEITE:
- AiAssistant responde focado em análises clínicas / biomedicina.
```

---
### PROMPT DO UPGRADE 15 — QUALIDADE DE CONTEÚDO
```text
# UPGRADE 15 — Qualidade do Conteúdo e Visuais

OBJETIVO: Auditar o markdown para suportar blocos bonitos (Callouts de Cuidado, Dica, Importante).

CONTEXTO: Usar o plugin Remark/Rehype para renderizar blocos estilo GitHub (ex: `> [!WARNING]`). Atualizar o `MarkdownRenderer` no React para estilizar isso de acordo com o Design System.

ARQUIVOS ENVOLVIDOS:
- `src/components/domain/MarkdownRenderer.jsx`
- package.json (se precisar add remark-gfm ou similares)

CRITÉRIOS DE ACEITE:
- Blocos de alerta aparecem com ícones e cores temáticas.
```

---
### PROMPT DO UPGRADE 16 — PERFORMANCE MOBILE
```text
# UPGRADE 16 — Performance Mobile

OBJETIVO: Garantir que todo o UI/UX esteja otimizado para o toque.

CONTEXTO: Padding e Margin de botões de alternativas em simulados devem ter mínimo de 44px de altura. As safe-areas (entalhe do iPhone) devem ser configuradas via CSS (`env(safe-area-inset-top)`).

ARQUIVOS ENVOLVIDOS:
- `src/theme/GlobalStyles.js` ou `.css`
- Componentes de layout base.

RESTRIÇÕES:
- Testar visualmente a BottomTabBar em telas que simulam iPhone Notch.

CRITÉRIOS DE ACEITE:
- Interface responsiva com áreas de toque anatômicas e teclado que não quebra layout.
```

---
### PROMPT DO UPGRADE 17 — OFFLINE / PWA
```text
# UPGRADE 17 — Offline / PWA

OBJETIVO: Prover acesso offline parcial via Service Workers e Manifesto de instalação.

CONTEXTO: Configurar o `vite-plugin-pwa`. Adicionar capacidade de "Install App" na Home ou Profile. Fazer cache de `index.html`, assets CSS/JS e da rota de `topic-index.json`.

ARQUIVOS ENVOLVIDOS:
- `vite.config.js`
- `package.json`

RESTRIÇÕES:
- Não tente cachear o banco Supabase inteiro. Somente leitura de dados locais do Vite e estado de progresso persistido localmente se estiver sem rede.

CRITÉRIOS DE ACEITE:
- App pode ser adicionado à Tela Inicial do smartphone.
```

---
### PROMPT DO UPGRADE 18 — ACESSIBILIDADE
```text
# UPGRADE 18 — Acessibilidade

OBJETIVO: Garantir que o app atenda padrões a11y.

CONTEXTO: Adicionar `aria-labels` em botões de ícone (Back, Close, AiAssistant), checar contrastes de cor e focar na navegação por teclado (focus-visible).

ARQUIVOS ENVOLVIDOS:
- Diversos componentes de UI (buttons, inputs, modais).

CRITÉRIOS DE ACEITE:
- Navegação inteiramente possível usando `Tab` no teclado em modo Desktop.
```

---
### PROMPT DO UPGRADE 19 — QA FINAL
```text
# UPGRADE 19 — QA Final e Testes

OBJETIVO: Realizar o lockdown de código.

CONTEXTO: O Antigravity deve simular a rotina de um estudante de ponta a ponta: Cadastro -> Entra na Home -> Clica na Aula -> Lê -> Resolve Mini Quiz -> Abre Simulado -> Envia Resposta -> Vê pontuação e Recomendações -> Sai do App. Validar logs e ausência de memory leaks ou bugs que corrompam esse caminho.

ARQUIVOS ENVOLVIDOS:
- Revisão final em todo projeto.

CRITÉRIOS DE ACEITE:
- Terminal limpo, build impecável, `npm run lint` ou equivalente rodando sem alertas P0. App maduro, escalável e pronto para mercado.
```

