import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder-key';

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  /* eslint-disable no-console */
  console.warn('[WARNING] Supabase environment variables (SUPABASE_URL, SUPABASE_KEY) are missing. File uploads will fail.');
  /* eslint-enable no-console */
}

export const supabase = createClient(supabaseUrl, supabaseKey);
