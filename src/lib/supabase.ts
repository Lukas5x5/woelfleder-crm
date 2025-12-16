import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mlsievbmxhngkkvppeyv.supabase.co';
const supabaseAnonKey = 'sb_publishable_gb9QeJX848UgDl19ypJXeg_yrBzOMXg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
