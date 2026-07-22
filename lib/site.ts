export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "Figimi Tools",
  shortName: "Figimi",
  description: "Fast, private, and free online text, document, image, and color tools.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@example.com",
  social: { x: process.env.NEXT_PUBLIC_X_URL || "" },
};

export const absoluteUrl = (path = "/") => `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
