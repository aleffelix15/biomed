import React, { useState } from 'react';
import { theme, alpha } from '../../theme/tokens';
import { marked } from 'marked';
import { aiService } from '../../services/aiService';
import { Brain, Send, X, Loader2, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';

export default function AiAssistant({ topic }) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | empty
  const [answer, setAnswer] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAsk = async () => {
    if (!question.trim()) {
      setStatus('empty');
      return;
    }

    setStatus('loading');
    setAnswer('');
    setErrorMsg('');

    const result = await aiService.explainTopic({
      topic,
      question,
      context: 'Estudante de Biomedicina',
    });

    if (result.success) {
      setAnswer(result.answer);
      setStatus('success');
    } else {
      setErrorMsg(result.error || 'Não foi possível consultar a IA agora.');
      setStatus('error');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: theme.primary,
          color: theme.bg,
          border: 'none',
          borderRadius: 20,
          padding: '8px 16px',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          marginTop: 24,
          transition: 'transform 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Brain size={16} /> Pergunte à IA sobre este assunto
      </button>
    );
  }

  return (
    <Card
      padding={20}
      style={{
        background: theme.card,
        border: `1px solid ${theme.line}`,
        marginTop: 24,
        position: 'relative',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <button
        onClick={() => { setIsOpen(false); setStatus('idle'); setAnswer(''); }}
        aria-label="Fechar assistente de IA"
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme.surface,
          border: `1px solid ${theme.line}`,
          borderRadius: 8,
          color: theme.text,
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = theme.line}
        onMouseLeave={(e) => e.currentTarget.style.background = theme.surface}
      >
        <X size={16} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Brain size={20} color={theme.primary} />
        <span style={{ fontWeight: 700, color: theme.text, fontSize: 16 }}>Assistente BioStudy AI</span>
      </div>

      {status === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 1.5 }}>
            Tem alguma dúvida sobre <strong>{topic}</strong>? Pergunte e eu explicarei de forma didática para você.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ex: O que é glicólise?"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: 8,
                border: `1px solid ${theme.line}`,
                background: theme.bg,
                color: theme.text,
                fontSize: 14
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            />
            <button
              onClick={handleAsk}
              style={{
                padding: '0 16px',
                borderRadius: 8,
                background: theme.primary,
                color: theme.bg,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {status === 'loading' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
          <Loader2 size={24} color={theme.primary} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ fontSize: 14, color: theme.textSecondary, marginTop: 12 }}>Analisando sua dúvida...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {status === 'empty' && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <p style={{ fontSize: 13, color: theme.danger }}>Por favor, digite sua dúvida antes de enviar.</p>
          <button onClick={() => setStatus('idle')} style={{ background: 'none', border: 'none', color: theme.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Tentar novamente</button>
        </div>
      )}

      {status === 'error' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '10px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.danger }}>
            <AlertCircle size={18} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>Erro na consulta</span>
          </div>
          <p style={{ fontSize: 13, color: theme.textSecondary, textAlign: 'center' }}>{errorMsg}</p>
          <button
            onClick={() => setStatus('idle')}
            style={{ background: theme.surface, color: theme.text, border: `1px solid ${theme.line}`, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {status === 'success' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: marked.parse(answer) }}
            style={{
              fontSize: 14,
              color: theme.text,
              lineHeight: 1.6,
              background: theme.bg,
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${theme.line}`
            }}
          />
          <button
            onClick={() => { setStatus('idle'); setAnswer(''); setQuestion(''); }}
            style={{ alignSelf: 'flex-end', background: 'none', border: 'none', color: theme.primary, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Fazer outra pergunta
          </button>
        </div>
      )}
    </Card>
  );
}
