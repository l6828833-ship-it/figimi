import type { BlogPost, SiteSettings } from "@/types";

export const seedPost: BlogPost = {
  id: "00000000-0000-0000-0000-000000000001", title: "How to Improve Your Writing with a Word Counter", slug: "improve-writing-with-word-counter", meta_description: "Learn how word count, sentence length, reading time, and keyword density can make your writing clearer and more useful.", featured_image: null, featured_image_alt: "Writer reviewing article statistics", category: "Writing", tags: ["word count", "writing", "productivity"], author: "Figimi Editorial", status: "published", published_at: "2026-01-15T09:00:00.000Z", created_at: "2026-01-15T09:00:00.000Z", updated_at: "2026-01-15T09:00:00.000Z", seo_title: "How to Use a Word Counter to Improve Writing", og_image: null,
  body: `A word counter can do much more than confirm that an essay meets a limit. Used thoughtfully, the statistics reveal how a reader may experience your draft.

## Start with the purpose, not the number

Before cutting or adding words, decide what the page needs to achieve. A support answer should usually be direct. A tutorial can be longer when each section helps the reader complete a task. Word count is a constraint—not a quality score.

## Watch sentence and paragraph rhythm

Long sentences are not automatically difficult, but several in a row can make important instructions harder to scan. Mix short statements with more developed explanations. Paragraph totals also provide a quick signal: a long article with only two paragraphs will feel dense on a phone.

## Use reading time as a promise

An estimated reading time helps you evaluate the commitment you ask from visitors. If a simple answer takes eight minutes to reach, move the direct answer earlier and use clear headings for the detail that follows.

## Treat keyword density as a diagnostic

Frequent terms should appear naturally because they describe the subject. Do not repeat phrases simply to increase a percentage. Instead, use the density list to notice accidental repetition, missing vocabulary, and places where a precise synonym would improve the prose.

## Review the final draft aloud

Statistics point to possible problems; they cannot judge tone or meaning. Read the final version aloud, check names and claims, and make sure every paragraph earns its place. The best result is not a particular count. It is useful writing that respects the reader's time.`,
};

export const legalPages = {
  "privacy-policy": { title: "Privacy Policy", description: "How Figimi Tools handles text, uploaded files, analytics, advertising, and contact information.", body: `## Overview

We designed Figimi Tools to collect as little information as practical. Text entered into browser-based counters, capitalization, comparison, and color tools is processed locally and is not intentionally transmitted to our servers.

## File conversion and retention

Files submitted to a conversion tool are transferred over HTTPS and used only to perform the requested conversion. Processing occurs in an isolated temporary directory. Files are removed immediately after the response whenever possible and are automatically deleted no later than one hour after upload. We do not use uploaded documents for advertising, model training, or resale. Do not upload files you are not authorized to process.

## Website word counter

When you submit a public URL, our server requests that page to calculate readable text statistics. We block private network addresses. Submitted URLs may appear briefly in operational security logs but are not used to create a marketing profile.

## Analytics, advertising, and cookies

If enabled, Google Analytics, Google Tag Manager, and Google AdSense may set cookies or process limited device, usage, and approximate location information. Google and its partners may use cookies to serve or measure ads. You can manage cookies in your browser and use Google's advertising controls. The site remains usable when common advertising cookies are blocked.

## Supabase and service providers

We use Supabase for database, authentication, and media storage, and may use Cloudflare for security, content delivery, and performance. These providers process limited technical information under their own privacy terms.

## Data rights and contact

Depending on your location, you may request access, correction, or deletion of personal information we hold. Contact us through the Contact page. We may update this policy when the service changes. Last updated: July 22, 2026.` },
  "terms-of-service": { title: "Terms of Service", description: "Rules and conditions for using Figimi Tools and its free conversion services.", body: `## Acceptance and permitted use

By using Figimi Tools, you agree to these terms. You may use the service only for lawful purposes and only with content and files you own or are authorized to process. You must not probe, overload, automate abusive traffic against, or attempt to bypass the security limits of the service.

## No account or conversion guarantee

Public tools are provided without charge and may change or become temporarily unavailable. Conversions can lose formatting, formulas, fonts, metadata, or image quality. Always inspect the result before relying on it and keep your original file.

## Intellectual property

You retain rights to content you submit. You grant us only the limited permission needed to process the request and return the result. The site design, original editorial content, and software branding remain protected by applicable law.

## Disclaimer and limitation

The service is provided “as is” without warranties of accuracy, availability, or fitness for a particular purpose. To the extent permitted by law, we are not liable for indirect loss, lost data, or decisions made from tool output.

## Changes and contact

We may update these terms to reflect legal or product changes. Continued use after an update means you accept the revised terms. Questions can be sent through the Contact page. Last updated: July 22, 2026.` },
  about: { title: "About Us", description: "Why Figimi Tools builds fast, private, and accessible utilities for everyday digital work.", body: `## Useful software should feel simple

Figimi Tools is an independent collection of focused utilities for writers, students, designers, office teams, and anyone who needs to transform information without installing a large application.

Our approach is straightforward: explain what each tool does, show its limits, make the interface work on a phone, and avoid unnecessary registration. Browser-based tools keep text on your device. File tools use short-lived server processing and clear retention rules.

## Quality, privacy, and access

We test pages for keyboard use, readable structure, responsive layouts, and fast loading. We publish original guides that help visitors understand the work behind the button rather than offering empty tool pages. If a result matters to your business, studies, or records, we always recommend reviewing it against the original.

Have an idea or find a problem? Visit the Contact page. Practical feedback helps us decide what to improve next.` },
} as const;

export const seedSettings: SiteSettings = { analytics_id: "", adsense_client_id: "", google_tag_id: "", head_code: "", body_code: "" };
