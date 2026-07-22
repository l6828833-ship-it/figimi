"use client";

import { useEffect, useState } from "react";

declare global { interface Window { adsbygoogle?: Record<string, unknown>[] } }

export function AdSlot({ slot, format = "auto", className = "" }: { slot: string; format?: string; className?: string }) {
  const [client, setClient] = useState(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "");
  useEffect(() => {
    const configured = document.querySelector<HTMLMetaElement>('meta[name="adsense-client"]')?.content || client;
    if (configured !== client) { setClient(configured); return; }
    if (!configured) return;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch { /* Ad blockers can reject initialization. */ }
  }, [client, slot]);

  return (
    <aside className={`ad-slot ${className}`} aria-label="Advertisement">
      {client ? (
        <ins className="adsbygoogle" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format={format} data-full-width-responsive="true" />
      ) : <span>Advertisement</span>}
    </aside>
  );
}
