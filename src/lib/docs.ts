import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { visit } from 'unist-util-visit';
import GithubSlugger from 'github-slugger';
import { getNotionDoc, listNotionDatabase } from './notion';

export type Heading = {
  id: string;
  text: string;
  depth: number;
};

export type DocData = {
  html: string;
  headings: Heading[];
  title: string;
  rawText?: string;
  ext: '.md' | '.xmd' | '.txt' | '.mdx';
  tags?: string[];
};

export type NavItem = {
  label: string;
  slug: string[];
  children?: NavItem[];
};

const contentDir = path.join(process.cwd(), 'content');
const supportedExts = ['.md', '.xmd', '.txt', '.mdx'];

function filenameToLabel(filename: string) {
  const name = filename.replace(/\.[^.]+$/, '');
  return name.replace(/[-_]/g, ' ');
}

export function ensureContentDir() {
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
}

export function resolveDocFile(slugParts: string[]): { filePath: string; ext: '.md' | '.xmd' | '.txt' } | null {
  ensureContentDir();
  const base = path.join(contentDir, ...slugParts);
  for (const ext of supportedExts) {
    const p = base + ext;
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      return { filePath: p, ext: ext as any };
    }
  }
  // if slug points to a directory, try index files
  if (fs.existsSync(base) && fs.statSync(base).isDirectory()) {
    for (const ext of supportedExts) {
      const p = path.join(base, 'index' + ext);
      if (fs.existsSync(p) && fs.statSync(p).isFile()) {
        return { filePath: p, ext: ext as any };
      }
    }
  }
  return null;
}

export async function getDoc(slugParts: string[]): Promise<DocData | null> {
  // Support Notion route: /docs/notion/<pageId>
  if (slugParts[0] === 'notion' && slugParts[1]) {
    const notion = await getNotionDoc(slugParts[1]);
    if (!notion) {
      return {
        html: `<div class="prose"><p>Notion 未配置或读取失败：请设置环境变量 <code>NOTION_TOKEN</code> 并使用有效的 <code>pageId</code>。</p></div>`,
        headings: [],
        title: 'Notion 文档',
        ext: '.md',
        tags: [],
      };
    }
    const { content, data } = matter(notion.markdown || '');
    return await renderMarkdown(content, data, notion.title, notion.tags);
  }

  const resolved = resolveDocFile(slugParts);
  if (!resolved) return null;

  const { filePath, ext } = resolved;
  const raw = fs.readFileSync(filePath, 'utf-8');

  if (ext === '.txt') {
    return {
      html: `<pre class="whitespace-pre-wrap">${escapeHtml(raw)}</pre>`,
      headings: [],
      title: path.basename(filePath),
      rawText: raw,
      ext,
    };
  }

  const { content, data } = matter(raw);
  return await renderMarkdown(content, data, filenameToLabel(path.basename(filePath)), undefined, ext);
}

export async function getSidebar(): Promise<NavItem[]> {
  ensureContentDir();
  function walk(dir: string, baseSlug: string[] = []): NavItem[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const dirs: NavItem[] = [];
    const files: NavItem[] = [];
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const children = walk(full, [...baseSlug, e.name]);
        dirs.push({ label: filenameToLabel(e.name), slug: [...baseSlug, e.name], children });
      } else {
        const ext = path.extname(e.name);
        if (!supportedExts.includes(ext)) continue;
        const name = filenameToLabel(e.name);
        const slug = [...baseSlug, e.name.replace(ext, '')];
        files.push({ label: name, slug });
      }
    }
    // sort: dirs first, then files
    dirs.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));
    files.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));
    return [...dirs, ...files];
  }
  const items = walk(contentDir);
  const dbId = process.env.NOTION_DATABASE_ID;
  const token = process.env.NOTION_TOKEN;
  if (dbId && token) {
    try {
      const pages = await listNotionDatabase(dbId);
      if (pages.length) {
        const notionGroup: NavItem = {
          label: 'Notion',
          slug: ['notion'],
          children: pages.map((p) => ({ label: p.title, slug: ['notion', p.id] })),
        };
        items.push(notionGroup);
      }
    } catch {
      // ignore Notion errors and keep local sidebar
    }
  }
  return items;
}

export function findFirstDocSlug(): string[] | null {
  const sidebar = getSidebar();
  function findLeaf(items: NavItem[]): string[] | null {
    for (const item of items) {
      if (item.children && item.children.length) {
        const found = findLeaf(item.children);
        if (found) return found;
      } else {
        return item.slug;
      }
    }
    return null;
  }
  return findLeaf(sidebar);
}

export async function getSidebarForCategory(category: string): Promise<NavItem[]> {
  ensureContentDir();
  const base = path.join(contentDir, category);
  if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) return [];
  function walk(dir: string, baseSlug: string[] = []): NavItem[] {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const dirs: NavItem[] = [];
    const files: NavItem[] = [];
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        const children = walk(full, [...baseSlug, e.name]);
        dirs.push({ label: filenameToLabel(e.name), slug: [category, ...baseSlug, e.name], children });
      } else {
        const ext = path.extname(e.name);
        if (!supportedExts.includes(ext)) continue;
        const name = filenameToLabel(e.name);
        const slug = [category, ...baseSlug, e.name.replace(ext, '')];
        files.push({ label: name, slug });
      }
    }
    dirs.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));
    files.sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));
    return [...dirs, ...files];
  }
  return walk(base, []);
}

export async function findFirstDocSlugInCategory(category: string): Promise<string[] | null> {
  const sidebar = await getSidebarForCategory(category);
  function findLeaf(items: NavItem[]): string[] | null {
    for (const item of items) {
      if (item.children && item.children.length) {
        const found = findLeaf(item.children);
        if (found) return found;
      } else {
        return item.slug;
      }
    }
    return null;
  }
  return findLeaf(sidebar);
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function renderMarkdown(content: string, data: any, fallbackTitle: string, initialTags?: string[], ext: DocData['ext'] = '.md') {
  const headings: Heading[] = [];
  const slugger = new GithubSlugger();
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(() => (tree: any) => {
      visit(tree, 'heading', (node: any) => {
        const depth = node.depth;
        const text = (node.children || [])
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.value)
          .join(' ');
        const id = slugger.slug(text);
        headings.push({ id, text, depth });
      });
    })
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: ['anchor'] } })
    .use(rehypeStringify);

  const html = String(await processor.process(content));
  const title = (data?.title as string) || headings.find((h) => h.depth === 1)?.text || fallbackTitle;

  // tags from frontmatter or initialTags
  let tags: string[] | undefined = initialTags;
  const rawTags = data?.tags;
  if (!tags) {
    if (Array.isArray(rawTags)) {
      tags = rawTags.map((t: any) => String(t).trim()).filter(Boolean);
    } else if (typeof rawTags === 'string') {
      tags = rawTags.split(/[,，]/).map((t: string) => t.trim()).filter(Boolean);
    }
  }

  return { html, headings, title, ext, tags } as DocData;
}

// no-op