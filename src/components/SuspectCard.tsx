import React from 'react';
import type { Suspeito } from '../types';
import { User, MapPin, FileText, ChevronRight } from 'lucide-react';

interface Props {
  suspeito: Suspeito;
}

export const SuspectCard: React.FC<Props> = ({ suspeito }) => {
  return (
    <div className="suspect-card surface">
      <div className="suspect-photo-container">
        {suspeito.fotoUrl ? (
          <img 
            src={suspeito.fotoUrl} 
            alt={suspeito.nome} 
            className="suspect-photo"
          />
        ) : (
          <div className="suspect-photo-fallback">
            <User size={48} />
          </div>
        )}
        <div className="suspect-id">
          ID: {suspeito.id}
        </div>
      </div>

      <div className="suspect-info">
        <div className="suspect-header">
          <div>
            <h3 className="suspect-name">{suspeito.nome}</h3>
            {suspeito.alcunha && (
              <p className="suspect-alias">Vulgo: {suspeito.alcunha}</p>
            )}
          </div>
          <div className="suspect-location">
            <MapPin size={14} />
            <span>{suspeito.ultimaVisto}</span>
          </div>
        </div>

        <div className="suspect-grid">
          <div className="info-section">
            <h4>
              <div className="dot-blue" />
              Características Físicas
            </h4>
            <ul>
              {suspeito.caracteristicas.map((c, i) => (
                <li key={i}>
                  <span className="text-secondary" style={{ textTransform: 'capitalize' }}>{c.tipo}: </span>
                  {c.descricao}
                </li>
              ))}
            </ul>
          </div>
          <div className="info-section">
            <h4>
              <div className="dot-red" />
              Relatórios Associados
            </h4>
            <ul>
              {suspeito.relatorios.slice(0, 2).map((r, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.25rem' }}>
                  <FileText size={14} className="text-secondary" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{r.titulo}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 0.5rem' }}>
        <ChevronRight size={24} className="text-secondary" />
      </div>
    </div>
  );
};
