# BUG AUDIT - BIOSTUDY (FASE 1)

## Resumo da Auditoria
O sistema apresenta uma ruptura crítica entre a arquitetura de conteúdo (JSON/Frontend) e o schema físico hospedado no Supabase. O banco de dados inverteu a hierarquia de `modules` e `topics`, o que causa falhas encadeadas no sync de conteúdo e nos carregamentos da UI. Além disso, há conflito entre colunas de UUID vs Text (slugs) em várias tabelas de progresso devido a migrações incompletas.

---

### BUG 001: Falha catastrófica de Sync (Inversão Hierárquica no Banco)
- **Severidade:** P0
- **Arquivo:** `scripts/syncToDB.js` / Supabase Schema
- **Causa:** O DB atual define que `modules` tem `discipline_id` e `topics` tem `module_id`. O código frontend e o JSON definem que `topics` tem `discipline_id` e `modules` tem `topic_id`. O syncToDB tenta inserir `discipline_id` em `topics`, resultando no erro do PostgREST schema cache.
- **Impacto:** Nenhum módulo, tópico, aula ou questão consegue ser salvo no banco. O conteúdo no banco fica permanentemente vazio ou obsoleto.
- **Correção Proposta:** Criar uma migration corretiva para realinhar a hierarquia do Supabase (`topics.discipline_id`, `modules.topic_id`, `lessons.module_id`) à realidade do código.
- **Risco:** Médio (Requer alteração estrutural no DB, mas o DB está atualmente com dados de sync zerados).
- **Status:** Planejado para Fase 2.

### BUG 002: Incompatibilidade de Schema da Tabela de Questões
- **Severidade:** P0
- **Arquivo:** `schema.sql`, `syncToDB.js` e Tabela Supabase `questions`
- **Causa:** O banco de dados real possui as colunas `content`, `options` (array) e `correct_option_index`. O frontend, o `schema.sql` local e os arquivos `.json` estruturam as questões com `question`, `option_a`, `option_b`, `option_c`, `option_d`, `option_e`, `correct_option` (char).
- **Impacto:** O sync e a execução de quizzes falham por mismatch de dados.
- **Correção Proposta:** Alterar a tabela `questions` no Supabase para corresponder exatamente ao schema JSON (`option_a`, etc.), que é o padrão utilizado pelo frontend de renderização de quiz.
- **Risco:** Baixo (Tabela atual está vazia ou disfuncional).
- **Status:** Planejado para Fase 2.

### BUG 003: IDs Órfãos (UUID vs Slug) em Tabelas de Progresso
- **Severidade:** P1
- **Arquivo:** `supabase/migrations/20260912133417_change_progress_ids_to_text.sql`
- **Causa:** Esta migração mudou `lesson_progress.lesson_id`, `study_plans.last_lesson_id` e `question_attempts.question_id` para TEXT (para tentar armazenar slugs), mas as tabelas referenciadas (`lessons`, `questions`) ainda têm UUID como PK primária! As chaves estrangeiras foram dropadas e nunca recriadas.
- **Impacto:** A integridade referencial está quebrada. O app salva "les_ac_1_1" no progresso, mas o UUID não bate.
- **Correção Proposta:** Em vez de tentar usar slugs como PKs em tudo, implementaremos a lógica de "Dual-Key" ou restabeleceremos UUIDs para a persistência. O ideal é manter a tabela primária (lessons) com seu `id` (uuid) e `slug` (text UNIQUE), e usar UUIDs para progresso referencial. O `resolveLessonId(slug)` fará a ponte no frontend.
- **Risco:** Alto (Muitas queries de progresso dependem de como o frontend manda o ID).
- **Status:** Planejado para Fase 3.

### BUG 004: Insegurança no Uso de Chave Auth no Sync
- **Severidade:** P2
- **Arquivo:** `scripts/syncToDB.js`
- **Causa:** O script utiliza `VITE_SUPABASE_ANON_KEY` como se fosse uma *Service Role Key*. O RLS pode bloquear upserts administrativos.
- **Impacto:** Falhas silenciosas ou 403 Forbidden durante inserções massivas de dados.
- **Correção Proposta:** Usar `SUPABASE_SERVICE_ROLE_KEY` exclusivamente para scripts administrativos (Node), configurado no `.env`, deixando `VITE_*` apenas para o client-side (React).
- **Risco:** Baixo.
- **Status:** Planejado para Fase 3.

### BUG 005: Tratamento de Erros Silenciosos (Fallbacks em catch)
- **Severidade:** P2
- **Arquivo:** `src/services/supabaseService.js` / `src/context/DataCacheContext.jsx`
- **Causa:** Algumas funções engolem erros (ex: retornando arrays vazios `[]`) quando ocorrem falhas no Supabase (ex: erro de tipagem no ID).
- **Impacto:** O desenvolvedor/usuário vê telas vazias infinitamente (ou sem dados) sem saber que o banco de dados rejeitou a query.
- **Correção Proposta:** Remover fallbacks destrutivos, lançar os erros para o `useCachedQuery` e garantir que as telas renderizem blocos de "Erro ao carregar dados" em vez de "0 aulas".
- **Risco:** Médio.
- **Status:** Planejado para Fase 9.

---
**PRÓXIMO PASSO IMEDIATO:**
Executar a Fase 2 (Schema e Migrations). Escrever e aplicar a migration para resolver as hierarquias DB vs Frontend.

