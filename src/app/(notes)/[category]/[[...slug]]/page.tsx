import DocLayout from '@/components/DocLayout';
import { notFound, redirect } from 'next/navigation';
import { getDoc, getSidebarForCategory, findFirstDocSlugInCategory } from '@/lib/docs';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { category: string; slug?: string[] };

export default async function Page({ params }: { params: Params }) {
  const p = params;
  const category = decodeURIComponent(p.category);
  const sidebar = await getSidebarForCategory(category);
  if (!p.slug || p.slug.length === 0) {
    const first = await findFirstDocSlugInCategory(category);
    if (first) {
      const encoded = first.map((s) => encodeURIComponent(s)).join('/');
      redirect(`/${encoded}`);
    }
    notFound();
  }
  const slug = [category, ...p.slug!.map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  })];

  const doc = await getDoc(slug);
  if (!doc) notFound();

  return (
    <DocLayout
      sidebar={sidebar}
      contentHtml={doc!.html}
      anchors={doc!.headings}
      currentSlug={slug}
      title={doc!.title}
      tags={doc!.tags}
    />
  );
}