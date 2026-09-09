import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../../theme/tokens';
import { startStudySession, endStudySession } from '../../services/supabaseService';
import Card from '../ui/Card';
import { Play, Square, Clock, CheckCircle } from 'lucide-react';

export default function StudyTimer({ userId, disciplineId, topicId, onSessionEnd }) {
  const [session, setSession] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  const startSession = async () => {
    setLoading(true);
    try {
      const data = await startStudySession(userId, disciplineId, topicId);
      setSession(data);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } catch (err) {
      console.error("Error starting session:", err);
    } finally {
      setLoading(false);
    }
  };

  const stopSession = async () => {
    if (!session) return;
    setLoading(true);
    clearInterval(timerRef.current);
    try {
      await endStudySession(session.id, seconds);
      setSession(null);
      if (onSessionEnd) onSessionEnd();
    } catch (err) {
      console.error("Error stopping session:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Card padding={16} style={{ background: theme.surface, border: `1px solid ${theme.line}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ background: theme.primary, padding: 8, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Clock size={20} color={theme.bg} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: theme.textSecondary, fontWeight: 600 }}>Sessão de Estudo</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: theme.text, fontFamily: 'monospace' }}>{formatTime(seconds)}</div>
        </div>
      </div>

      {!session ? (
        <button
          onClick={startSession}
          disabled={loading}
          style={{ padding: '8px 16px', borderRadius: 8, background: theme.primary, color: theme.bg, border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Play size={16} fill={theme.bg} /> {loading ? '...' : 'Iniciar'}
        </button>
      ) : (
        <button
          onClick={stopSession}
          disabled={loading}
          style={{ padding: '8px 16px', borderRadius: 8, background: theme.danger || '#EF4444', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Square size={16} fill="#fff" /> {loading ? '...' : 'Finalizar'}
        </button>
      )}
    </Card>
  );
}
