import type { Suspeito, Relatorio } from './types';

export const initialRelatorios: Relatorio[] = [
  {
    id: 'r1',
    titulo: 'Ocorrência #4521 - Tráfico de Entorpecentes',
    conteudo: 'Suspeito avistado em local de venda de drogas. Possui identificação visual clara: nome de mulher (Maria) tatuado no braço.',
    data: '2026-04-20',
    fonte: 'BO 22ª Delegacia'
  },
  {
    id: 'r2',
    titulo: 'Inquérito Civil #88/2026',
    conteudo: 'O indivíduo Ricardo, conhecido como Rick, foi identificado por testemunhas. O diferencial é uma tatuagem grande de peixe (carpa) que cobre as costas.',
    data: '2026-03-15',
    fonte: 'DHPP'
  }
];

export const initialSuspeitos: Suspeito[] = [
  {
    id: '1',
    nome: 'José Carlos da Silva',
    alcunha: 'Zeca',
    ultimaVisto: 'Salvador, BA - 20/04/2026',
    caracteristicas: [
      { tipo: 'tatuagem', descricao: 'Tatuagem com o nome "Maria" no antebraço direito' },
      { tipo: 'cicatriz', descricao: 'Cicatriz profunda na bochecha esquerda' },
      { tipo: 'fisico', descricao: 'Aproximadamente 1,75m, pele parda' }
    ],
    relatorios: [initialRelatorios[0]]
  },
  {
    id: '2',
    nome: 'Ricardo Oliveira Ramos',
    alcunha: 'Rick',
    ultimaVisto: 'Feira de Santana, BA - 15/03/2026',
    caracteristicas: [
      { tipo: 'tatuagem', descricao: 'Desenho de uma carpa nas costas' },
      { tipo: 'fisico', descricao: 'Olhos claros, cabelo raspado' }
    ],
    relatorios: [initialRelatorios[1]]
  }
];

// Simulando a extração do relatório RIC Triplo Homicídio Monte Serrat
export const extractRICMonteSerrat = (): { novoRelatorio: Relatorio, novosSuspeitos: Suspeito[] } => {
  const novoRelatorio: Relatorio = {
    id: 'r_ric_monte_serrat',
    titulo: 'RIC - Triplo Homicídio Monte Serrat (IP Nº 87018/2025)',
    conteudo: 'Relatório de Investigação Criminal sobre o triplo homicídio na Rua Monte Serrat. O imóvel era utilizado para o tráfico de drogas. Vítimas identificadas com envolvimento criminal: Henrique Silva Santos, Douglas Souza de Jesus e Eduarda Rodrigues dos Santos (suspeita de traição ao CV). Múltiplos suspeitos e executores identificados através de denúncias, câmeras e análise de campo.',
    data: '2025-09-02',
    fonte: 'Delegacia Territorial de Eunápolis'
  };

  const novosSuspeitos: Suspeito[] = [
    // Vítimas com envolvimento criminal
    {
      id: 'v1_eduarda',
      nome: 'Eduarda Rodrigues dos Santos',
      alcunha: 'Duda',
      ultimaVisto: 'Rua São Lourenço, Santa Lúcia, Eunápolis',
      caracteristicas: [
        { tipo: 'outros', descricao: 'Vítima de decapitação' },
        { tipo: 'outros', descricao: 'Envolvimento: Organização Criminosa Comando Vermelho (CV)' },
        { tipo: 'outros', descricao: 'Mensagem "foi pra laranjada" deixada pelos autores' }
      ],
      relatorios: [novoRelatorio]
    },
    {
      id: 'v2_henrique',
      nome: 'Henrique Silva Santos',
      ultimaVisto: 'Rua Monte Serrat, Santa Lúcia, Eunápolis',
      caracteristicas: [
        { tipo: 'fisico', descricao: 'Múltiplas perfurações de arma de fogo' },
        { tipo: 'outros', descricao: 'Envolvimento: Tráfico de Drogas no imóvel' },
        { tipo: 'outros', descricao: 'Vítima de duplo homicídio no local' }
      ],
      relatorios: [novoRelatorio]
    },
    {
      id: 'v3_douglas',
      nome: 'Douglas Souza de Jesus',
      ultimaVisto: 'Rua Monte Serrat, Santa Lúcia, Eunápolis',
      caracteristicas: [
        { tipo: 'fisico', descricao: 'Múltiplas perfurações de arma de fogo' },
        { tipo: 'outros', descricao: 'Envolvimento: Tráfico de Drogas no imóvel' },
        { tipo: 'outros', descricao: 'Faca cravada na região ocular' }
      ],
      relatorios: [novoRelatorio]
    },
    // Suspeitos extraídos das múltiplas fotos do relatório (Páginas 05, 07, 08, 10, 11, 12, 13)
    {
      id: 's1_wesley',
      nome: 'Wesley Santos Silva',
      alcunha: 'Gordinho / Léo',
      ultimaVisto: 'Santa Lúcia, Eunápolis',
      caracteristicas: [
        { tipo: 'tatuagem', descricao: 'Tatuagem tribal no braço esquerdo' },
        { tipo: 'fisico', descricao: 'Estatura mediana, porte físico forte' },
        { tipo: 'outros', descricao: 'Suspeito de execução' }
      ],
      relatorios: [novoRelatorio]
    },
    {
      id: 's2_marcos',
      nome: 'Marcos Vinícius Alves',
      alcunha: 'Marquinhos',
      ultimaVisto: 'Bairro Alecrim, Eunápolis',
      caracteristicas: [
        { tipo: 'cicatriz', descricao: 'Cicatriz no supercílio direito' },
        { tipo: 'outros', descricao: 'Identificado em câmeras de segurança' }
      ],
      relatorios: [novoRelatorio]
    },
    {
      id: 's3_felipe',
      nome: 'Felipe Ribeiro Costa',
      alcunha: 'Felipinho',
      ultimaVisto: 'Eunápolis - BA',
      caracteristicas: [
        { tipo: 'tatuagem', descricao: 'Tatuagem de palhaço na panturrilha' },
        { tipo: 'fisico', descricao: 'Alto e magro' },
        { tipo: 'outros', descricao: 'Forneceu as armas cal. 5.56 e 9mm' }
      ],
      relatorios: [novoRelatorio]
    },
    {
      id: 's4_carlos',
      nome: 'Carlos Eduardo Mendes',
      alcunha: 'Cadu',
      ultimaVisto: 'Santa Lúcia, Eunápolis',
      caracteristicas: [
        { tipo: 'fisico', descricao: 'Magro, cabelo raspado' },
        { tipo: 'outros', descricao: 'Participou da emboscada' }
      ],
      relatorios: [novoRelatorio]
    },
    {
      id: 's5_igor',
      nome: 'Igor Ferreira Nogueira',
      alcunha: 'Cicatriz',
      ultimaVisto: 'Eunápolis - BA',
      caracteristicas: [
        { tipo: 'cicatriz', descricao: 'Grande cicatriz de queimadura no pescoço' },
        { tipo: 'outros', descricao: 'Líder local da facção rival' }
      ],
      relatorios: [novoRelatorio]
    }
  ];

  return { novoRelatorio, novosSuspeitos };
};
