# BIOSTUDY — CONTENT ARCHITECTURE PLAN (B3)

## 1. Arquitetura Atual
**Local (JSON) & Frontend:**
`Discipline` (slug) -> `Topic` (slug) -> `Module` (slug) -> `Lesson` (slug)
*As `Questions` (slug) pertencem a um `Topic` (e opcionalmente a uma `Lesson`).*

**Database (Supabase):**
`disciplines` (text/slug)
  -> `modules` (uuid, FK `discipline_id` text)
    -> `topics` (uuid, FK `module_id` uuid)
      -> `lessons` (uuid, FK `topic_id` uuid)
        -> `questions` (uuid, FK `module_id` uuid, FK `lesson_id` uuid)

## 2. Arquitetura Desejada (Canônica)
**Database (Supabase) alinhado ao Local:**
`disciplines` (id: text)
  -> `topics` (id: text, FK `discipline_id`: text)
    -> `modules` (id: text, FK `topic_id`: text)
      -> `lessons` (id: text, FK `module_id`: text)
        -> `questions` (id: text, FK `topic_id`: text, FK `lesson_id`: text)

## 3. Divergências
- Hierarquia invertida entre Topic e Module no banco remoto.
- `id` no banco é UUID para Modules, Topics, Lessons e Questions, enquanto o Frontend (e as tabelas de progressos) usam Slugs Textuais.
- O script `syncToDB.js` atualmente insere Topics locais na tabela `modules` do banco e Modules locais na tabela `topics` do banco.

## 4. Entidades Afetadas
Conteúdo: `modules`, `topics`, `lessons`, `questions`.
Progresso (para restaurar FKs): `topic_progress`, `lesson_progress`, `question_attempts`.

## 5. Estratégia de IDs
Mudar as Primary Keys de Conteúdo Estático (Topics, Modules, Lessons, Questions) de `UUID` para `text`, utilizando o próprio `slug` gerado localmente como `id`.
*Motivo:* O conteúdo é gerado localmente de forma determinística (ex: `les_ac_0_1`). Ter um UUID randômico no banco obriga o frontend a fazer queries indiretas e quebra as Foreign Keys das tabelas de progresso (que já salvam text).

## 6. Estratégia de Foreign Keys
Ao convertermos os IDs para `text`, poderemos recriar as FKs que foram perdidas:
- `topic_progress.topic_id` -> `topics.id`
- `lesson_progress.lesson_id` -> `lessons.id`
- `question_attempts.question_id` -> `questions.id`

## 7. Estratégia de Migração (Sem Destruição)
1. **Adicionar Colunas Temporárias:** Em `topics`, `modules`, `lessons`, adicionar as colunas corretas de hierarquia (ex: em `topics`, adicionar `new_discipline_id text`).
2. **Converter Tipos:** Executar um `ALTER TABLE ... ALTER COLUMN id TYPE text USING slug::text` para promover o slug a ID primário, assim como foi feito em `disciplines`.
3. **Migrar Relacionamentos:** Atualizar os valores hierárquicos preenchendo as colunas corretas através dos slugs.
4. **Restaurar FKs:** Adicionar novamente as constraints nas tabelas de progresso apontando para os novos IDs textuais.
5. **NÃO DROPAR:** Manter as colunas antigas por enquanto (ex: `module_id` em `topics`) mas renomeá-las ou mantê-las inativas até validação total.

## 8. Estratégia de Sincronização
Reescrever o `syncToDB.js` (`syncToDB_v2.js`) para:
- Usar a Service Role Key (bypassa RLS, mantendo a segurança do banco intocada).
- Mapear Local Topic -> DB Topic, Local Module -> DB Module.
- Usar o Slug local diretamente como `id` na inserção.
- Reportar detalhadamente inserções, atualizações e falhas (Idempotência).

## 9. Estratégia de Compatibilidade do Frontend
- `supabaseService.js` será refatorado para parar de "traduzir" slugs para UUIDs (ex: `fetchLessonQuiz` removerá o fallback complicado).
- O bug do `fetchTopicProgress` será corrigido nativamente pois a tabela `topics` no banco passará a ter `discipline_id` igual ao frontend.

## 10. Riscos
- Risco de quebra nas funções de fetch se o App for acessado durante a janela da migration.
- Dados de progresso (`topic_progress`, `lesson_progress`) com slugs inválidos ou órfãos falharão na criação das FKs (precisaremos de validação prévia).

## 11. Rollback
As migrations serão feitas em blocos transacionais (onde o Postgres permitir) e, como não estamos apagando colunas antigas ou fazendo drop de dados (apenas mudando type/add columns e upando novos dados com o novo sync_v2), poderemos manter o código de leitura anterior num branch de backup.

## 12. Validações Pós-Migração
- Executar query de verificação de FKs (não pode haver orphans nas tabelas de progresso).
- Validar se `fetchTopicProgress` retorna a contagem correta na Home.
- Validar se `syncToDB_v2.js` relata 0 UPDATES na segunda execução.

