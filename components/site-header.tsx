import Link from "next/link";
import { Menu, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${siteConfig.name} home`}><span className="brand-mark"><Sparkles size={20} /></span>{siteConfig.name}</Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          <Link href="/#tools">Tools</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
        </nav>
        <details className="mobile-menu"><summary aria-label="Open navigation"><Menu /></summary><nav><Link href="/#tools">Tools</Link><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav></details>
      </div>
    </header>
  );
}
