import { getSiteSettings } from "@/lib/data";
export const revalidate = 300;
export async function GET() { const settings = await getSiteSettings(), id = settings.adsense_client_id || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "", publisher = id.replace(/^ca-/, ""); const body = publisher ? `google.com, ${publisher}, DIRECT, f08c47fec0942fa0\n` : "# Configure an AdSense client ID in the admin panel before serving ads.\n"; return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, s-maxage=300" } }); }
