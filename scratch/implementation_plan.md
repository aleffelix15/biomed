# Correção Completa do BioStudy - Estabilização de Arquitetura

Após rodar a FASE 1 (Auditoria completa do Banco vs Código), encontrei um **bloqueio arquitetural crítico** que exige sua aprovação antes de continuar, conforme a Regra 33.

## User Review Required

> [!WARNING] Conflito Estrutural (Inversão de Hierarquia)
> O banco de dados real hospedado no Supabase está com a hierarquia invertida em relação ao código Frontend e aos arquivos de conteúdo JSON.
> 
> **No Frontend / JSON:** `Disciplina -> Tópico -> Módulo -> Aula`
> **No Supabase Real:** `Disciplina -> Módulo -> Tópico -> Aula`
>
> **Evidência:** O script `syncToDB.js` falha ao rodar com o erro *"Could not find the 'discipline_id' column of 'topics'"*. A tabela `topics` no banco tem `module_id`, mas o código tenta inserir `discipline_id`.

> [!CAUTION] Incompatibilidade da Tabela de Questões
> A tabela `questions` no Supabase possui as colunas `content`, `options` (array jsonb/text) e `correct_option_index` (int). 
> Porém, o arquivo local `schema.sql`, os JSONs e todo o componente de Quiz do Frontend esperam `question`, `option_a`, `option_b`, `option_c`, `option_d`, `option_e` e `correct_option` (char, ex: 'a').

## Open Questions

Para resolvermos isso e estabilizarmos o projeto (fazendo o sync funcionar e as telas carregarem), precisamos definir qual será a Fonte da Verdade absoluta para o schema.

**Opções:**
1. **(Recomendado) Modificar o Banco de Dados para refletir o Frontend/JSON:** Criar e rodar uma migração (`ALTER TABLE`) que inverte as chaves estrangeiras no Supabase (`topics` ganha `discipline_id`, `modules` ganha `topic_id`) e ajusta as colunas de `questions`. Essa é a opção mais segura para **não reescrever a interface inteira do usuário**.
2. **Modificar o Frontend e o Conteúdo JSON para refletir o Banco:** Exigiria refatorar a navegação do app inteiro e alterar a estrutura de centenas de arquivos JSON de conteúdo.

Como não tenho a senha do banco/service_role para rodar a migração via CLI (`npx supabase db push`) no projeto remoto (`htrahzutbrwugjtrgxbg`), precisarei da sua orientação sobre como prosseguir com as alterações do schema.

## Proposed Changes

Caso aprove a Opção 1 (Ajustar o banco ao Frontend), o plano será:

### Supabase Migrations
#### [NEW] `supabase/migrations/20260913181500_fix_db_hierarchy.sql`
- Script SQL para alinhar as tabelas `topics`, `modules`, `lessons` e `questions` com o Frontend.

### Ajustes no Frontend / Sync
#### [MODIFY] `scripts/syncToDB.js`
- Ajustar os payloads de `upsert` para corresponderem exatamente aos tipos e nomes das colunas corrigidas.
- Usar a Service Role Key (via um prompt seguro ou `.env`) para evitar bloqueios de RLS.

#### [MODIFY] Tabelas de Progresso e Flashcards
- Implementar as regras de ID (resolver o conflito UUID vs Slug) documentadas na auditoria. O código Frontend usará `resolveLessonId(slug)` caso o ID local seja um slug e o banco exija o UUID correspondente da linha.

## Verification Plan

### Manual Verification
- Aplicar a migration no painel do Supabase.
- Rodar `node scripts/syncToDB.js` com a Service Role Key e verificar 100% de sucesso sem erros.
- Navegar na UI do app da Home até o Quiz, garantindo que o progresso seja persistido de ponta a ponta sem loops de "Loading".

