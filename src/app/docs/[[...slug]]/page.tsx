import { getDoc, getSidebar, findFirstDocSlug } from '@/lib/docs';
import DocLayout from '@/components/DocLayout';
import { notFound, redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Params = { slug?: string[] };

export default async function Page({ params }: { params: Params }) {
  const p = params;
  if (!p.slug || p.slug.length === 0) {
    const first = findFirstDocSlug();
    if (first) {
      const encoded = first.map((s) => encodeURIComponent(s)).join('/');
      redirect(`/docs/${encoded}`);
    }
    redirect('/');
  }
  const slug = p.slug!.map((s) => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  });
  const doc = await getDoc(slug);
  if (!doc) {
    notFound();
  }
  const sidebar = await getSidebar();

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