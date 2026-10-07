import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { normalizeMarkdownForRender } from "@/shared/utils/markdown";

const baseStyles = {
  p: ({ children }) => <p className="text-gray-700 whitespace-pre-wrap">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 text-gray-700">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1 text-gray-700">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
  em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
  code: ({ children, className }) => (
    <code
      className={[
        "px-2 py-1 bg-gray-100 border border-gray-200 rounded text-red-600 font-mono text-sm",
        className || "",
      ].join(" ").trim()}
    >
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap wrap-break-word [&>code]:bg-transparent [&>code]:border-0 [&>code]:p-0 [&>code]:rounded-none [&>code]:text-inherit">
      {children}
    </pre>
  ),
  h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mt-3 mb-2">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-bold text-gray-900 mt-2 mb-1">{children}</h3>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 pl-4 italic text-gray-600 my-2">{children}</blockquote>
  ),
  a: ({ children, href }) => (
    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
  ),
};

export const MarkdownContent = ({ content, className = "" }) => {
  if (!content) return null;
  return (
    <div className={`space-y-2 ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={baseStyles}>
        {normalizeMarkdownForRender(content)}
      </ReactMarkdown>
    </div>
  );
};
