export type Caracteristica = {
  tipo: 'tatuagem' | 'cicatriz' | 'fisico' | 'outros';
  descricao: string;
}

export type Relatorio = {
  id: string;
  titulo: string;
  conteudo: string;
  data: string;
  fonte: string;
}

export type Suspeito = {
  id: string;
  nome: string;
  alcunha?: string;
  fotoUrl?: string;
  caracteristicas: Caracteristica[];
  relatorios: Relatorio[];
  ultimaVisto: string;
}

export type ConsultaBusca = {
  termo: string;
  filtros: {
    tatuagem: boolean;
    cicatriz: boolean;
    fisico: boolean;
  };
}

export const VERSION = '1.0.0';
