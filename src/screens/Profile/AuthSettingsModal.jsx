import React, { useState } from 'react';
import { theme, alpha } from '../../theme/tokens';
import { X, Save, Lock, Mail } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';

export default function AuthSettingsModal({ type, user, onClose }) {
  const [value, setValue] = useState(type === 'email' ? user?.email : '');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSave = async () => {
    if (!value) return;
    setLoading(true);
    setMsg('');
    setIsError(false);

    try {
      if (type === 'email') {
        const { error } = await supabase.auth.updateUser({ email: value });
        if (error) throw error;
        setMsg('Verifique a caixa de entrada dos dois e-mails para confirmar a alteração.');
      } else {
        const { error } = await supabase.auth.updateUser({ password: value });
        if (error) throw error;
        setMsg('Senha atualizada com sucesso!');
        setValue('');
      }
    } catch (err) {
      setIsError(true);
      setMsg(err.message || 'Erro ao atualizar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: 12,
    borderRadius: 8,
    border: `1px solid ${theme.line}`,
    background: theme.surface,
    color: theme.text,
    width: '100%',
    boxSizing: 'border-box',
    fontSize: 14,
    fontFamily: 'inherit'
  };

  const title = type === 'email' ? 'Alterar E-mail' : 'Alterar Senha';
  const icon = type === 'email' ? <Mail size={18} /> : <Lock size={18} />;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16
    }}>
      <div style={{
        background: theme.card, borderRadius: 16, width: '100%', maxWidth: 400,
        display: 'flex', flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${theme.line}`
        }}>
          <h2 style={{ margin: 0, fontSize: 18, color: theme.text }}>{title}</h2>
          <button onClick={onClose} disabled={loading} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {type === 'email' && (
            <p style={{ fontSize: 13, color: theme.textSecondary, margin: 0, lineHeight: 1.5 }}>
              Para alterar seu e-mail, enviaremos um link de confirmação para o endereço atual e para o novo endereço.
            </p>
          )}

          <div>
            <label style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600, marginBottom: 4, display: 'block' }}>
              {type === 'email' ? 'Novo E-mail' : 'Nova Senha'}
            </label>
            <input
              type={type === 'email' ? 'email' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              style={inputStyle}
              placeholder={type === 'email' ? 'exemplo@email.com' : 'Sua nova senha secreta'}
            />
          </div>

          {msg && (
            <div style={{
              padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 500, textAlign: 'center',
              background: isError ? alpha(theme.danger, '22') : alpha(theme.primary, '22'),
              color: isError ? theme.danger : theme.primary
            }}>
              {msg}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={loading || !value}
            style={{
              width: '100%', padding: 14, borderRadius: 12, background: theme.primary,
              color: theme.bg, border: 'none', fontWeight: 700, cursor: loading || !value ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading || !value ? 0.7 : 1, marginTop: 8
            }}
          >
            {loading ? 'Salvando...' : <><Save size={18} /> Confirmar</>}
          </button>
        </div>
      </div>
    </div>
  );
}
