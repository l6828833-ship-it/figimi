"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Surface the real error in the browser console so the exact cause can be diagnosed.
    // The production overlay only shows a generic message and this digest.
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="shell error-page" role="alert">
      <h1>Something went wrong</h1>
      <p>This page hit an unexpected error. You can try again, and if it keeps happening, head back to the home page.</p>
      {error.digest && <p style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Reference: {error.digest}</p>}
      <div className="convert-actions" style={{ justifyContent: "center" }}>
        <button className="button primary" onClick={reset}><RotateCcw size={17} />Try again</button>
        <Link className="button secondary" href="/">Back to home</Link>
      </div>
    </div>
  );
}
