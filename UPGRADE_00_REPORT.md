# BIOSTUDY — UPGRADE 00 REPORT

## 1. Estado geral
CRÍTICO - Divergência estrutural grave entre Código Local e Banco Remoto.

## 2. Banco
Tabelas verificadas:
- `disciplines`, `modules`, `topics`, `lessons`, `questions`, `flashcards`
- `user_progress`, `topic_progress`, `lesson_progress`, `question_attempts`, `user_flashcard_progress`

FKs verificadas:
- Maioria das FKs de `lesson_id`, `topic_id` e `question_id` nas tabelas de progresso foram REMOVIDAS em migrations recentes para permitir o uso de `slugs` literais em vez de `UUIDs`.

Constraints verificadas:
- Unique constraints de upsert estão presentes nas tabelas de progresso (ex: `user_id, topic_id`), porém `topic_progress` possui uma falha de relacionamento ao tentar fazer JOIN.

RLS verificadas:
- Ativas para tabelas de progresso do usuário.
- DESATIVADAS para a tabela `questions` (migration `20260912093800_disable_rls_questions.sql`), o que permite escrita anônima.

## 3. Conteúdo
LOCAL:
disciplines = Slug Textual (`anatomia`)
topics = Slug Textual (`anatomia_sistema_esqueletico`)
modules = Slug Textual (`mod_anatomia_0`)
lessons = Slug Textual (`les_anatomia_0_0`)
questions = Presentes em `questions.json` com campos `option_a`, `option_b`, `correct_option`
flashcards = N/A (derivados ou a fazer)

SUPABASE:
disciplines = Slug Textual (`anatomia`)
modules = UUID (com `discipline_id` referenciando text)
topics = UUID (com `module_id` referenciando UUID)
lessons = UUID
questions = UUID, com campos `options` (array JSON) e `correct_option_index`.
flashcards = UUID

## 4. Divergências
A hierarquia está INVERTIDA.
Local: `Discipline` -> `Topic` -> `Module` -> `Lesson`
Supabase: `Discipline` -> `Module` -> `Topic` -> `Lesson`

O script `syncToDB.js` faz uma ponte manual invertendo as entidades para fazer o upload, gerando UUIDs no banco para representar os slugs locais. Isso gera uma confusão extrema.

## 5. UUID / SLUG
- O frontend salva o progresso (`topic_progress`, `lesson_progress`) usando o **SLUG** textual.
- A tabela `topics` e `lessons` no banco usam **UUID**.
- Consequentemente, as Foreign Keys foram derrubadas nas tabelas de progresso.

## 6. Questões
LOCAL = Presentes em `questions.json` com estrutura de letras (option_a, option_b).
SUPABASE = Presentes em `questions` com array JSON.
SINCRONIZADAS = Sim, o script `syncToDB.js` mapeia os dados locais para a nuvem.
O problema: `fetchLessonQuiz` consulta o Supabase usando o slug da aula para descobrir o UUID remoto e então buscar as questões. Funciona na gambiarra, mas ignora a fonte de verdade local.

## 7. Progresso
- disciplina: Funciona (upsert com slugs).
- tópico: **QUEBRADO**. A função `fetchTopicProgress` tenta fazer subquery em `topics` buscando `discipline_id`, mas a tabela remota `topics` só tem `module_id`. Sempre retorna zero.
- aula: Funciona (usa array de slugs locais comparando com a coluna text sem JOINs).
- questão: Funciona.
- flashcard: Inativo/Não testado profundamente.

## 8. RLS
| Tabela | Status | Problema | Ação |
|---|---|---|---|
| questions | Desativado | Qualquer um pode fazer INSERT/UPDATE via API | Restaurar RLS leitura-apenas |
| topic_progress | Ativo | Subquery na leitura falha por schema errado | Corrigir consulta |

## 9. Migrations
Existentes: 7 na pasta `supabase/migrations/` (além das de setup direto).
Novas criadas: 0 (Nenhuma alteração destrutiva foi feita nesta auditoria).

## 10. Arquivos alterados
Nenhum arquivo de código foi alterado. Apenas scripts temporários (`scratch/*`) criados para testes.

## 11. Testes
npm run build = PASS
npm run lint = N/A
tests = N/A

## 12. Riscos restantes
Se tentarmos migrar as tabelas de conteúdo estático do Supabase de UUID para text (como feito com `disciplines`), a quebra será massiva devido à inversão de hierarquia e dependência do `syncToDB.js`. 

## 13. Recomendações para o próximo upgrade
============================================================
⚠️ DECISÃO ARQUITETURAL NECESSÁRIA ⚠️
============================================================

O frontend usa o Supabase como banco de dados estático para ler as `questions`, MAS já possui todas elas empacotadas em `src/content/.../questions.json` (graças ao nosso trabalho prévio de bundle).

**OPÇÃO A (Recomendada): Abandonar o Supabase para conteúdo estático.**
Como o conteúdo local `.json` já é a fonte de verdade, podemos parar de consultar as tabelas `topics`, `modules`, `lessons` e `questions` do Supabase. O Supabase passará a gerenciar **somente dados acadêmicos do usuário** (`user_progress`, `question_attempts`, etc.). 
- Risco: Quase nulo. Basta alterar `fetchLessonQuiz` para usar a função `getQuizQuestions` do arquivo `contentService.js` (que já existe e funciona perfeitamente localmente!).
- Benefício: Elimina imediatamente os bugs de sincronização, a inversão de hierarquia e a necessidade do `syncToDB.js`.

**OPÇÃO B: Refazer o banco remoto.**
Destruir as tabelas remotas de conteúdo e recriá-las seguindo estritamente o modelo de Slugs e a hierarquia Local.
- Risco: Alto. Vai exigir refatorar dezenas de `SELECTs` em todo o código e reescrever o script de sincronização.
- Benefício: Permite atualizações OTA (Over-The-Air) de conteúdo no futuro sem precisar de rebuild do Vite.

Por favor, escolha qual caminho (A ou B) você aprova. Se a Opção A for escolhida, eu implementarei a correção de `fetchTopicProgress`, removerei os acessos inúteis ao banco remoto e encerrarei o UPGRADE 00 com uma arquitetura cristalina!

