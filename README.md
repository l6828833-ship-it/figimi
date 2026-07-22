# Figimi Tools

A production-oriented Next.js application for free text utilities, document/image conversion, an SEO blog, and a Supabase-backed admin CMS.

## Included

- Five browser/text tools, ten server-side file converters, and an interactive color wheel
- Static/ISR tool, blog, legal, sitemap, RSS, robots, and ads.txt routes
- Supabase Postgres, Auth, Row Level Security, and Storage media library
- Protected admin CRUD for blog scheduling, tool/site content, metadata, media, AdSense, Analytics, Google Tag Manager, and trusted custom JavaScript
- Responsive reserved ad regions, structured data, canonical metadata, and Cloudflare image loader
- Docker runtime with LibreOffice and Poppler for conversion workers

## Local setup

1. Use Node.js 20 or later (Node 22 is recommended).
2. Copy `.env.example` to `.env.local` and fill in the values.
3. Install dependencies with `npm install`.
4. Apply `supabase/migrations` and `supabase/seed.sql` to a Supabase project.
5. Run `npm run dev` and visit `http://localhost:3000`.

Without Supabase variables, public pages use built-in seed content. Admin routes require a configured Supabase project and service-role key. File converters also require LibreOffice and Poppler; using the included Dockerfile installs both.

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for Supabase, admin user, Node hosting, Cloudflare CDN, caching, image resizing, AdSense, and security steps.

## Validation

```bash
npm run lint
npm run typecheck
npm run build
```

Uploaded conversion files are processed in unique temporary directories and deleted in a `finally` block immediately after the response bytes are prepared. The public policy states the conservative maximum retention window of one hour.
