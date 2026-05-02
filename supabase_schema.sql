-- Tabela de Relatórios
CREATE TABLE relatorios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  conteudo text NOT NULL,
  data text NOT NULL,
  fonte text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Suspeitos
CREATE TABLE suspeitos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  alcunha text,
  foto_url text,
  ultima_visto text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Características
CREATE TABLE caracteristicas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  suspeito_id uuid REFERENCES suspeitos(id) ON DELETE CASCADE,
  tipo text NOT NULL,
  descricao text NOT NULL
);

-- Tabela Associativa: Suspeitos <-> Relatórios (N:M)
CREATE TABLE suspeito_relatorio (
  suspeito_id uuid REFERENCES suspeitos(id) ON DELETE CASCADE,
  relatorio_id uuid REFERENCES relatorios(id) ON DELETE CASCADE,
  PRIMARY KEY (suspeito_id, relatorio_id)
);

-- Políticas de RLS (Para permitir leitura/escrita anônima durante o protótipo)
ALTER TABLE relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspeitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE caracteristicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE suspeito_relatorio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir tudo para anonimo em relatorios" ON relatorios FOR ALL USING (true);
CREATE POLICY "Permitir tudo para anonimo em suspeitos" ON suspeitos FOR ALL USING (true);
CREATE POLICY "Permitir tudo para anonimo em caracteristicas" ON caracteristicas FOR ALL USING (true);
CREATE POLICY "Permitir tudo para anonimo em suspeito_relatorio" ON suspeito_relatorio FOR ALL USING (true);
