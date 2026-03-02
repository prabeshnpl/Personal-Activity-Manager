import React, { useMemo, useState } from "react";
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

  const applyEditorSelection = (next, textarea) => {
    onChange(next.value);
    requestAnimationFrame(() => {
      if (!textarea || !textarea.isConnected) return;
      textarea.focus();
      textarea.setSelectionRange(next.selectionStart, next.selectionEnd);
    });
  };

  const handleEditorKeyDown = (event) => {
    const textarea = event.currentTarget;
    if (!textarea || disabled) return;

    const currentValue = value || "";
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const isCtrlOrMeta = event.ctrlKey || event.metaKey;

    if (event.key === "Tab") {
      event.preventDefault();
      if (start === end) {
        applyEditorSelection(insertTabGap(currentValue, start), textarea);
        return;
      }
      applyEditorSelection(indentSelectedLines(currentValue, start, end), textarea);
      return;
    }

    if (!isCtrlOrMeta) return;

    const shouldIndentRight = event.key === "}" || (event.key === "]" && event.shiftKey);
    const shouldIndentLeft = event.key === "{" || event.key === "[";

    if (shouldIndentRight) {
      event.preventDefault();
      applyEditorSelection(indentSelectedLines(currentValue, start, end), textarea);
      return;
    }

    if (shouldIndentLeft) {
      event.preventDefault();
      applyEditorSelection(outdentSelectedLines(currentValue, start, end), textarea);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2">
        <ReactMdeComponent
          className="react-mde-embedded z-10"
          value={value || ""}
          onChange={(val) => onChange(val)}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={renderMarkdownPreview}
          childProps={{
            textArea: { id, placeholder, rows, disabled, onKeyDown: handleEditorKeyDown },
          }}
        />
      </div>

      {helperText && <p className="text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
};
