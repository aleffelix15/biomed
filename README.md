# BioStudy — Fundação do MVP

App de estudos para estudantes de Biomedicina. Este pacote contém a **base**
do projeto: navegação, design system, telas principais e integração com Supabase.

## Rodando o projeto

### 1. Configurando Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto, usando o `.env.example` como base:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```
*Se você não fornecer estas variáveis, o app rodará no **modo demo**, utilizando os dados mock.*

### 2. Instalando e executando
```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

### 3. Populando o Banco (Seed)
Caso você já tenha as tabelas criadas no Supabase (conforme `supabase/schema.sql`), pode popular o banco com os dados iniciais rodando:
```bash
node scripts/seed.js
```
*Este script necessita que o arquivo `.env` esteja configurado com as credenciais do Supabase.*

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
│   ├── Auth/                   # Tela de Login
│   └── Progress/
├── components/
│   ├── ui/                     # Card, Badge, ProgressBar, SectionHeader...
│   └── domain/                 # DisciplineCard, BookCard
├── services/                   # supabaseService.js (API real) e mockService.js
├── state/                      # useAuth.js e useAppNavigation.js
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

## Autenticação

A autenticação é provida nativamente pelo Supabase Auth, suportando e-mail e senha. O fluxo de sessão é verificado ativamente em tempo real no carregamento do aplicativo:
- Se as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estiverem ausentes, o app ativa automaticamente o "modo offline/demo", pulando o login e entrando com dados mockados.
- Se configurado, a tela de login exige credenciais. O app protege todo o conteúdo de `src/screens` forçando a rota para `<LoginScreen />` até que um login, cadastro ou recuperação de senha sejam concluídos. O logout pode ser feito no topo do overlay de progresso.
