import Link from "next/link";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { toolCategories, tools } from "@/lib/tools";
import { HeaderNav } from "./header-nav";

const groups = toolCategories.map((category) => ({ category, items: tools.filter((tool) => tool.category === category).map((tool) => ({ slug: tool.slug, name: tool.name })) }));

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label={`${siteConfig.name} home`}><span className="brand-mark"><Sparkles size={20} /></span>{siteConfig.name}</Link>
        <HeaderNav groups={groups} />
      </div>
    </header>
  );
}
