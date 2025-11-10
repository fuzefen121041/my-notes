import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';

export type NotionDoc = {
  markdown: string;
  title: string;
  tags?: string[];
};

function getClient() {
  const token = process.env.NOTION_TOKEN;
  if (!token) return null;
  return new Client({ auth: token });
}

export async function getNotionDoc(pageId: string): Promise<NotionDoc | null> {
  const client = getClient();
  if (!client) return null;
  const n2m = new NotionToMarkdown({ notionClient: client });
  const blocks = await n2m.pageToMarkdown(pageId);
  const md = n2m.toMarkdownString(blocks);

  // Fetch page title and tags from properties
  const page = await client.pages.retrieve({ page_id: pageId });
  let title = 'Untitled';
  let tags: string[] | undefined;
  try {
    const titleProp: any = (page as any).properties?.Name || (page as any).properties?.title;
    if (titleProp?.type === 'title' && Array.isArray(titleProp.title) && titleProp.title.length) {
      title = titleProp.title.map((t: any) => t.plain_text).join('');
    }
    const tagsProp: any = (page as any).properties?.tags || (page as any).properties?.Tags;
    if (tagsProp?.type === 'multi_select' && Array.isArray(tagsProp.multi_select)) {
      tags = tagsProp.multi_select.map((t: any) => t.name).filter(Boolean);
    }
  } catch {}

  return { markdown: typeof md === 'string' ? md : md.parent, title, tags };
}

export async function listNotionDatabase(databaseId: string): Promise<{ id: string; title: string }[]> {
  const client = getClient();
  if (!client) return [];
  const res = await client.databases.query({ database_id: databaseId });
  const items: { id: string; title: string }[] = [];
  for (const r of res.results as any[]) {
    const id = r.id;
    let title = 'Untitled';
    const titleProp: any = r.properties?.Name || r.properties?.title;
    if (titleProp?.type === 'title' && Array.isArray(titleProp.title) && titleProp.title.length) {
      title = titleProp.title.map((t: any) => t.plain_text).join('');
    }
    items.push({ id, title });
  }
  return items;
}