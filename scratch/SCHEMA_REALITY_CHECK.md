# SCHEMA REALITY CHECK

## 1. Discrepância de Hierarquia (O Problema Principal)

O código frontend (`src/services/contentService.js`) e a estrutura de conteúdo local (arquivos JSON em `src/content/`) seguem estritamente a hierarquia:
**Discipline → Topic → Module → Lesson → Question**

Entretanto, o banco de dados *real* hospedado no Supabase (consultado via API) apresenta a hierarquia invertida entre Module e Topic:
**Discipline → Module → Topic → Lesson → Question**

### Tabela: `modules`
- **Banco Real:** Possui `discipline_id` (indicando que Module é filho de Discipline).
- **Código/JSON:** Module é filho de Topic. `schema.sql` local diz que `modules` tem `topic_id`.

### Tabela: `topics`
- **Banco Real:** Possui `module_id` (indicando que Topic é filho de Module).
- **Código/JSON:** Topic é filho de Discipline. `schema.sql` local diz que `topics` tem `discipline_id`.

### Tabela: `questions`
- **Banco Real:** Colunas são `content`, `options` (array jsonb/text), `correct_option_index` (int).
- **Código/JSON/schema.sql:** O schema diz que deveria ser `question`, `option_a`, `option_b`... `correct_option` (char).

### Tipos de IDs
- O banco usa **UUID** para `id` nas tabelas `modules`, `topics`, `lessons`, `questions`. O `slug` está em uma coluna separada.
- No entanto, a migração `20260912140009` tentou mudar `discipline_id` para `text` em várias tabelas.
- O script `syncToDB.js` tenta fazer `upsert` usando `{ onConflict: 'slug' }`, mas o schema original definia os IDs primários como UUIDs gerados aleatoriamente.

## 2. Tabelas e Colunas Atuais no Supabase (Live)

| TABELA | COLUNA | TIPO ATUAL | STATUS / DIVERGÊNCIA |
|--------|--------|------------|----------------------|
| `disciplines` | `id` | text | Migrado corretamente para slug. |
| `disciplines` | `slug` | text | Redundante com `id`. |
| `modules` | `id` | uuid | Primária (física). |
| `modules` | `slug` | text | Lógica. |
| `modules` | `discipline_id` | text | **INCORRETO**. Deveria ser `topic_id` (uuid). |
| `topics` | `id` | uuid | Primária (física). |
| `topics` | `slug` | text | Lógica. |
| `topics` | `module_id` | uuid | **INCORRETO**. Deveria ser `discipline_id` (text). |
| `lessons` | `topic_id` | uuid | **INCORRETO**. Deveria ser `module_id` (uuid). |
| `questions` | `content` / `options` | text / array | Diverge do `schema.sql` e do conteúdo local, que usa `option_a`, `option_b`, `correct_option` (char). |

## 3. Justificativa para Correção de Schema

A inversão de `topics` e `modules` no banco de dados impossibilita o funcionamento do frontend e a sincronização do conteúdo local (`syncToDB.js`). 

Para resolver o problema sem destruir a aplicação:
1. Criaremos uma migração explícita para **inverter as chaves estrangeiras**, realinhando o banco à arquitetura de conteúdo:
   - Adicionar `discipline_id` em `topics` e remover `module_id`.
   - Adicionar `topic_id` em `modules` e remover `discipline_id`.
   - Corrigir as relações de `lessons` (apontar para `module_id` em vez de `topic_id`).
   - Sincronizar os nomes das colunas de `questions` com o formato do frontend/JSON.

Isso preservará a filosofia de que o Frontend/Conteúdo é a fonte da verdade neste projeto, corrigindo a raiz do erro "Could not find the 'discipline_id' column of 'topics'" reportado pelo `syncToDB.js`.

