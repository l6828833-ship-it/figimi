// Reopens the CookieYes consent banner so visitors can review, change, or
// withdraw their cookie/ad consent. CookieYes automatically binds a click
// handler to any element carrying the "cky-banner-element" class once its
// script (added via Admin -> Settings -> Head code) has loaded, so no custom
// JavaScript is required here.
export function CookiePreferences({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`cky-banner-element ${className}`.trim()}
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
