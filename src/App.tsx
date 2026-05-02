import { useState, useEffect } from 'react';
import { SearchEngine } from './components/SearchEngine';
import { DocumentIngestion } from './components/DocumentIngestion';
import { Auth } from './components/Auth';
import { Shield, Search, FileUp, Activity, Database, LogOut } from 'lucide-react';
import { supabase } from './supabaseClient';
import type { Suspeito } from './types';
import type { Session } from '@supabase/supabase-js';
import './App.css';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'search' | 'ingestion'>('search');
  const [suspeitosGlobais, setSuspeitosGlobais] = useState<Suspeito[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchSuspeitos();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchSuspeitos();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSuspeitos = async () => {
    setIsLoading(true);
    try {
      const { data: suspeitosData, error: suspeitosError } = await supabase
        .from('suspeitos')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (suspeitosError) throw suspeitosError;

      const { data: caracData, error: caracError } = await supabase
        .from('caracteristicas')
        .select('*');
        
      if (caracError) throw caracError;

      const suspeitosCompletos: Suspeito[] = (suspeitosData || []).map(s => {
        const caracs = (caracData || []).filter(c => c.suspeito_id === s.id);
        return {
          id: s.id,
          nome: s.nome,
          alcunha: s.alcunha || undefined,
          fotoUrl: s.foto_url || undefined,
          ultimaVisto: s.ultima_visto || undefined,
          caracteristicas: caracs.map(c => ({ tipo: c.tipo as any, descricao: c.descricao })),
          relatorios: []
        };
      });

      setSuspeitosGlobais(suspeitosCompletos);
    } catch (error) {
      console.error('Erro ao buscar dados do Supabase:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIngest = async (novosSuspeitos: Suspeito[]) => {
    setIsLoading(true);
    try {
      for (const suspeito of novosSuspeitos) {
        let relatorio_id = null;
        if (suspeito.relatorios && suspeito.relatorios.length > 0) {
          const relatorio = suspeito.relatorios[0];
          const { data: relData } = await supabase
            .from('relatorios')
            .select('id')
            .eq('titulo', relatorio.titulo)
            .maybeSingle();
            
          if (relData) {
            relatorio_id = relData.id;
          } else {
            const { data: newRel } = await supabase
              .from('relatorios')
              .insert({
                titulo: relatorio.titulo,
                conteudo: relatorio.conteudo,
                data: relatorio.data,
                fonte: relatorio.fonte
              })
              .select()
              .single();
            if (newRel) relatorio_id = newRel.id;
          }
        }

        const { data: newSuspeito } = await supabase
          .from('suspeitos')
          .insert({
            nome: suspeito.nome,
            alcunha: suspeito.alcunha || null,
            foto_url: suspeito.fotoUrl || null,
            ultima_visto: suspeito.ultimaVisto || null
          })
          .select()
          .single();

        if (newSuspeito) {
          if (suspeito.caracteristicas && suspeito.caracteristicas.length > 0) {
            const caracsToInsert = suspeito.caracteristicas.map(c => ({
              suspeito_id: newSuspeito.id,
              tipo: c.tipo,
              descricao: c.descricao
            }));
            await supabase.from('caracteristicas').insert(caracsToInsert);
          }

          if (relatorio_id) {
            await supabase.from('suspeito_relatorio').insert({
              suspeito_id: newSuspeito.id,
              relatorio_id: relatorio_id
            });
          }
        }
      }
    } catch (error) {
      console.error('Erro ao inserir no Supabase:', error);
    }

    await fetchSuspeitos();
    setActiveTab('search');
  };

  if (!session) {
    return <Auth />;
  }

  const userEmail = session.user.email || '';
  const username = userEmail.split('@')[0];

  return (
    <div className="app-container">
      {/* Sidebar / Navigation */}
      <nav className="top-nav">
        <div className="nav-brand">
          <div className="nav-logo">
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.05em' }}>PC-BA</h1>
            <p className="text-xs uppercase font-bold text-secondary tracking-wide">Inteligência Criminal</p>
          </div>
        </div>

        <div className="nav-tabs">
          <button 
            onClick={() => setActiveTab('search')}
            className={`btn ${activeTab === 'search' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <Search size={18} />
            <span>BUSCA</span>
          </button>
          <button 
            onClick={() => setActiveTab('ingestion')}
            className={`btn ${activeTab === 'ingestion' ? 'btn-primary' : 'btn-ghost'}`}
          >
            <FileUp size={18} />
            <span>INGESTÃO</span>
          </button>
        </div>

        <div className="nav-user">
          <div style={{ textAlign: 'right' }}>
            <p className="text-sm font-bold">{username}</p>
            <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <p className="text-xs text-secondary font-bold uppercase">Online</p>
            </div>
          </div>
          <div className="surface flex items-center" style={{ padding: '0.5rem', borderRadius: '50%', gap: '0.5rem' }}>
            <Activity size={20} style={{ color: 'var(--accent-blue)' }} />
            <button 
              onClick={() => supabase.auth.signOut()} 
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
              title="Sair"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem' }}>
            <div className="animate-spin text-accent"><Database size={48} /></div>
            <p className="text-secondary">Sincronizando com Supabase...</p>
          </div>
        ) : activeTab === 'search' ? (
          <SearchEngine suspeitos={suspeitosGlobais} />
        ) : (
          <DocumentIngestion onIngest={handleIngest} />
        )}
      </main>

      {/* Footer Status Bar */}
      <footer className="status-footer">
        <div className="flex gap-4">
          <span>Cadastros Ativos: {suspeitosGlobais.length}</span>
          <span className="status-footer-details">Mandados Ativos: 124</span>
        </div>
        <div className="flex gap-4">
          <span className="status-footer-details">Servidor: Salvador-A1</span>
          <span>Latência: 12ms</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
