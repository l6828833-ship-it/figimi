import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { AdSlot } from "./ad-slot";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell"><AdSlot slot="footer" className="footer-ad" />
        <div className="footer-grid"><div><strong>{siteConfig.name}</strong><p>Figimi is a growing collection of fast, free online tools for text, documents, images, and color. Count words, convert files, pull text out of images, and build color palettes right in your browser — and your uploads are cleaned from our system within an hour.</p></div>
          <nav aria-label="Footer tools"><strong>Tools</strong><Link href="/tools/word-counter">Word Counter</Link><Link href="/tools/pdf-to-word">PDF to Word</Link><Link href="/tools/color-wheel">Color Wheel</Link></nav>
          <nav aria-label="Footer company"><strong>Company</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/blog">Blog</Link></nav>
          <nav aria-label="Footer legal"><strong>Legal</strong><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-of-service">Terms of Service</Link></nav>
        </div><div className="footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span>Your files are cleaned from the system in one hour.</span></div>
      </div>
    </footer>
  );
}
