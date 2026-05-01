import React, { useState } from 'react';
import { Search, Filter, Database, SearchIcon } from 'lucide-react';
import { SuspectCard } from './SuspectCard';
import { SuspectDetailModal } from './SuspectDetailModal';
import type { Suspeito } from '../types';

interface SearchEngineProps {
  suspeitos: Suspeito[];
}

export const SearchEngine: React.FC<SearchEngineProps> = ({ suspeitos }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuspect, setSelectedSuspect] = useState<Suspeito | null>(null);

  const filteredSuspeitos = suspeitos.filter(s => {
    const searchLower = searchTerm.toLowerCase();
    const matchesName = s.nome.toLowerCase().includes(searchLower);
    const matchesAlcunha = s.alcunha?.toLowerCase().includes(searchLower);
    const matchesChar = s.caracteristicas.some(c => c.descricao.toLowerCase().includes(searchLower));
    const matchesRel = s.relatorios.some(r => r.conteudo.toLowerCase().includes(searchLower) || r.titulo.toLowerCase().includes(searchLower));
    
    return matchesName || matchesAlcunha || matchesChar || matchesRel;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 600);
  };

  return (
    <div>
      <div className="search-header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }} className="badge">
          <Database size={14} />
          <span>BASE DE DADOS INTEGRADA - PC-BA</span>
        </div>
        <h1 className="text-gradient">SISTEMA PEIXOTO</h1>
        <p className="text-secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
          Módulo de Busca Criminal por Características e Inteligência de Relatórios. 
          Use o campo abaixo para pesquisar nomes, vulgos, tatuagens ou traços físicos.
        </p>
      </div>

      <div className="search-bar surface">
        <div className="search-input-wrapper">
          <Search className="search-input-icon" size={24} />
          <input 
            type="text" 
            placeholder="Ex: Tatuagem Maria, Monte Serrat, Decapitação..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleSearch}
            className="btn btn-primary"
            style={{ flex: 1, padding: '1rem' }}
          >
            {isSearching ? 'Buscando...' : (
              <>
                <SearchIcon size={20} />
                <span>BUSCAR</span>
              </>
            )}
          </button>
          <button className="btn btn-ghost surface" style={{ padding: '1rem' }}>
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-secondary">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos os Cadastros na Base'}
          </h2>
          <span className="badge">
            {filteredSuspeitos.length} registros
          </span>
        </div>

        <div>
          {filteredSuspeitos.length > 0 ? (
            filteredSuspeitos.map(suspeito => (
              <div key={suspeito.id} onClick={() => setSelectedSuspect(suspeito)}>
                <SuspectCard suspeito={suspeito} />
              </div>
            ))
          ) : (
            <div className="surface" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--bg-base)', marginBottom: '1rem' }}>
                <SearchIcon size={32} className="text-secondary" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Nenhum registro encontrado</h3>
              <p className="text-secondary">Tente ajustar seus termos de busca ou certifique-se de que o relatório foi ingerido.</p>
            </div>
          )}
        </div>
      </div>

      {selectedSuspect && (
        <SuspectDetailModal 
          suspeito={selectedSuspect} 
          onClose={() => setSelectedSuspect(null)} 
        />
      )}
    </div>
  );
};
