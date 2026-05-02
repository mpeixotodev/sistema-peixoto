import React, { useState } from 'react';
import { FileUp, FileText, CheckCircle2, Loader2, Sparkles, Users } from 'lucide-react';
import type { Suspeito } from '../types';
import { extractImagesFromPDF, extractTextFromPDF } from '../utils/pdfExtractor';
import mammoth from 'mammoth';

interface DocumentIngestionProps {
  onIngest: (novosSuspeitos: Suspeito[]) => void;
}

export const DocumentIngestion: React.FC<DocumentIngestionProps> = ({ onIngest }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extraidos, setExtraidos] = useState<number>(0);
  const [fotosExtraidas, setFotosExtraidas] = useState<number>(0);

  const handleUpload = async () => {
    if (!file && !fileName) return; 
    setStatus('processing');
    
    try {
      let extractedImages: string[] = [];
      let rawText = "Nenhum texto extraído.";
      
      if (file) {
        if (file.type === 'application/pdf') {
          extractedImages = await extractImagesFromPDF(file);
          rawText = await extractTextFromPDF(file);
        } else if (file.name.endsWith('.docx')) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          rawText = result.value;
        } else if (file.type === 'text/plain') {
          rawText = await file.text();
        }
      }

      // Simula o tempo de processamento da IA
      setTimeout(() => {
        const novoRelatorio = {
          id: 'r_' + Date.now(),
          titulo: fileName ? `Análise: ${fileName}` : 'Relatório sem título',
          conteudo: rawText ? (rawText.substring(0, 10000) + '...') : "Conteúdo não disponível.", // limita tamanho
          data: new Date().toISOString().split('T')[0],
          fonte: 'Upload Manual - ' + (fileName || '')
        };

        const novosSuspeitos: Suspeito[] = [
          {
            id: 's_' + Date.now(),
            nome: 'Suspeito Extraído de: ' + (fileName || 'Desconhecido'),
            alcunha: 'Extração Automática',
            ultimaVisto: 'Desconhecido',
            fotoUrl: extractedImages.length > 0 ? extractedImages[0] : undefined,
            caracteristicas: [
              { tipo: 'outros', descricao: 'Suspeito indexado automaticamente a partir de arquivo upado.' }
            ],
            relatorios: [novoRelatorio]
          }
        ];

        setExtraidos(novosSuspeitos.length);
        setFotosExtraidas(extractedImages.length);
        onIngest(novosSuspeitos);
        setStatus('completed');
      }, 1500);
      
    } catch (error) {
      console.error("Erro na ingestão:", error);
      alert("Erro ao processar o arquivo. Veja o console.");
      setStatus('idle');
    }
  };

  return (
    <div>
      <div className="search-header" style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <FileUp style={{ color: 'var(--accent-blue)' }} />
          Ingestão de Dados
        </h2>
        <p className="text-secondary">
          Suba arquivos de texto (.docx, .pdf, .txt) para extrair o conteúdo e criar registros automaticamente.
        </p>
      </div>

      <div className="upload-grid">
        <div className="drop-zone" onClick={() => document.getElementById('fileInput')?.click()}>
          <input 
            id="fileInput"
            type="file" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                setFileName(e.target.files[0].name);
                setStatus('idle');
              }
            }}
            accept=".doc,.docx,.pdf,.txt"
            style={{ display: 'none' }}
          />
          <div className="icon-circle">
            <FileText size={32} />
          </div>
          <p style={{ fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.5rem', color: fileName ? 'var(--accent-blue)' : 'var(--text-primary)' }}>
            {fileName ? fileName : 'Toque ou clique para selecionar seu arquivo'}
          </p>
          <p className="text-secondary text-sm">
            Formatos aceitos: DOCX, PDF, TXT
          </p>
        </div>

        <div className="surface processing-panel">
          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Sparkles size={20} style={{ color: 'var(--accent-blue)' }} />
              Status de Processamento (IA)
            </h3>
            
            <div className="status-box">
              {status === 'idle' && (
                <p className="text-sm text-secondary">Aguardando envio do arquivo para leitura de texto estrutural.</p>
              )}

              {status === 'processing' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-blue)', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
                    <span>Processando documento...</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: '80%', transition: 'width 3s' }} />
                  </div>
                  <p className="text-xs text-secondary" style={{ marginTop: '0.5rem' }}>
                    Extraindo texto real do arquivo e estruturando informações...
                  </p>
                </div>
              )}

              {status === 'completed' && (
                <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    <CheckCircle2 size={18} />
                    <span>Processamento Concluído</span>
                  </div>
                  <ul className="text-sm" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={16} style={{ color: '#22c55e' }} />
                      <span><strong>{extraidos}</strong> indivíduo cadastrado a partir do arquivo</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} style={{ color: '#22c55e' }} />
                      <span><strong>{fotosExtraidas}</strong> fotos extraídas do documento</span>
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={16} style={{ color: '#22c55e' }} />
                      <span>Texto inserido no Relatório e associado com sucesso!</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleUpload}
            disabled={!fileName || status === 'processing' || status === 'completed'}
            className={`btn ${(!fileName || status === 'processing' || status === 'completed') ? 'btn-ghost' : 'btn-primary'}`}
            style={{ width: '100%', padding: '1rem', marginTop: '2rem', opacity: (!fileName || status === 'processing' || status === 'completed') ? 0.5 : 1 }}
          >
            {status === 'processing' ? 'EXTRAINDO TEXTO...' : status === 'completed' ? 'SUCESSO' : 'INICIAR EXTRAÇÃO'}
          </button>
        </div>
      </div>
    </div>
  );
};
