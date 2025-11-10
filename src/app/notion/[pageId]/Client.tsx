"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import NotionRenderer from '@/components/NotionRenderer';
import GithubSlugger from 'github-slugger';
import Link from 'next/link';
type NavItem = { label: string; slug: string[]; children?: NavItem[] };
type Heading = { id: string; text: string; depth: number };

type NotionResp = {
  id: string;
  title: string;
  tags?: string[];
  blocks: any[];
};

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
  const isNotion = item.slug[0] === 'notion';
  const href = isNotion
    ? `/notion/${item.slug[1] ?? ''}`
    : `/docs/${item.slug.map((s) => encodeURIComponent(s)).join('/')}`;
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

function AnchorNav({ anchors, activeId }: { anchors: Heading[]; activeId?: string }) {
  const filtered = anchors.filter((h) => h.depth >= 2 && h.depth <= 3);
  return (
    <nav className="text-base leading-7 sticky top-20">
      <div className="font-semibold mb-2">本页目录</div>
      <ul className="space-y-2">
        {filtered.map((h) => (
          <li key={h.id} className={h.depth === 2 ? 'ml-0' : 'ml-4'}>
            <a
              href={`#${h.id}`}
              className={`block ${
                activeId === h.id
                  ? 'text-[#1E80FF] font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function NotionPageClient({ pageId }: { pageId: string }) {
  const [data, setData] = useState<NotionResp | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ id: string; title: string }[] | null>(null);

  useEffect(() => {
    const safeId = (typeof pageId === 'string' && pageId.trim().length > 0) ? pageId.trim() : 'demo1';
    const id = encodeURIComponent(safeId);
    fetch(`/api/notion?pageId=${id}`)
      .then(async (r) => {
        if (!r.ok) {
          // Fallback 尝试 demo1，避免 404 直接终止体验
          const r2 = await fetch(`/api/notion?pageId=${encodeURIComponent('demo1')}`);
          if (!r2.ok) throw new Error(`HTTP ${r.status}`);
          return r2.json();
        }
        return r.json();
      })
      .then((json) => setData(json))
      .catch((e) => setError(e.message));
  }, [pageId]);

  // Fetch Notion menu items via API
  useEffect(() => {
    fetch('/api/notion/list')
      .then((r) => r.json())
      .then((json) => setMenu(json.items ?? []))
      .catch(() => setMenu([]));
  }, []);

  const currentSlug = useMemo(
    () => ['notion', (data?.id && typeof data.id === 'string') ? data.id : ((typeof pageId === 'string' && pageId.trim().length > 0) ? pageId.trim() : 'demo1')],
    [pageId, data]
  );

  // 计算锚点与 headingIds（仅 h2/h3 出现在右侧导航）
  const { anchors, headingIds } = useMemo(() => {
    const result: Heading[] = [];
    const ids: string[] = [];
    const slugger = new GithubSlugger();
    const extractText = (rts: any[]) => rts.map((r) => r.text?.content ?? '').join('').trim();
    (data?.blocks ?? []).forEach((b) => {
      if (b.type === 'heading_1' || b.type === 'heading_2' || b.type === 'heading_3') {
        const depth = b.type === 'heading_1' ? 1 : b.type === 'heading_2' ? 2 : 3;
        const text = extractText((b as any)[b.type].rich_text);
        const id = slugger.slug(text);
        ids.push(id);
        result.push({ id, text, depth });
      }
    });
    return { anchors: result, headingIds: ids };
  }, [data]);

  const articleRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const el = articleRef.current;
    if (!el || !headingIds.length) return;
    const updateActive = () => {
      const scrollTop = el.scrollTop;
      let active = headingIds[0];
      for (const id of headingIds) {
        const h = el.querySelector<HTMLElement>(`#${id}`);
        if (h) {
          const y = h.offsetTop;
          if (y - 80 <= scrollTop) active = id;
        }
      }
      setActiveId(active);
    };
    updateActive();
    const onScroll = () => updateActive();
    el.addEventListener('scroll', onScroll);
    window.addEventListener('resize', updateActive);
    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActive);
    };
  }, [headingIds]);

  const sidebar = useMemo<NavItem[]>(() => {
    const items = (menu ?? []).map((m) => ({ label: m.title, slug: ['notion', m.id] }));
    return items;
  }, [menu]);

  if (!data && !error) {
    return <div className="text-sm text-zinc-500">Loading Notion page...</div>;
  }
  if (error) {
    return <div className="text-red-600">Failed to load Notion page: {error}</div>;
  }

  return (
    <div className="grid grid-cols-[280px_1fr_320px] gap-6">
      <aside className="overflow-hidden">
        {!menu ? (
          <div className="text-sm text-zinc-500">Loading menu...</div>
        ) : (
          <Sidebar items={sidebar} currentSlug={currentSlug} />
        )}
      </aside>
      <article ref={articleRef} className="h-full overflow-y-auto pr-2">
        <h1 className="text-2xl font-semibold mb-3">{data!.title}</h1>
        {Array.isArray(data!.tags) && data!.tags.length > 0 && (
          <div className="flex flex-wrap mb-4">
            {data!.tags.map((t, i) => (
              <TagBadge key={`${t}-${i}`} text={t} idx={i} />
            ))}
          </div>
        )}
        <NotionRenderer blocks={data!.blocks} headingIds={headingIds} />
      </article>
      <aside className="overflow-y-auto pr-2">
        <AnchorNav anchors={anchors} activeId={activeId} />
      </aside>
    </div>
  );
}