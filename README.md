This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# my-notes
## Notion 文档读取

支持通过 Notion API 读取页面并渲染到 `/docs/notion/<pageId>` 路由，同时可将 Notion 数据库中的页面列入侧边栏。

### 配置步骤

1. 安装依赖（已在本项目中完成）：

   ```bash
   npm i @notionhq/client notion-to-md
   ```

2. 在环境变量中设置：

   - `NOTION_TOKEN`：Notion 集成的密钥（Internal Integration Token）
   - 可选 `NOTION_DATABASE_ID`：如果提供，则会把该数据库中的页面列入侧边栏（按标题）。

   在本地开发可使用 `.env.local`：

   ```env
   NOTION_TOKEN=secret_xxx
   NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. 使用方式：

   - 直接访问某页：`/docs/notion/<pageId>`，例如：
     `http://localhost:3000/docs/notion/12345678abcd9012efgh3456ijkl7890`
   - 若设置了 `NOTION_DATABASE_ID`，侧边栏会新增 `Notion` 分组，点击即可跳转对应页面。

### 说明

- 内容将通过 `notion-to-md` 转为 Markdown 后，复用本站的 Markdown 渲染样式（标题锚点、代码块、表格等）。
- 若未配置 `NOTION_TOKEN` 或页面读取失败，页面将显示提示文案，不影响本地文件内容的浏览。
