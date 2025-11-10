import { NextResponse } from 'next/server';

// 简化版 Notion Block 类型（仅用于 Mock）
type RichText = {
  type: 'text';
  text: { content: string; link?: { url: string } | null };
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    code?: boolean;
    underline?: boolean;
    color?: string;
  };
};

type Block =
  | { type: 'heading_1'; heading_1: { rich_text: RichText[] } }
  | { type: 'heading_2'; heading_2: { rich_text: RichText[] } }
  | { type: 'heading_3'; heading_3: { rich_text: RichText[] } }
  | { type: 'paragraph'; paragraph: { rich_text: RichText[] } }
  | { type: 'bulleted_list_item'; bulleted_list_item: { rich_text: RichText[] } }
  | { type: 'numbered_list_item'; numbered_list_item: { rich_text: RichText[] } }
  | { type: 'quote'; quote: { rich_text: RichText[] } }
  | { type: 'code'; code: { language?: string; rich_text: RichText[] } };

type NotionPage = {
  id: string;
  title: string;
  tags?: string[];
  blocks: Block[];
};

function rt(text: string, opts: Partial<RichText['annotations']> = {}): RichText {
  return { type: 'text', text: { content: text }, annotations: { ...opts } } as RichText;
}

const MOCK_PAGES: Record<string, NotionPage> = {
  demo1: {
    id: 'demo1',
    title: '数据结构与算法课程总结（Notion 原生渲染）',
    tags: ['算法', '数据结构', '会议记录', '完整版'],
    blocks: [
      { type: 'heading_1', heading_1: { rich_text: [rt('课程记录总览')] } },
      {
        type: 'paragraph',
        paragraph: { rich_text: [rt('本页面为 Notion 原生格式的模拟数据，客户端直接按块渲染，不转 Markdown。')] },
      },
      { type: 'heading_2', heading_2: { rich_text: [rt('一、文字记录（会议核心内容梳理）')] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [rt('开场与学习方法论（00:22-01:15）', { bold: true })] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [rt('数据结构基础认知（01:15-05:56）')] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [rt('核心概念剖析（06:06-12:12）')] } },
      {
        type: 'code',
        code: { language: 'ts', rich_text: [rt("import { render } from 'notion';\nconsole.log('hello notion');", { code: true })] },
      },
      { type: 'quote', quote: { rich_text: [rt('掌握基础是学习的起点，数据结构与算法是计算机的语言。')] } },
      { type: 'heading_3', heading_3: { rich_text: [rt('表格示例（简化）')] } },
      { type: 'numbered_list_item', numbered_list_item: { rich_text: [rt('线性表：数组、链表、队列、栈')] } },
      { type: 'numbered_list_item', numbered_list_item: { rich_text: [rt('存储结构：顺序、链式、索引、散列')] } },
    ],
  },
  demo2: {
    id: 'demo2',
    title: 'Getting Started — Notion Native',
    tags: ['Guide', 'Setup'],
    blocks: [
      { type: 'heading_1', heading_1: { rich_text: [rt('Getting Started')] } },
      { type: 'paragraph', paragraph: { rich_text: [rt('Install dependencies and run the dev server.')] } },
      { type: 'code', code: { language: 'bash', rich_text: [rt('npm install\nnpm run dev', { code: true })] } },
      { type: 'heading_2', heading_2: { rich_text: [rt('Next Steps')] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [rt('Configure environment variables')] } },
      { type: 'bulleted_list_item', bulleted_list_item: { rich_text: [rt('Add content and explore features')] } },
    ],
  },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let pageId = searchParams.get('pageId') || 'demo1';
  try {
    pageId = decodeURIComponent(pageId);
  } catch {}
  pageId = pageId.trim();
  const page = MOCK_PAGES[pageId];
  if (!page) {
    return NextResponse.json({ error: 'Notion page not found' }, { status: 404 });
  }
  return NextResponse.json(page, { status: 200 });
}