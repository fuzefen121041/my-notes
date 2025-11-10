export type ProjectLink = {
  title: string;
  description?: string;
  href: string;
  badge?: string;
};

export const projects: ProjectLink[] = [
  {
    title: 'My Notes',
    description: '文档与笔记集合',
    href: '/docs',
    badge: 'Docs',
  },
  {
    title: 'Notion Demo 1',
    description: '原生 Notion 渲染示例',
    href: '/notion/demo1',
    badge: 'Notion',
  },
  {
    title: 'Notion Demo 2',
    description: '原生 Notion 渲染示例',
    href: '/notion/demo2',
    badge: 'Notion',
  },
  {
    title: 'Getting Started',
    description: '入门指南与使用说明',
    href: '/guide',
    badge: 'Guide',
  },
  {
    title: 'Frontend',
    description: '前端相关笔记',
    href: '/frontend',
    badge: 'Category',
  },
  {
    title: 'Algorithms',
    description: '数据结构与算法',
    href: '/algorithms',
    badge: 'Category',
  },
  {
    title: 'Misc',
    description: '其他随笔与草稿',
    href: '/misc',
    badge: 'Category',
  },
  {
    title: 'GitHub',
    description: '我的开源仓库',
    href: 'https://github.com/',
  },
];