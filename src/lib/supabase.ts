// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://echicvonatdpggxzhlfe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjaGljdm9uYXRkcGdneHpobGZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMzUwOTUsImV4cCI6MjA2MDkxMTA5NX0.xnidn7mBvSa4tQRpNs5YLv81mzuF3Zrz2QctsuI1SPQ';

export const supabase = createClient(supabaseUrl, supabaseKey);