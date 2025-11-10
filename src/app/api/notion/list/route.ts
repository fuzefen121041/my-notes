import { NextResponse } from 'next/server';
import { listNotionDatabase } from '@/lib/notion';

type NotionMenuItem = { id: string; title: string };

export async function GET() {
  const token = process.env.NOTION_TOKEN;
  const dbId = process.env.NOTION_DATABASE_ID;

  // If environment configured, try reading real Notion database
  if (token && dbId) {
    try {
      const pages = await listNotionDatabase(dbId);
      const items: NotionMenuItem[] = pages.map((p) => ({ id: p.id, title: p.title }));
      return NextResponse.json({ items }, { status: 200 });
    } catch (e) {
      // Fall through to mock on error
    }
  }

  // Mock fallback
  const mock: NotionMenuItem[] = [
    { id: 'demo1', title: '数据结构与算法课程总结（Notion 原生）' },
    { id: 'demo2', title: 'Getting Started — Notion Native' },
  ];
  return NextResponse.json({ items: mock }, { status: 200 });
}