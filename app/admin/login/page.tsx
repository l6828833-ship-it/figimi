import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) { const { error } = await searchParams; return <main className="login-page"><div className="login-panel"><Link className="brand" href="/"><span className="brand-mark"><Sparkles size={20} /></span>Figimi Tools</Link><span className="eyebrow">Protected area</span><h1>Admin sign in</h1><p>Manage public content, posts, media, metadata, and integrations.</p>{error === "unauthorized" && <div className="notice error">This account does not have admin access.</div>}<LoginForm /><Link className="back-link" href="/">← Return to website</Link></div></main>; }
