import Link from "next/link";
import { ChevronDown, Menu, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { toolCategories } from "@/lib/tools";

const categoryAnchor = (category: string) => category.toLowerCase().replace(/\s+/g, "-");

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${siteConfig.name} home`}><span className="brand-mark"><Sparkles size={20} /></span>{siteConfig.name}</Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          <details className="nav-dropdown">
            <summary>Tools <ChevronDown size={15} /></summary>
            <div className="dropdown-panel">
              <Link href="/#tools">All tools</Link>
              {toolCategories.map((category) => <Link key={category} href={`/#${categoryAnchor(category)}`}>{category}</Link>)}
            </div>
          </details>
          <Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
        </nav>
        <details className="mobile-menu"><summary aria-label="Open navigation"><Menu /></summary><nav><Link href="/#tools">All tools</Link>{toolCategories.map((category) => <Link key={category} href={`/#${categoryAnchor(category)}`}>{category}</Link>)}<Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav></details>
      </div>
    </header>
  );
}
