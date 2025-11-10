"use client";
import React from 'react';

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

export default function NotionRenderer({ blocks, headingIds }: { blocks: Block[]; headingIds?: string[] }) {
  let headingPtr = 0;
  function renderRichText(rts: RichText[]) {
    return rts.map((r, i) => {
      let content = r.text.content;
      let el: React.ReactNode = content;
      if (r.annotations?.code) el = <code className="px-1 rounded bg-[#F7F8FA] text-[#4E5969]">{content}</code>;
      if (r.annotations?.bold) el = <strong>{el}</strong>;
      if (r.annotations?.italic) el = <em>{el}</em>;
      if (r.text.link?.url) el = (
        <a href={r.text.link.url} className="text-[#1E80FF] hover:underline">
          {el}
        </a>
      );
      return <React.Fragment key={i}>{el}</React.Fragment>;
    });
  }

  return (
    <div className="prose prose-zinc dark:prose-invert max-w-none">
      {blocks.map((b, idx) => {
        switch (b.type) {
          case 'heading_1':
            return (
              <h1 key={idx} id={headingIds?.[headingPtr++] ?? undefined} className="text-2xl font-semibold">
                {renderRichText(b.heading_1.rich_text)}
              </h1>
            );
          case 'heading_2':
            return (
              <h2 key={idx} id={headingIds?.[headingPtr++] ?? undefined} className="text-xl font-semibold">
                {renderRichText(b.heading_2.rich_text)}
              </h2>
            );
          case 'heading_3':
            return (
              <h3 key={idx} id={headingIds?.[headingPtr++] ?? undefined} className="text-lg font-semibold">
                {renderRichText(b.heading_3.rich_text)}
              </h3>
            );
          case 'paragraph':
            return <p key={idx}>{renderRichText(b.paragraph.rich_text)}</p>;
          case 'bulleted_list_item':
            return (
              <ul key={idx}>
                <li>{renderRichText(b.bulleted_list_item.rich_text)}</li>
              </ul>
            );
          case 'numbered_list_item':
            return (
              <ol key={idx}>
                <li>{renderRichText(b.numbered_list_item.rich_text)}</li>
              </ol>
            );
          case 'quote':
            return (
              <blockquote key={idx}>
                {renderRichText(b.quote.rich_text)}
              </blockquote>
            );
          case 'code':
            return (
              <pre key={idx} className="bg-[#F7F8FA] border border-[#E5E6EB] rounded-lg p-4 overflow-auto">
                <code>{b.code.rich_text.map((r) => r.text.content).join('')}</code>
              </pre>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}