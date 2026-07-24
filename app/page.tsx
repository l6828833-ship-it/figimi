import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, LockKeyhole, ShieldCheck, Zap } from "lucide-react";
import { AdSlot } from "@/components/ad-slot";
import { ToolBrowser } from "@/components/tool-browser";
import { BlogCard } from "@/components/blog-card";
import { getPublishedPosts } from "@/lib/data";

export const revalidate = 300;

export default async function HomePage() {
  const posts = await getPublishedPosts(3);
  return <><section className="hero"><div className="hero-glow" /><div className="shell hero-inner"><span className="pill"><Zap size={14} /> Quick &amp; Easy</span><h1>Free Online Tools for <em>Text, PDF, Images &amp; Color</em></h1><p>{"All tools available directly from your browser — it's as simple as that!"}</p><div className="hero-actions"><Link className="button primary" href="#tools">Explore all tools <ArrowRight size={18} /></Link><Link className="button secondary" href="/tools/word-counter">Try Word Counter</Link></div><div className="trust-row"><span><CheckCircle2 />Always free</span><span><LockKeyhole />Focus on privacy.</span><span><Zap />Lightning fast</span></div></div></section><div className="shell"><AdSlot slot="home-header" /><ToolBrowser /></div><section className="why"><div className="shell"><div className="center-heading"><span className="eyebrow">Built around your needs.</span><h2>Fast, simple, frictionless tools.</h2><p>Every workflow is efficient and easy to follow.</p></div><div className="benefit-grid"><article><Zap /><h3>Fast by design</h3><p>Pages load quickly and routes are efficiently coded to load only the necessary elements.</p></article><article><ShieldCheck /><h3>Privacy first</h3><p>Text tools run locally. Your files are cleaned from the system in one hour.</p></article><article><Clock3 /><h3>No account needed</h3><p>No wait time, just open and go.</p></article></div></div></section>{posts.length > 0 && <section className="home-blog"><div className="shell"><div className="section-heading"><div><span className="eyebrow">From the blog</span><h2>Guides and tips</h2><p>Ideas that make your experience with our tools even better.</p></div><Link className="button secondary" href="/blog">View all posts <ArrowRight size={18} /></Link></div><div className="blog-grid">{posts.map((post) => <BlogCard key={post.id} post={post} />)}</div></div></section>}</>;
}
