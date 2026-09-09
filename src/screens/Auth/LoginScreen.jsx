import React, { useState } from 'react';
import { theme } from '../../theme/tokens';
import { supabase } from '../../services/supabaseClient';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) return; // Fallback happens at App level, but just in case
    
    setLoading(true);
    setErrorMsg('');
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // Optionally show success or wait for auto-login
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocorreu um erro');
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
      setErrorMsg(err.message || 'Erro ao recuperar senha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: theme.bg }}>
      <h1 style={{ color: theme.text, textAlign: 'center', marginBottom: 24 }}>BioStudy</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <input 
          type="email" 
          placeholder="E-mail" 
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: `1px solid ${theme.line}`, background: theme.surface, color: theme.text }}
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ padding: 12, borderRadius: 8, border: `1px solid ${theme.line}`, background: theme.surface, color: theme.text }}
        />
        
        {errorMsg && (
          <div style={{ color: theme.danger, fontSize: 14 }}>{errorMsg}</div>
        )}
        
        <button 
          type="submit"
          disabled={loading}
          style={{ padding: 14, borderRadius: 8, background: theme.primary, color: theme.bg, fontWeight: 'bold', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
        </button>
      </form>

      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignUp ? 'Já tenho conta (Entrar)' : 'Criar conta'}
        </button>
        
        {!isSignUp && (
          <button 
            onClick={handleResetPassword}
            style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer' }}
          >
            Esqueci minha senha
          </button>
        )}
      </div>
    </div>
  );
}
