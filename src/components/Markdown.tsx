import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * AI 답변용 마크다운 렌더러. react-markdown은 기본적으로 raw HTML을 렌더하지
 * 않아 안전하다. 각 요소를 앱 디자인 토큰에 맞춰 스타일링한다.
 */
const components: Components = {
  p: ({ children }) => (
    <p className="whitespace-pre-wrap leading-[1.7] [&:not(:first-child)]:pt-2">
      {children}
    </p>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:text-primary-light"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-bold text-porcelain">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => (
    <ul className="list-disc pl-5 pt-1 [&>li]:pt-0.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 pt-1 [&>li]:pt-0.5">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-[1.6]">{children}</li>,
  h1: ({ children }) => (
    <h1 className="pt-2 text-[17px] font-bold text-porcelain">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="pt-2 text-[15px] font-bold text-porcelain">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="pt-1 text-[14px] font-semibold text-porcelain">{children}</h3>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-line-outline pl-3 text-ink-subtle">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    // 인라인 코드는 className이 없고, 코드블록(```)은 language-* className이 붙는다.
    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <code className="block overflow-x-auto rounded-md bg-chip p-3 font-mono text-[12px] leading-[1.6]">
          {children}
        </code>
      );
    }
    return (
      <code className="rounded bg-chip px-[5px] py-[1px] font-mono text-[12px]">
        {children}
      </code>
    );
  },
  pre: ({ children }) => <pre className="pt-2">{children}</pre>,
  hr: () => <hr className="my-2 border-line-strong" />,
  table: ({ children }) => (
    <div className="overflow-x-auto pt-2">
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-line-strong px-2 py-1 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-line-strong px-2 py-1">{children}</td>
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
