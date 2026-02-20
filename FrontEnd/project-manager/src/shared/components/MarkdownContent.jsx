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
