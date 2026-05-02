import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Shield, Lock, Mail, Loader2 } from 'lucide-react';

export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ text: 'Cadastro realizado! Você já pode fazer login se o e-mail não exigir confirmação.', type: 'success' });
        setIsLogin(true);
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Erro de autenticação', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', padding: '1rem' }}>
      <div className="surface" style={{ maxWidth: '400px', width: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', marginBottom: '1rem' }}>
            <Shield size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>PC-BA Inteligência</h2>
          <p className="text-secondary text-sm">Acesso Restrito ao Sistema Peixoto</p>
        </div>

        {message && (
          <div style={{ 
            padding: '0.75rem', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '0.875rem',
            backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
            color: message.type === 'error' ? '#ef4444' : '#22c55e',
            border: `1px solid ${message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)'}`
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>E-mail Institucional</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                placeholder="investigador@pc.ba.gov.br"
              />
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Senha</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', justifyContent: 'center' }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : (isLogin ? 'ENTRAR NO SISTEMA' : 'SOLICITAR ACESSO')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <button 
            onClick={() => { setIsLogin(!isLogin); setMessage(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '0.875rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Não possui acesso? Cadastre-se' : 'Já possui acesso? Fazer login'}
          </button>
        </div>
      </div>
    </div>
  );
};
