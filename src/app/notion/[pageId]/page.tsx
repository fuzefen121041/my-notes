import Link from 'next/link';
import NotionPageClient from './Client';

export const revalidate = 0;

export default function NotionPage({ params }: { params: { pageId: string } }) {
  const { pageId } = params;
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-700 bg-[var(--background)]">
        <div className="mx-auto max-w-[1500px] px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">my-notes</Link>
          <div className="text-sm text-zinc-500">Notion 原生渲染</div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto mx-auto max-w-[1500px] px-6 py-6">
        <NotionPageClient pageId={pageId} />
      </main>
    </div>
  );
}