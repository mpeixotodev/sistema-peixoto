import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log("Testing insert...");
  const { data, error } = await supabase
    .from('relatorios')
    .insert([{
      titulo: 'Teste',
      conteudo: 'Teste',
      data: '2026-05-01',
      fonte: 'Teste'
    }])
    .select();
    
  console.log("Data:", data);
  console.log("Error:", error);
}

testInsert();
