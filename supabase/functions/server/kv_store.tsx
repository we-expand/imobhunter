import { createClient } from "jsr:@supabase/supabase-js@2";
const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
export async function get(key: string) { const { data } = await supabase.from("kv_store_9e4b8b7c").select("value").eq("key", key).single(); return data?.value || null; }
export async function set(key: string, value: any) { await supabase.from("kv_store_9e4b8b7c").upsert({ key, value }); }
export async function del(key: string) { await supabase.from("kv_store_9e4b8b7c").delete().eq("key", key); }
export async function mget(keys: string[]) { const { data } = await supabase.from("kv_store_9e4b8b7c").select("value").in("key", keys); return data?.map(d => d.value) || []; }
export async function mset(items: Record<string, any>) { const entries = Object.entries(items).map(([key, value]) => ({ key, value })); await supabase.from("kv_store_9e4b8b7c").upsert(entries); }
export async function mdel(keys: string[]) { await supabase.from("kv_store_9e4b8b7c").delete().in("key", keys); }
export async function getByPrefix(prefix: string) { const { data } = await supabase.from("kv_store_9e4b8b7c").select("value").like("key", `${prefix}%`); return data?.map(d => d.value) || []; }
