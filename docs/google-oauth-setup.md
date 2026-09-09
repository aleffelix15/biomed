# Configurando o Login com Google no BioStudy

## Visão Geral

O BioStudy usa o **Supabase Auth** como intermediário para o OAuth do Google.
Você **nunca** coloca Client Secret no frontend — ele fica exclusivamente no painel do Supabase.

---

## Parte 1 — Google Cloud Console

### 1. Criar ou selecionar um projeto

1. Acesse [console.cloud.google.com](https://console.cloud.google.com)
2. Crie um novo projeto ou selecione um existente (ex: `biomed-af`)

### 2. Ativar a tela de consentimento OAuth

1. No menu lateral: **APIs e Serviços → Tela de permissão OAuth**
2. Tipo de usuário: **Externo**
3. Preencha:
   - **Nome do aplicativo**: BioStudy
   - **E-mail de suporte**: seu e-mail
   - **Domínio autorizado**: `biomed-af.web.app` (ou seu domínio real)
4. Salve e avance até a conclusão

### 3. Criar as credenciais OAuth

1. **APIs e Serviços → Credenciais → Criar Credenciais → ID do cliente OAuth**
2. Tipo de aplicativo: **Aplicativo da Web**
3. Nome: `BioStudy Web`
4. **Origens JavaScript autorizadas** — adicione:
   ```
   http://localhost:5173
   https://biomed-af.web.app
   https://biomed-af.firebaseapp.com
   ```
5. **URIs de redirecionamento autorizados** — adicione o URL de callback do Supabase:
   ```
   https://<SEU_PROJECT_REF>.supabase.co/auth/v1/callback
   ```
   > Substitua `<SEU_PROJECT_REF>` pelo ID do seu projeto Supabase (ex: `abcdefghijklmnop`).
   > Você encontra esse URL em: Supabase Dashboard → Authentication → Providers → Google

6. Clique em **Criar**
7. Copie o **Client ID** (formato: `XXXXXX.apps.googleusercontent.com`)
8. O **Client Secret** ficará disponível — **NÃO coloque no código**, apenas no Supabase

---

## Parte 2 — Supabase Dashboard

### 1. Configurar o Provider Google

1. Acesse [supabase.com](https://supabase.com) → seu projeto → **Authentication → Providers**
2. Encontre **Google** e ative o toggle
3. Preencha:
   - **Client ID**: cole o Client ID do Google Cloud
   - **Client Secret**: cole o Client Secret do Google Cloud
4. Salve

### 2. Configurar o Site URL

1. Vá em **Authentication → URL Configuration**
2. Em **Site URL**, coloque:
   ```
   https://biomed-af.web.app
   ```
3. Em **Redirect URLs**, adicione:
   ```
   http://localhost:5173/
   https://biomed-af.web.app/
   ```
4. Salve

---

## Parte 3 — Variáveis de Ambiente no Projeto

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://<SEU_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua_anon_key>
VITE_SITE_URL=http://localhost:5173
```

Para produção, altere `VITE_SITE_URL` para o domínio real:
```env
VITE_SITE_URL=https://biomed-af.web.app
```

> **Nunca** commite o arquivo `.env`. Ele está no `.gitignore`.

---

## Como o Fluxo Funciona

```
Usuário clica em "Continuar com Google"
↓
supabase.auth.signInWithOAuth({ provider: 'google' })
↓
Redirect para o Google (seleção de conta)
↓
Google autentica e redireciona para o Supabase callback
↓
Supabase cria/valida a sessão e redireciona para VITE_SITE_URL
↓
onAuthStateChange no AuthContext recebe o evento SIGNED_IN
↓
ensureUserProfile() verifica se o profile existe
  → Se não existe: cria com full_name, avatar_url e email do user_metadata
  → Se existe: retorna o profile atual
↓
App renderiza a Home com dados do usuário
```

---

## Segurança

| O que fazer | O que NÃO fazer |
|---|---|
| ✅ Client ID no Supabase Dashboard | ❌ Client Secret no código |
| ✅ Client Secret no Supabase Dashboard | ❌ Service Role Key no frontend |
| ✅ `anon key` no `.env` | ❌ Tokens armazenados manualmente |
| ✅ RLS habilitado nas tabelas | ❌ Criar sistema OAuth próprio |

---

## Tabela `profiles` no Supabase

A tabela `profiles` precisa existir com Row Level Security ativado.
Execute o SQL em `supabase/schema.sql` no **SQL Editor** do seu projeto Supabase.

Campos usados para usuários Google:
- `id` — mesmo UUID do `auth.users`
- `full_name` — vem de `user_metadata.full_name` ou `user_metadata.name`
- `avatar_url` — vem de `user_metadata.avatar_url` ou `user_metadata.picture`
- `email` — vem de `user.email`
