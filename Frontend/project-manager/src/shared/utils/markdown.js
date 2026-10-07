const TAB_GAP = "  ";

export const normalizeMarkdownForRender = (markdown = "") => {
  return markdown
    .split("\n")
    .map((line, index, lines) => {
      if (!line.trim()) return line;

      const withSpaces = line.replace(/^\t+/, (tabs) => TAB_GAP.repeat(tabs.length));
      const trimmed = withSpaces.trimStart();
      const leadingSpaces = withSpaces.length - trimmed.length;

      const isListItem = /^([-+*]|\d+\.)\s+/.test(trimmed);
      const isHeading = /^#{1,6}\s+/.test(trimmed);
      const isQuote = /^>\s+/.test(trimmed);
      const startsInlineMarkdown = /^(\*\*|__|\*[^*\s]|_[^_\s]|~~|`)/.test(trimmed);

      if (isListItem) {
        const previousNonEmpty = [...lines.slice(0, index)].reverse().find((entry) => entry.trim());
        const previousTrimmed = previousNonEmpty ? previousNonEmpty.trimStart() : "";
        const previousWasList = /^([-+*]|\d+\.)\s+/.test(previousTrimmed);
        const indent = leadingSpaces > 2 ? (previousWasList ? 2 : 0) : leadingSpaces;
        return `${" ".repeat(indent)}${trimmed}`;
      }

      if (isHeading || isQuote || startsInlineMarkdown) {
        const indent = Math.min(leadingSpaces, 3);
        return `${" ".repeat(indent)}${trimmed}`;
      }

      return withSpaces;
    })
    .join("\n");
};

const getLineRange = (text, start, end) => {
  const lineStart = text.lastIndexOf("\n", Math.max(0, start - 1)) + 1;
  const endIsAtLineStart = end > lineStart && text[end - 1] === "\n";
  const safeEnd = endIsAtLineStart ? end - 1 : end;
  const lineEndIndex = text.indexOf("\n", safeEnd);
  const lineEnd = lineEndIndex === -1 ? text.length : lineEndIndex;
  return { lineStart, lineEnd };
};

export const indentSelectedLines = (text = "", selectionStart = 0, selectionEnd = 0) => {
  const { lineStart, lineEnd } = getLineRange(text, selectionStart, selectionEnd);
  const block = text.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const indented = lines.map((line) => `${TAB_GAP}${line}`).join("\n");

  return {
    value: `${text.slice(0, lineStart)}${indented}${text.slice(lineEnd)}`,
    selectionStart: selectionStart + TAB_GAP.length,
    selectionEnd: selectionEnd + TAB_GAP.length * lines.length,
  };
};

export const outdentSelectedLines = (text = "", selectionStart = 0, selectionEnd = 0) => {
  const { lineStart, lineEnd } = getLineRange(text, selectionStart, selectionEnd);
  const block = text.slice(lineStart, lineEnd);
  const lines = block.split("\n");
  const removeByLine = [];
  const outdented = lines
    .map((line) => {
      if (line.startsWith("\t")) {
        removeByLine.push(1);
        return line.slice(1);
      }
      const leadingSpaces = (line.match(/^ +/)?.[0].length ?? 0);
      const removeCount = Math.min(leadingSpaces, TAB_GAP.length);
      removeByLine.push(removeCount);
      return line.slice(removeCount);
    })
    .join("\n");

  const startReduction = removeByLine[0] ?? 0;
  const totalReduction = removeByLine.reduce((sum, count) => sum + count, 0);
  const nextStart = Math.max(lineStart, selectionStart - startReduction);
  const nextEnd = Math.max(nextStart, selectionEnd - totalReduction);

  return {
    value: `${text.slice(0, lineStart)}${outdented}${text.slice(lineEnd)}`,
    selectionStart: nextStart,
    selectionEnd: nextEnd,
  };
};

export const insertTabGap = (text = "", cursor = 0) => {
  return {
    value: `${text.slice(0, cursor)}${TAB_GAP}${text.slice(cursor)}`,
    selectionStart: cursor + TAB_GAP.length,
    selectionEnd: cursor + TAB_GAP.length,
  };
};
