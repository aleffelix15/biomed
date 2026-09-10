import React, { useState } from 'react';
import { theme, alpha } from '../../theme/tokens';
import { supabase } from '../../services/supabaseClient';
import { updateUserProfile } from '../../services/supabaseService';
import { mapAuthError } from '../../utils/errorMapper';
import { useAuth } from '../../state/AuthContext';

// Ícone SVG do Google (sem dependências externas)
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function LoginScreen() {
  const { isOfflineMode, enterDemoMode } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [period, setPeriod] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      enterDemoMode();
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      if (isSignUp) {
        if (!name || !course || !period) {
          throw new Error('Por favor, preencha todos os campos.');
        }
        // Envia nome/curso/período como metadata do Auth: o trigger do banco
        // (handle_new_user) usa isso para criar o profile automaticamente,
        // mesmo que a confirmação de e-mail esteja pendente (sem sessão ativa).
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, course, period },
          },
        });
        if (authError) throw authError;

        if (!authData?.session) {
          // Confirmação de e-mail está ativa no projeto Supabase: não há
          // sessão ainda, então não dá (e não devemos tentar) gravar no
          // banco agora - isso violaria a RLS (auth.uid() é nulo aqui).
          setInfoMsg('Conta criada! Verifique seu e-mail para confirmar o cadastro antes de entrar.');
          setLoading(false);
          return;
        }

        if (authData?.user) {
          // Sessão já ativa (confirmação de e-mail desligada no projeto):
          // o profile já existe (criado pelo trigger), então apenas
          // atualizamos curso/período.
          await updateUserProfile(authData.user.id, {
            course,
            period,
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setErrorMsg(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMsg('Preencha o e-mail para recuperar a senha');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setErrorMsg('E-mail de recuperação enviado (se a conta existir).');
    } catch (err) {
      setErrorMsg(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      enterDemoMode();
      return;
    }

    setGoogleLoading(true);
    setErrorMsg('');
    try {
      // Determina o redirectTo baseado no ambiente
      const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const redirectTo = siteUrl.endsWith('/') ? siteUrl : `${siteUrl}/`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
      // O redirect acontece automaticamente; o loading permanece enquanto o usuário
      // é redirecionado para o Google e depois de volta para o app.
    } catch (err) {
      setErrorMsg(mapAuthError(err));
      setGoogleLoading(false);
    }
    // Não desativa googleLoading aqui pois ocorre um redirect de página
  };

  // Estilos reutilizados
  const inputStyle = {
    padding: 12,
    borderRadius: 10,
    border: `1px solid ${theme.line}`,
    background: theme.surface,
    color: theme.text,
    fontSize: 14,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    margin: '4px 0',
    color: theme.textSecondary,
    fontSize: 12,
  };

  return (
    <div style={{ padding: '32px 24px', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: theme.bg }}>
      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ color: theme.primary, fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>BioStudy</h1>
        <p style={{ color: theme.textSecondary, fontSize: 13, margin: '8px 0 0' }}>
          Seu futuro na Biomedicina começa aqui.
        </p>
      </div>

      {/* Formulário e-mail/senha */}
        {isOfflineMode ? (
          <div style={{ textAlign: 'center', marginBottom: 24, padding: 16, background: theme.surface, borderRadius: 12 }}>
            <h3 style={{ margin: '0 0 8px', color: theme.textPrimary, fontSize: 16 }}>Modo de Demonstração</h3>
            <p style={{ margin: '0 0 16px', color: theme.textSecondary, fontSize: 14, lineHeight: 1.5 }}>
              O backend não está configurado neste ambiente. Você pode entrar utilizando um perfil local sem persistência de dados.
            </p>
            <button
              onClick={enterDemoMode}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: 8,
                border: 'none',
                background: theme.primary,
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                cursor: 'pointer'
              }}
            >
              Acessar Plataforma (Demo)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {isSignUp && (
          <input
            type="text"
            placeholder="Nome Completo"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={inputStyle}
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        {isSignUp && (
          <>
            <input
              type="text"
              placeholder="Curso (ex: Biomedicina)"
              value={course}
              onChange={e => setCourse(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Período (ex: 3º)"
              value={period}
              onChange={e => setPeriod(e.target.value)}
              required
              style={inputStyle}
            />
          </>
        )}

        {errorMsg && (
          <div style={{ color: theme.danger, fontSize: 13, padding: '8px 12px', background: alpha(theme.danger, '18'), borderRadius: 8 }}>
            {errorMsg}
          </div>
        )}
        {infoMsg && (
          <div style={{ color: theme.primary, fontSize: 13, padding: '8px 12px', background: alpha(theme.primary, '18'), borderRadius: 8 }}>
            {infoMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || googleLoading}
          style={{
            padding: 14,
            borderRadius: 10,
            background: theme.primary,
            color: theme.bg,
            fontWeight: 700,
            fontSize: 15,
            border: 'none',
            cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
            opacity: loading || googleLoading ? 0.7 : 1,
            marginTop: 4,
          }}
        >
          {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
        </button>
        </form>
        )}

      {/* Divisor "OU" — só mostra na tela de login */}
      {!isSignUp && (
        <>
          <div style={dividerStyle}>
            <div style={{ flex: 1, height: 1, background: theme.line }} />
            <span>OU</span>
            <div style={{ flex: 1, height: 1, background: theme.line }} />
          </div>

          {/* Botão Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: 13,
              borderRadius: 10,
              background: theme.surface,
              color: theme.text,
              fontWeight: 600,
              fontSize: 14,
              border: `1px solid ${theme.line}`,
              cursor: loading || googleLoading ? 'not-allowed' : 'pointer',
              opacity: loading || googleLoading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            <GoogleIcon />
            {googleLoading ? 'Conectando ao Google...' : 'Continuar com Google'}
          </button>
        </>
      )}

      {/* Links secundários */}
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
        {!isSignUp && (
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading || googleLoading}
            style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: 13 }}
          >
            Esqueci minha senha
          </button>
        )}

        <div style={{ fontSize: 13, color: theme.textSecondary }}>
          {isSignUp ? 'Já possui uma conta?' : 'Não possui uma conta?'}{' '}
          <button
            type="button"
            onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setInfoMsg(''); }}
            style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', fontWeight: 600, fontSize: 13, padding: 0 }}
          >
            {isSignUp ? 'Entrar' : 'Criar conta'}
          </button>
        </div>
      </div>
    </div>
  );
}
