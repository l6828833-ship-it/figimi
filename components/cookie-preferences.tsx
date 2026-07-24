"use client";

// Reopens Google's Consent Management Platform (Funding Choices / Privacy &
// messaging) dialog so visitors can review or change their cookie choices.
// `googlefc.showRevocationMessage()` becomes available once the Google CMP
// message is published in the AdSense dashboard and loaded on the page.
declare global {
  interface Window {
    googlefc?: {
      showRevocationMessage?: () => void;
      callbackQueue?: unknown[];
    };
  }
}

export function CookiePreferences({ className = "" }: { className?: string }) {
  const openPreferences = () => {
    const fc = typeof window !== "undefined" ? window.googlefc : undefined;
    if (fc && typeof fc.showRevocationMessage === "function") {
      fc.showRevocationMessage();
    } else {
      // The CMP has not loaded (e.g. blocked, or the visitor's region shows no
      // consent message). Fall back gracefully instead of doing nothing.
      window.alert(
        "Cookie preferences are managed by our consent tool, which is currently unavailable. Please disable any ad/script blockers and try again."
      );
    }
  };

  return (
    <button
      type="button"
      className={`cookie-preferences-link ${className}`.trim()}
      onClick={openPreferences}
      style={{
        background: "none",
        border: 0,
        padding: 0,
        margin: 0,
        font: "inherit",
        color: "inherit",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      Manage cookie preferences
    </button>
  );
}
