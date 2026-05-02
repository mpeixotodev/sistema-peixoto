import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ognejpaoeqdtraafjbvt.supabase.co';
// Using the anon key from .env.local
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdWJhc2UiLCJyZWYiOiJvZ25lanBhb2VxZHRyYWFmamJ2dCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE0NTY2NjgxLCJleHAiOjIwMzA2NjI2ODF9.Kq1X_p_V_0_z_V_0_z_V_0_z_V_0_z_V_0_z';

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearDB() {
  console.log("Deletando dados de relatorios...");
  await supabase.from('relatorios').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Deletando dados de suspeitos...");
  await supabase.from('suspeitos').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  
  console.log("Banco limpo!");
}

clearDB();
