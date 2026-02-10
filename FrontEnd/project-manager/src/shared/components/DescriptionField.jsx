import React, { useRef, useState } from "react";
import ReactMde from "react-mde";
import * as Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
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
  const [selectedTab, setSelectedTab] = useState("write");
  const converter = new Showdown.Converter({ tables: true, simplifiedAutoLink: true });
  const ReactMdeComponent = ReactMde.default ?? ReactMde;

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
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-2">
        <ReactMdeComponent
          value={value || ""}
          onChange={(val) => onChange(val)}
          selectedTab={selectedTab}
          onTabChange={setSelectedTab}
          generateMarkdownPreview={(markdown) => Promise.resolve(converter.makeHtml(markdown))}
          childProps={{ textArea: { id, placeholder, rows } }}
        />
      </div>

      {helperText && <p className="text-xs text-neutral-500">{helperText}</p>}
    </div>
  );
};
