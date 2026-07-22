# Deployment guide

## 1. Provision Supabase

1. Create a Supabase project and record its Project URL, anon key, and service-role key from **Project Settings → API**.
2. Apply `supabase/migrations/202607220001_initial_schema.sql`, then `202607220002_auth_profile_trigger.sql`, using the Supabase CLI or SQL editor.
3. Apply `supabase/seed.sql`. It creates content for every tool, the required legal/about pages, one original sample article, and settings defaults.
4. Confirm that the public `media` Storage bucket exists. The migration creates it with a 5 MB image limit and JPG, PNG, WebP, and GIF MIME restrictions.
5. In **Authentication → Providers**, enable email/password. Disable public sign-ups unless they are needed for another product.

### Create the first administrator

Create a user in **Authentication → Users → Add user**. Supabase hashes the password; the application never stores raw passwords. The profile trigger creates an editor profile. Promote only a trusted account in the SQL editor:

```sql
update public.profiles
set role = 'admin', username = 'your-admin-username'
where id = (select id from auth.users where email = 'admin@example.com');
```

Use a long unique password and enable Supabase MFA if available for the project. The login action allows five failed attempts per identifier per 15 minutes on each application instance. Add the Cloudflare rate-limit rule below for distributed enforcement.

## 2. Configure environment variables

Copy `.env.example` into the host's secret manager. Required production values are:

- `NEXT_PUBLIC_SITE_URL`: canonical HTTPS origin, without a trailing slash.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only; never expose it in browser code or Cloudflare public variables.
- `NEXT_PUBLIC_CONTACT_EMAIL`.

Analytics, Google Tag, and AdSense IDs can be set in `/admin/settings` after launch. Environment values provide a fallback. Trusted custom head/body fields accept JavaScript without `<script>` wrappers and should be restricted to audited provider snippets.

## 3. Deploy the Node conversion host

The conversion endpoints need a persistent Node runtime with LibreOffice and Poppler binaries. A container host such as Render, Fly.io, Railway, Cloud Run, ECS, or a VPS is a better fit than a restricted serverless function runtime.

Build and run the supplied image:

```bash
docker build -t figimi-tools .
docker run --rm -p 3000:3000 --env-file .env figimi-tools
```

The image installs LibreOffice Writer/Calc/Impress, `pdftotext`, `pdftoppm`, and Liberation fonts. Allocate at least 1 GB RAM; 2 GB is safer for simultaneous office conversions. Set the platform request timeout to at least 180 seconds and request-body limit above 21 MB. The app enforces a 20 MB file total itself.

For higher conversion volume, move `convertFiles` calls to isolated queue workers (for example BullMQ/Redis) and return job status from the API. The current implementation already isolates each request in a random OS temp directory, invokes binaries without a shell, enforces process timeouts, validates extensions and magic bytes, and deletes the directory in `finally`.

Run these release checks on the deployment image:

```bash
npm run lint
npm run typecheck
npm run build
```

## 4. Put Cloudflare in front

### DNS and TLS

1. Add the domain to Cloudflare and point the host's `A`, `AAAA`, or `CNAME` record to the Node host.
2. Enable the orange-cloud proxy.
3. Set **SSL/TLS mode** to **Full (strict)** and install a valid origin certificate.
4. Enable **Always Use HTTPS**, **Automatic HTTPS Rewrites**, **Brotli**, **HTTP/2**, **HTTP/3 (QUIC)**, and **0-RTT** only if the host and risk policy allow it.

### Cache rules

Create rules in this order so the bypass rule wins:

1. **Bypass private and processing traffic**  
   Expression: `starts_with(http.request.uri.path, "/api/") or starts_with(http.request.uri.path, "/admin")`  
   Action: Bypass cache. Do not use Cache Everything. Conversion responses also send `private, no-store`.
2. **Immutable Next assets**  
   Expression: `starts_with(http.request.uri.path, "/_next/static/")`  
   Action: Cache eligible content, Edge TTL 1 year, Browser TTL respect origin. Filenames are content-hashed.
3. **Public images and media**  
   Match the chosen media hostname or public image path. Cache eligible content for one month or longer; Storage objects use immutable unique paths.
4. **Public HTML** (optional)  
   Match GET/HEAD requests excluding `/api/` and `/admin`. Respect origin headers or use an Edge TTL no longer than five minutes so ISR updates remain timely. Do not cache responses containing Supabase authentication cookies.

Purge the relevant URL after emergency editorial changes. Normal admin saves call Next.js path/tag revalidation; a long Cloudflare HTML TTL can still keep the old edge copy until expiry.

### Image resizing

Enable **Image Resizing → Transformations** for the zone and set `NEXT_PUBLIC_CLOUDFLARE_IMAGE_RESIZING=true`. The custom Next image loader then requests remote editorial images through `/cdn-cgi/image/format=auto,fit=scale-down,...`, allowing Cloudflare to select AVIF/WebP and responsive widths. Keep it `false` locally.

For Supabase media behind a dedicated hostname, proxy that hostname through Cloudflare, route it to the Supabase public Storage origin, and set `NEXT_PUBLIC_MEDIA_CDN_URL` to the public bucket prefix. Ensure the path mapping is tested before editors publish URLs.

### WAF and rate limiting

- Enable managed Cloudflare rules and bot protection appropriate for the plan.
- Rate-limit `/admin/login` to approximately 10 requests per minute per IP, with a managed challenge or temporary block.
- Rate-limit `POST /api/convert/*` to a sustainable value (for example 10 requests per 10 minutes per IP), and cap concurrent work at the hosting layer.
- Rate-limit `POST /api/website-word-count` to prevent proxy abuse.
- Do not create a cache rule that ignores query/cookie variation on admin or API paths.

## 5. Analytics, AdSense, and editorial launch

1. Sign in at `/admin/login` and set Analytics, Google Tag Manager/Google tag, and AdSense IDs under **Settings & codes**.
2. Replace placeholder contact/domain values, review Privacy Policy and Terms for the actual legal entity and jurisdiction, and have qualified counsel review them where necessary.
3. Verify `/ads.txt`, `/robots.txt`, `/sitemap.xml`, and `/rss.xml` on the public domain.
4. Add a valid AdSense site and wait for review before inserting production slot IDs. Reserved ad containers have fixed minimum heights to reduce CLS and are labeled as advertisements.
5. Publish additional original articles and review each tool explanation. AdSense approval is discretionary; technical compliance does not guarantee approval.
6. Test keyboard navigation, 320 px mobile layouts, conversion errors, scheduled publishing, media alt text, and Core Web Vitals in production.

## Operations and retention

Conversion data is kept only in OS temporary storage and deleted immediately after response preparation, which is stricter than the stated one-hour maximum. If a queue or object store is added later, configure a lifecycle rule that hard-deletes source and output objects within one hour and monitor deletion failures. Do not log document contents. Rotate Supabase service keys after suspected disclosure and keep the service role only on the server.
