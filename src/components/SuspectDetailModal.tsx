import React from 'react';
import type { Suspeito } from '../types';
import { X, MapPin, User, FileText } from 'lucide-react';

interface SuspectDetailModalProps {
  suspeito: Suspeito;
  onClose: () => void;
}

export const SuspectDetailModal: React.FC<SuspectDetailModalProps> = ({ suspeito, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content surface" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-photo-container">
            {suspeito.fotoUrl ? (
              <img src={suspeito.fotoUrl} alt={suspeito.nome} />
            ) : (
              <div className="modal-photo-fallback">
                <User size={64} />
              </div>
            )}
          </div>
          <div className="modal-header-info">
            <h2>{suspeito.nome}</h2>
            {suspeito.alcunha && (
              <p className="text-secondary" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                Vulgo: {suspeito.alcunha}
              </p>
            )}
            <div className="badge" style={{ display: 'inline-flex', marginTop: '0.5rem' }}>
              ID: {suspeito.id}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: 'var(--text-secondary)' }}>
              <MapPin size={16} />
              <span>Último avistamento: {suspeito.ultimaVisto}</span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <div className="info-section" style={{ backgroundColor: 'var(--bg-base)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <div className="dot-blue" />
              Características Físicas e Perfil
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {suspeito.caracteristicas.map((c, i) => (
                <li key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="text-xs font-bold uppercase text-secondary">{c.tipo}</span>
                  <span>{c.descricao}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="info-section" style={{ marginTop: '2rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <div className="dot-red" />
              Relatórios e Inquéritos Associados
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {suspeito.relatorios.map((r, i) => (
                <div key={i} className="surface" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                      <FileText size={18} className="text-secondary" />
                      {r.titulo}
                    </h4>
                    <span className="text-xs text-secondary">{r.data}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    {r.conteudo}
                  </p>
                  <div className="text-xs font-bold uppercase text-secondary">
                    Fonte: {r.fonte}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
