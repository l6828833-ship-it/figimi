import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { getContentPage } from "@/lib/data";
import { legalPages } from "@/lib/seed";

const slugs = Object.keys(legalPages) as (keyof typeof legalPages)[];
export const revalidate = 300;
export function generateStaticParams() { return slugs.map((legal) => ({ legal })); }
export async function generateMetadata({ params }: { params: Promise<{ legal: string }> }): Promise<Metadata> { const { legal } = await params; if (!slugs.includes(legal as keyof typeof legalPages)) return {}; const page = await getContentPage(legal as keyof typeof legalPages); return { title: page.title, description: page.description, alternates: { canonical: `/${legal}` }, openGraph: { title: page.title, description: page.description, url: `/${legal}`, type: "website" } }; }
export default async function ContentPage({ params }: { params: Promise<{ legal: string }> }) { const { legal } = await params; if (!slugs.includes(legal as keyof typeof legalPages)) notFound(); const page = await getContentPage(legal as keyof typeof legalPages); return <div className="shell narrow"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: page.title }]} /><article className="legal-page"><header><h1>{page.title}</h1><p>{page.description}</p></header><div className="markdown"><ReactMarkdown>{page.body}</ReactMarkdown></div></article></div>; }
