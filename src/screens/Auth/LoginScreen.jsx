import React, { useState } from "react";
import { theme } from "../../theme/tokens";
import { supabase } from "../../services/supabaseClient";
import Badge from "../../components/ui/Badge";

export default function LoginScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha e-mail e senha.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Verifique seu e-mail para confirmar a conta!");
    }
    setLoading(false);
  };

  const handleReset = async () => {
    if (!email) {
      setError("Preencha o e-mail para recuperar a senha.");
      return;
    }
    setLoading(true);
    setError(null);
    setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setMessage("E-mail de recuperação enviado!");
    setLoading(false);
  };

  return (
    <div style={{ padding: "40px 24px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <h1 className="bs-display" style={{ fontSize: 28, fontWeight: 700, color: theme.text, margin: "0 0 8px 0" }}>
        BioStudy
      </h1>
      <p style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 32, lineHeight: 1.5 }}>
        {isLogin ? "Acesse sua conta para continuar seus estudos." : "Crie sua conta para acompanhar seu progresso."}
      </p>

      {error && (
        <div style={{ marginBottom: 16 }}>
          <Badge tone="danger">{error}</Badge>
        </div>
      )}
      
      {message && (
        <div style={{ marginBottom: 16 }}>
          <Badge tone="teal">{message}</Badge>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, color: theme.text, outline: "none" }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, color: theme.text, outline: "none" }}
        />

        <button 
          type="submit" 
          disabled={loading}
          style={{ background: theme.primary, color: theme.bg, border: "none", borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", marginTop: 8, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "Processando..." : (isLogin ? "Entrar" : "Criar conta")}
        </button>
      </form>

      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ background: "none", border: "none", color: theme.primary, fontSize: 14, fontWeight: 600, cursor: "pointer", padding: 0 }}
        >
          {isLogin ? "Não tem conta? Criar agora" : "Já tem conta? Entrar"}
        </button>
        
        {isLogin && (
          <button 
            onClick={handleReset} 
            disabled={loading}
            style={{ background: "none", border: "none", color: theme.textSecondary, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", padding: 0 }}
          >
            Esqueci minha senha
          </button>
        )}
      </div>
    </div>
  );
}
