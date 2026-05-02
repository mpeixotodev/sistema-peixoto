import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ognejpaoeqdtraafjbvt.supabase.co';
// Using the anon key from .env.local
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhc2UiLCJyZWYiOiJvZ25lanBhb2VxZHRyYWFmamJ2dCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE0NTY2NjgxLCJleHAiOjIwMzA2NjI2ODF9.Kq1X_p_V_0_z_V_0_z_V_0_z_V_0_z_V_0_z';

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
