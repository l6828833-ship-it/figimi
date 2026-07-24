import { Save } from "lucide-react";
import { saveSettingsAction } from "@/app/admin/actions";
import { createAdminClient } from "@/lib/supabase/admin";
import { seedSettings } from "@/lib/seed";
import type { SiteSettings } from "@/types";

export const dynamic = "force-dynamic";

// Read the authoritative, uncached settings via the service-role client so the
// edit form always shows what is actually stored. Reading through the public
// (anon) cached path could show empty values and cause an accidental overwrite
// of all settings when the admin saves.
async function getEditableSettings(): Promise<SiteSettings> {
  try {
    const { data } = await createAdminClient().from("site_settings").select("analytics_id,adsense_client_id,google_tag_id,head_code,body_code").eq("id", 1).maybeSingle();
    return (data as SiteSettings | null) ?? seedSettings;
  } catch {
    return seedSettings;
  }
}

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) { const query = await searchParams, settings = await getEditableSettings(); return <><div className="admin-heading"><div><span className="eyebrow">Integrations</span><h1>Settings & codes</h1><p>Changes revalidate the shared site layout. Environment variables remain the preferred production fallback.</p></div></div>{query.saved && <div className="notice success">Settings saved.</div>}{query.error && <div className="notice error">{decodeURIComponent(query.error)}</div>}<form action={saveSettingsAction} className="admin-form wide"><div className="form-grid"><label>Google Analytics measurement ID<input name="analytics_id" defaultValue={settings.analytics_id} placeholder="G-XXXXXXXXXX" /></label><label>Google Tag Manager / Google tag ID<input name="google_tag_id" defaultValue={settings.google_tag_id} placeholder="GTM-XXXXXXX or G-XXXXXXXXXX" /></label><label className="span-2">Google AdSense publisher/client ID<input name="adsense_client_id" defaultValue={settings.adsense_client_id} placeholder="ca-pub-0000000000000000" /></label><label className="span-2">Custom head code<textarea className="code-field" name="head_code" rows={8} defaultValue={settings.head_code} placeholder={"Paste a provider snippet — full <script> tags, pixels, and meta tags are supported.\nBare JavaScript (no tags) also works."} /><small>Injected into the page head. Paste code only from providers you trust.</small></label><label className="span-2">Custom body code<textarea className="code-field" name="body_code" rows={8} defaultValue={settings.body_code} placeholder={"Paste a provider snippet — full <script> tags and pixels are supported.\nBare JavaScript (no tags) also works."} /><small>Injected at the end of the page body. Only administrators can change this field.</small></label></div><div className="form-submit"><button className="button primary"><Save size={17} />Save settings</button></div></form></>; }
