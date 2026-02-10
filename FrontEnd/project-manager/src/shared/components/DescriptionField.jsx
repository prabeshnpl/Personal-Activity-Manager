import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const applyFormatting = (value, selectionStart, selectionEnd, type) => {
  const selected = value.slice(selectionStart, selectionEnd);
  let nextValue = value;
  let cursorStart = selectionStart;
  let cursorEnd = selectionEnd;

  if (type === "bold") {
    const insert = `**${selected || "bold text"}**`;
    nextValue = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
    cursorStart = selectionStart + 2;
    cursorEnd = selectionStart + insert.length - 2;
  }

  if (type === "italic") {
    const insert = `*${selected || "italic text"}*`;
    nextValue = value.slice(0, selectionStart) + insert + value.slice(selectionEnd);
    cursorStart = selectionStart + 1;
    cursorEnd = selectionStart + insert.length - 1;
  }

  if (type === "bullet") {
    const block = selected || "";
    const lines = block.split("\n");
    const formatted = lines.map((line) => (line.startsWith("- ") ? line : `- ${line}`)).join("\n");
    nextValue = value.slice(0, selectionStart) + formatted + value.slice(selectionEnd);
    cursorStart = selectionStart;
    cursorEnd = selectionStart + formatted.length;
  }

  if (type === "number") {
    const block = selected || "";
    const lines = block.split("\n");
    const formatted = lines
      .map((line, index) => (line.match(/^\d+\.\s/) ? line : `${index + 1}. ${line}`))
      .join("\n");
    nextValue = value.slice(0, selectionStart) + formatted + value.slice(selectionEnd);
    cursorStart = selectionStart;
    cursorEnd = selectionStart + formatted.length;
  }

  if (type === "break") {
    nextValue = value.slice(0, selectionStart) + "\n" + value.slice(selectionEnd);
    cursorStart = selectionStart + 1;
    cursorEnd = cursorStart;
  }

  return { nextValue, cursorStart, cursorEnd };
};

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

  const handleFormat = (type) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { nextValue, cursorStart, cursorEnd } = applyFormatting(
      value || "",
      textarea.selectionStart,
      textarea.selectionEnd,
      type
    );
    onChange(nextValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-2">
        <button
          type="button"
          onClick={() => handleFormat("bold")}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
          disabled={disabled}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => handleFormat("italic")}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
          disabled={disabled}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => handleFormat("bullet")}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
          disabled={disabled}
        >
          Bullets
        </button>
        <button
          type="button"
          onClick={() => handleFormat("number")}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
          disabled={disabled}
        >
          Numbered
        </button>
        <button
          type="button"
          onClick={() => handleFormat("break")}
          className="rounded-md border border-neutral-200 bg-white px-3 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-100"
          disabled={disabled}
        >
          Line Break
        </button>
      </div>
      <Textarea
        id={id}
        ref={textareaRef}
        placeholder={placeholder}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        disabled={disabled}
      />
      {helperText && <p className="text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
};
