import { createClient } from '@supabase/supabase-js';

export let supabase: any;

const useSqlite = (process.env.USE_SQLITE || 'false').toLowerCase() === 'true';
if (useSqlite) {
  // Lazy require to avoid loading the WASM adapter at build time
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const sqliteClient = require('./sqliteClient.js');
  supabase = sqliteClient;
} else {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jhwjabgqcmrgtkuselyr.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    // Do not embed secrets in source. If no key is provided the client will still be created,
    // but Supabase calls may fail and the codebase falls back to in-memory demo data.
    // eslint-disable-next-line no-console
    console.warn('Supabase key not found in environment variables. Using in-memory demo data as fallback.');
  }

  supabase = createClient(supabaseUrl, supabaseKey || '');
}
