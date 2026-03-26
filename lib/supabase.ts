import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,   // 세션을 로컬 스토리지에 저장해서 유지함
    autoRefreshToken: true, // 토큰이 만료되기 전에 자동으로 갱신함
    detectSessionInUrl: true // 소셜 로그인 등을 할 때 URL에서 세션을 감지함
  }
});