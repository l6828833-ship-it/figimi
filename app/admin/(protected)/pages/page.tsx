import Link from "next/link";
import { Edit3 } from "lucide-react";
import { legalPages } from "@/lib/seed";
export default async function PagesAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) { const { saved } = await searchParams; return <><div className="admin-heading"><div><span className="eyebrow">Site content</span><h1>Pages</h1></div></div>{saved && <div className="notice success">Page saved and revalidated.</div>}<div className="admin-list">{Object.entries(legalPages).map(([slug, page]) => <Link href={`/admin/pages/${slug}`} key={slug}><span><strong>{page.title}</strong><small>/{slug}</small></span><Edit3 size={17} /></Link>)}</div></>; }
