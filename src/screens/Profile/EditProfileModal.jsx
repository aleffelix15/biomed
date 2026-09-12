import React, { useState } from 'react';
import { theme, alpha } from '../../theme/tokens';
import { X, Save } from 'lucide-react';

export default function EditProfileModal({ profile, onClose, onSave, loading }) {
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    display_name: profile?.display_name || '',
    course: profile?.course || '',
    institution: profile?.institution || '',
    period: profile?.period || '',
    bio: profile?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
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

  const labelStyle = {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: 600,
    marginBottom: 4,
    display: 'block'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 16
    }}>
      <div style={{
        background: theme.card, borderRadius: 16, width: '100%', maxWidth: 400,
        maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: `1px solid ${theme.line}`,
          position: 'sticky', top: 0, background: theme.card, zIndex: 10
        }}>
          <h2 style={{ margin: 0, fontSize: 18, color: theme.text }}>Editar Perfil</h2>
          <button onClick={onClose} disabled={loading} style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={labelStyle}>Nome Completo</label>
            <input name="full_name" value={formData.full_name} onChange={handleChange} style={inputStyle} placeholder="Ex: Alef Felix Teixeira" />
          </div>
          <div>
            <label style={labelStyle}>Nome de Exibição</label>
            <input name="display_name" value={formData.display_name} onChange={handleChange} style={inputStyle} placeholder="Ex: Alef Felix" />
          </div>
          <div>
            <label style={labelStyle}>Instituição/Faculdade</label>
            <input name="institution" value={formData.institution} onChange={handleChange} style={inputStyle} placeholder="Ex: PUC Goiás" />
          </div>
          <div>
            <label style={labelStyle}>Curso</label>
            <input name="course" value={formData.course} onChange={handleChange} style={inputStyle} placeholder="Ex: Biomedicina" />
          </div>
          <div>
            <label style={labelStyle}>Período</label>
            <input name="period" value={formData.period} onChange={handleChange} style={inputStyle} placeholder="Ex: 3º período" />
          </div>
          <div>
            <label style={labelStyle}>Bio / Descrição</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} placeholder="Fale um pouco sobre você..." />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: 20, borderTop: `1px solid ${theme.line}`,
          position: 'sticky', bottom: 0, background: theme.card, zIndex: 10
        }}>
          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              width: '100%', padding: 14, borderRadius: 12, background: theme.primary,
              color: theme.bg, border: 'none', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Salvando...' : <><Save size={18} /> Salvar Alterações</>}
          </button>
        </div>
      </div>
    </div>
  );
}
