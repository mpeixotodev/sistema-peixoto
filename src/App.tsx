import { useState } from 'react';
import { SearchEngine } from './components/SearchEngine';
import { DocumentIngestion } from './components/DocumentIngestion';
import { Shield, Search, FileUp, Activity } from 'lucide-react';
import { initialSuspeitos } from './mockData';
import type { Suspeito } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'ingestion'>('search');
  const [suspeitosGlobais, setSuspeitosGlobais] = useState<Suspeito[]>(initialSuspeitos);

  const handleIngestionComplete = (novosSuspeitos: Suspeito[]) => {
    setSuspeitosGlobais(prev => {
      const updated = [...prev];
      
      novosSuspeitos.forEach(novo => {
        // Lógica de mesclagem (simulada por ID, mas na vida real seria por CPF/Nome)
        const existeIndex = updated.findIndex(s => s.id === novo.id);
        if (existeIndex >= 0) {
          // Se já existe, adiciona os novos relatórios à ficha existente
          updated[existeIndex] = {
            ...updated[existeIndex],
            relatorios: [...updated[existeIndex].relatorios, ...novo.relatorios]
          };
        } else {
          // Se não existe, adiciona o novo cadastro
          updated.push(novo);
        }
      });
      
      return updated;
    });
    
    // Opcional: Voltar para a aba de busca após a ingestão
    // setTimeout(() => setActiveTab('search'), 2000);
  };

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
            <p className="text-sm font-bold">Investigador #9822</p>
            <div className="flex items-center gap-2" style={{ justifyContent: 'flex-end' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <p className="text-xs text-secondary font-bold uppercase">Online</p>
            </div>
          </div>
          <div className="surface flex items-center" style={{ padding: '0.5rem', borderRadius: '50%' }}>
            <Activity size={20} style={{ color: 'var(--accent-blue)' }} />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'search' ? (
          <SearchEngine suspeitos={suspeitosGlobais} />
        ) : (
          <DocumentIngestion onIngest={handleIngestionComplete} />
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
