import type { JSONContent } from "@tiptap/core";

export const RICH_QUESTION_PREFIX = "__ACTINC_RICH_V1__:";

const paragraph = (text = ""): JSONContent => ({
  type: "paragraph",
  ...(text ? { content: [{ type: "text", text }] } : {}),
});

export const plainTextToQuestionDoc = (value = ""): JSONContent => ({
  type: "doc",
  content: value.split(/\r?\n/).map((line) => paragraph(line)),
});

export const parseQuestionContent = (value?: string): JSONContent => {
  if (!value) return plainTextToQuestionDoc();

  if (value.startsWith(RICH_QUESTION_PREFIX)) {
    try {
      const parsed = JSON.parse(value.slice(RICH_QUESTION_PREFIX.length)) as JSONContent;
      if (parsed?.type === "doc") return parsed;
    } catch {
      // Fall back to the original value so malformed legacy content is still visible.
    }
  }

  return plainTextToQuestionDoc(value);
};

const collectText = (node?: JSONContent): string => {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (node.type === "hardBreak") return "\n";

  const text = (node.content ?? []).map(collectText).join("");
  return ["paragraph", "heading", "listItem", "blockquote"].includes(node.type ?? "")
    ? `${text}\n`
    : text;
};

export const questionContentText = (value?: string) =>
  collectText(parseQuestionContent(value)).trim();

export const hasQuestionContent = (value?: string) =>
  questionContentText(value).length > 0;

export const serializeQuestionContent = (doc: JSONContent) => {
  if (!collectText(doc).trim()) return "";
  return `${RICH_QUESTION_PREFIX}${JSON.stringify(doc)}`;
};
