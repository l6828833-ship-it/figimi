import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { RawSnippet } from "@/components/raw-snippet";
import { getSiteSettings } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} — Free Online Text & File Tools`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: siteConfig.name, title: siteConfig.name, description: siteConfig.description, url: "/" },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
};
export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light", themeColor: "#6957d9" };

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const adsense = settings.adsense_client_id || process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const tag = settings.analytics_id || settings.google_tag_id || process.env.NEXT_PUBLIC_GOOGLE_TAG_ID || process.env.NEXT_PUBLIC_GA_ID;
  const isGtm = tag?.startsWith("GTM-");
  return <html lang="en"><head>{adsense && <><meta name="adsense-client" content={adsense} /><Script async strategy="afterInteractive" crossOrigin="anonymous" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`} /></>}{tag && !isGtm && <><Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${tag}`} /><Script id="google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${tag}');`}</Script></>}{isGtm && <Script id="google-tag-manager" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f)})(window,document,'script','dataLayer','${tag}');`}</Script>}</head><body>{isGtm && <noscript><iframe src={`https://www.googletagmanager.com/ns.html?id=${tag}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} /></noscript>}<SiteHeader /><main>{children}</main><SiteFooter />{settings.head_code && <RawSnippet code={settings.head_code} target="head" />}{settings.body_code && <RawSnippet code={settings.body_code} target="body" />}</body></html>;
}
