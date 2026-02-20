import React, { useMemo, useRef, useState } from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "react-mde/lib/styles/css/react-mde-all.css";
import { Label } from "@/components/ui/label";
import {
  indentSelectedLines,
  insertTabGap,
  normalizeMarkdownForRender,
  outdentSelectedLines,
} from "@/shared/utils/markdown";

export const DescriptionField = ({
  id,
  label = "Description",
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  helperText = "Formatting: **bold**, *italic*, - bullets, 1. numbered, line breaks.",
}) => {
  const textareaRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("write");
  const ReactMdeComponent = ReactMde.default ?? ReactMde;

  const renderMarkdownPreview = useMemo(
    () => (markdown) =>
      Promise.resolve(
        <div className="prose prose-sm max-w-none p-3">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {normalizeMarkdownForRender(markdown || "")}
          </ReactMarkdown>
        </div>
      ),
    []
  );

  const applyEditorSelection = (next) => {
    onChange(next.value);
    requestAnimationFrame(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      textarea.focus();
      textarea.setSelectionRange(next.selectionStart, next.selectionEnd);
    });
  };

  const handleEditorKeyDown = (event) => {
    const textarea = textareaRef.current;
    if (!textarea || disabled) return;

    const currentValue = value || "";
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const isCtrlOrMeta = event.ctrlKey || event.metaKey;

    if (event.key === "Tab") {
      event.preventDefault();
      if (start === end) {
        applyEditorSelection(insertTabGap(currentValue, start));
        return;
      }
      applyEditorSelection(indentSelectedLines(currentValue, start, end));
      return;
    }

    if (!isCtrlOrMeta) return;

    const shouldIndentRight = event.key === "}" || (event.key === "]" && event.shiftKey);
    const shouldIndentLeft = event.key === "{" || event.key === "[";

    if (shouldIndentRight) {
      event.preventDefault();
      applyEditorSelection(indentSelectedLines(currentValue, start, end));
      return;
    }

    if (shouldIndentLeft) {
      event.preventDefault();
      applyEditorSelection(outdentSelectedLines(currentValue, start, end));
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2">
        <ReactMdeComponent
          className="react-mde-embedded z-10cd"
          value={value || ""}
          onChange={(val) => onChange(val)}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={renderMarkdownPreview}
          childProps={{
            textArea: { id, placeholder, rows, disabled, ref: textareaRef, onKeyDown: handleEditorKeyDown },
          }}
        />
      </div>

      {helperText && <p className="text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
};
