import { createClient } from "@supabase/supabase-js";

export type QrCode = {
  id: string;
  code: string;
  name: string;
  destination: string;
  is_active: boolean;
  fg_color: string;
  bg_color: string;
  size: number;
  created_at: string;
  updated_at: string;
};

export type Scan = {
  id: string;
  qr_code_id: string;
  scanned_at: string;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceKey = process.env.SUPABASE_SERVICE_KEY ?? anonKey;

// Server-side client — uses service key, bypasses RLS
export function createSupabaseClient() {
  return createClient(url, serviceKey);
}

// Client-side client — uses anon key
export function createSupabasePublicClient() {
  return createClient(url, anonKey);
}
