import Link from 'next/link';
import { NavItem, Heading } from '@/lib/docs';

type DocLayoutProps = {
  sidebar: NavItem[];
  contentHtml: string;
  anchors: Heading[];
  currentSlug: string[];
  title: string;
  tags?: string[];
};

function Sidebar({ items, currentSlug }: { items: NavItem[]; currentSlug: string[] }) {
  return (
    <nav className="text-sm">
      <ul className="space-y-1">
        {items.map((item) => (
          <SidebarItem key={item.slug.join('/')} item={item} currentSlug={currentSlug} />
        ))}
      </ul>
    </nav>
  );
}

function SidebarItem({ item, currentSlug }: { item: NavItem; currentSlug: string[] }) {
  const isActive = item.slug.join('/') === currentSlug.join('/');
  const hasChildren = !!item.children?.length;
  const href = item.slug[0] === 'notion'
    ? `/notion/${item.slug[1] ?? ''}`
    : `/${item.slug.map((s) => encodeURIComponent(s)).join('/')}`;
  return (
    <li>
      <Link
        href={href}
        className={`block px-2 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
          isActive ? 'bg-zinc-100 dark:bg-zinc-800 font-medium' : ''
        }`}
      >
        {item.label}
      </Link>
      {hasChildren && (
        <ul className="ml-3 mt-1 space-y-1 border-l border-zinc-200 dark:border-zinc-700 pl-3">
          {item.children!.map((child) => (
            <SidebarItem key={child.slug.join('/')} item={child} currentSlug={currentSlug} />
          ))}
        </ul>
      )}
    </li>
  );
}

function AnchorNav({ anchors }: { anchors: Heading[] }) {
  const filtered = anchors.filter((h) => h.depth >= 2 && h.depth <= 3);
  return (
    <nav className="text-base leading-7 sticky top-20">
      <div className="font-semibold mb-2">本页目录</div>
      <ul className="space-y-2">
        {filtered.map((h) => (
          <li key={h.id} className={h.depth === 2 ? 'ml-0' : 'ml-4'}>
            <a href={`#${h.id}`} className="block text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TagBadge({ text, idx }: { text: string; idx: number }) {
  const palette = [
    { bg: '#E8F3FF', bd: '#CDE3FF', fg: '#1E80FF' },
    { bg: '#F3E8FF', bd: '#E1CFFF', fg: '#7C4DFF' },
    { bg: '#E8FFEA', bd: '#CDECCF', fg: '#00B578' },
    { bg: '#FFF7E8', bd: '#FFE3A3', fg: '#FA8C16' },
    { bg: '#FFE8F1', bd: '#FFC3D8', fg: '#F5317F' },
    { bg: '#F5F7FA', bd: '#E5E6EB', fg: '#86909C' },
  ];
  const c = palette[idx % palette.length];
  return (
    <span
      className="inline-flex items-center text-[13px] leading-6 px-2.5 py-0.5 rounded-md mr-2 mb-2"
      style={{ background: c.bg, border: `1px solid ${c.bd}`, color: c.fg }}
    >
      {text}
    </span>
  );
}

export default function DocLayout({ sidebar, contentHtml, anchors, currentSlug, title, tags }: DocLayoutProps) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-700 bg-[var(--background)]">
        <div className="mx-auto max-w-[1500px] px-6 py-3 flex items-center justify-between">
          <Link href="/" className="font-semibold">my-notes</Link>
          <div className="text-sm text-zinc-500">文档</div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden mx-auto max-w-[1500px] px-6 py-6 grid grid-cols-[280px_1fr_320px] gap-6">
        <aside className="overflow-hidden">
          <Sidebar items={sidebar} currentSlug={currentSlug} />
        </aside>
        <article className="h-full overflow-y-auto pr-2">
          <h1 className="text-2xl font-semibold mb-3">{title}</h1>
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap mb-4">
              {tags.map((t, i) => (
                <TagBadge key={`${t}-${i}`} text={t} idx={i} />
              ))}
            </div>
          )}
          <div className="prose prose-zinc dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </article>
        <aside className="overflow-y-auto pr-2">
          <AnchorNav anchors={anchors} />
        </aside>
      </main>
    </div>
  );
}