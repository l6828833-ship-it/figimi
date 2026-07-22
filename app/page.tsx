import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ToolBrowser } from "@/components/tool-browser";
import { BlogCard } from "@/components/blog-card";
import { getPublishedPosts } from "@/lib/data";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPublishedPosts(3);
  return <><section className="hero"><div className="hero-glow" /><div className="shell hero-inner"><span className="pill"><Zap size={14} /> Fast, free, no sign-up</span><h1>Simple tools.<br /><em>Powerful results.</em></h1><p>Count words, compare text, convert documents, and create perfect color palettes—right from your browser.</p><div className="hero-actions"><Link className="button primary" href="#tools">Explore all tools <ArrowRight size={18} /></Link><Link className="button secondary" href="/tools/word-counter">Try Word Counter</Link></div><div className="trust-row"><span><CheckCircle2 />Always free</span><span><LockKeyhole />Privacy focused</span><span><Zap />Lightning fast</span></div></div></section><div className="shell"><AdSlot slot="home-header" /><ToolBrowser /></div><section className="why"><div className="shell"><div className="center-heading"><span className="eyebrow">Built around you</span><h2>Useful tools without the friction</h2><p>We keep every workflow direct, accessible, and transparent.</p></div><div className="benefit-grid"><article><Zap /><h3>Fast by design</h3><p>Lean pages and route-level code splitting keep interactions responsive on mobile and desktop.</p></article><article><ShieldCheck /><h3>Privacy first</h3><p>Text tools run locally. Conversion files are isolated and removed within one hour.</p></article><article><Clock3 /><h3>No account needed</h3><p>Open a tool and get to work. No registration, subscriptions, or artificial wait screens.</p></article></div></div></section>{posts.length > 0 && <section className="home-blog"><div className="shell"><div className="section-heading"><div><span className="eyebrow">From the blog</span><h2>Guides and tips</h2><p>Practical articles to help you get more from every tool.</p></div><Link className="button secondary" href="/blog">View all posts <ArrowRight size={18} /></Link></div><div className="blog-grid">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div></div></section>}</>;
}
