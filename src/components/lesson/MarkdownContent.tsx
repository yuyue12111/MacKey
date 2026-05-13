import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div
      className="prose prose-neutral max-w-none mb-12
        prose-headings:font-[var(--font-display)] prose-headings:font-[350] prose-headings:tracking-[-0.01em]
        prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
        prose-p:text-[15px] prose-p:leading-relaxed prose-p:text-ink-secondary prose-p:font-light prose-p:mb-5
        prose-strong:text-ink prose-strong:font-medium
        prose-code:font-mono prose-code:text-sm prose-code:bg-[#F5F3EF] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
        prose-ul:text-ink-secondary prose-li:my-1
        prose-table:bg-surface prose-table:border prose-table:border-border prose-table:rounded-2xl
        prose-th:text-left prose-th:px-4 prose-th:py-3 prose-th:text-[12px] prose-th:font-medium prose-th:text-ink-tertiary
        prose-td:px-4 prose-td:py-3 prose-td:text-[14px] prose-td:text-ink-secondary
        prose-blockquote:border-l-gold prose-blockquote:bg-[#FFF8F0] prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-[14px]
      "
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
