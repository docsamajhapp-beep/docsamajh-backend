import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_oOmcDbnvI7b7Z_bAPbr5VA_7SSsn7wR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
