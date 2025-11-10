"use client";
import Link from 'next/link';
import { projects } from '@/data/projects';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';

type Category = { slug: string; label: string; count?: number };

export default function Home() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories')
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && Array.isArray(json.categories)) setCategories(json.categories);
      })
      .catch(() => {
      });
    return () => { cancelled = true; };
  }, []);
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] via-[#111827] to-[#0b1020] text-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-20 backdrop-blur border-b border-white/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-gradient-to-tr from-[#22d3ee] to-[#a78bfa]" />
            <span className="text-lg font-semibold tracking-wide">My Notes & Projects</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-300">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="inline-flex items-center gap-1 px-2 py-1 rounded hover:text-white hover:bg-white/5 transition-colors">
                  学习笔记
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content sideOffset={8} className="min-w-[220px] overflow-hidden rounded-lg border border-white/10 bg-[#0f172a] text-zinc-200 shadow-xl">
                <DropdownMenu.Label className="px-3 py-2 text-xs uppercase tracking-wide text-zinc-400">分类</DropdownMenu.Label>
                {(categories ?? []).map((c) => (
                  <DropdownMenu.Item key={c.slug} asChild>
                    <Link href={`/${c.slug}`} className="flex items-center justify-between px-3 py-2 hover:bg-white/5 hover:text-white">
                      <span>{c.label}</span>
                      {typeof c.count === 'number' && (
                        <span className="ml-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded bg-white/10 text-xs text-zinc-300">{c.count}</span>
                      )}
                    </Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Link href="#" className="hover:text-white">课程作业</Link>
            <Link href="#" className="hover:text-white">会议记录</Link>
            <Link href="#" className="hover:text-white">常用网址</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-24 left-1/2 h-64 w-[120vw] -translate-x-1/2 rounded-full blur-3xl bg-gradient-to-r from-[#22d3ee]/40 via-[#60a5fa]/30 to-[#a78bfa]/40" />
        </div>
        <div className="mx-auto max-w-7xl px-4 pt-16 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">打造一个酷炫的个人空间</h1>
          <p className="mt-4 max-w-2xl text-zinc-300">
            记录学习、展示项目与想法。下面是我常用的入口与项目链接，支持 PC / H5 自适应。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/notion/demo1" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm">Notion</Link>
            <Link href="/docs" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm">Docs</Link>
            <Link href="/frontend" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm">Frontend</Link>
            <Link href="/algorithms" className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-sm">Algorithms</Link>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <main className="mx-auto max-w-7xl px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map((p, i) => (
            <Link
              key={`${p.title}-${i}`}
              href={p.href}
              className="group relative rounded-xl border border-white/10 bg-white/5 p-5 hover:border-[#22d3ee]/40 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold group-hover:text-white">{p.title}</h3>
                {p.badge && (
                  <span className="rounded-full bg-[#22d3ee]/20 text-[#22d3ee] px-2 py-0.5 text-xs">{p.badge}</span>
                )}
              </div>
              {p.description && (
                <p className="mt-2 text-sm text-zinc-300">{p.description}</p>
              )}
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400">
                <span>立即查看</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 0 1 0-1.06L11.94 7H9a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V8.06l-6.72 6.72a.75.75 0 0 1-1.06 0Z" clipRule="evenodd" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
