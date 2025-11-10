import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const contentDir = path.join(process.cwd(), 'content');
const supportedExts = ['.md', '.xmd', '.txt', '.mdx'];

function filenameToLabel(filename: string) {
  const name = filename.replace(/\.[^.]+$/, '');
  return name.replace(/[-_]/g, ' ');
}

function countFilesRecursively(dir: string): number {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      count += countFilesRecursively(full);
    } else {
      const ext = path.extname(e.name);
      if (supportedExts.includes(ext)) count += 1;
    }
  }
  return count;
}

export async function GET() {
  try {
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }
    const entries = fs.readdirSync(contentDir, { withFileTypes: true });
    const categories = entries
      .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
      .map((e) => {
        const slug = e.name;
        const label = filenameToLabel(e.name);
        const count = countFilesRecursively(path.join(contentDir, e.name));
        return { slug, label, count };
      })
      .sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'));

    return NextResponse.json({ categories });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to read categories' }, { status: 500 });
  }
}