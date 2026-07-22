import Link from "next/link";
import { ChevronDown, Menu, Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { toolCategories, tools } from "@/lib/tools";

const toolsByCategory = toolCategories.map((category) => ({ category, items: tools.filter((tool) => tool.category === category) }));

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${siteConfig.name} home`}><span className="brand-mark"><Sparkles size={20} /></span>{siteConfig.name}</Link>
        <nav aria-label="Main navigation" className="desktop-nav">
          {toolsByCategory.map(({ category, items }) => (
            <details className="nav-dropdown" key={category}>
              <summary>{category} <ChevronDown size={15} /></summary>
              <div className="dropdown-panel">
                {items.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`}>{tool.name}</Link>)}
              </div>
            </details>
          ))}
          <Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
        </nav>
        <details className="mobile-menu">
          <summary aria-label="Open navigation"><Menu /></summary>
          <nav>
            {toolsByCategory.map(({ category, items }) => (
              <div className="mobile-group" key={category}>
                <strong>{category}</strong>
                {items.map((tool) => <Link key={tool.slug} href={`/tools/${tool.slug}`}>{tool.name}</Link>)}
              </div>
            ))}
            <div className="mobile-group"><Link href="/blog">Blog</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></div>
          </nav>
        </details>
      </div>
    </header>
  );
}
