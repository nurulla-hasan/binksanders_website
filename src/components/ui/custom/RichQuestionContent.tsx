import type { CSSProperties, ReactNode } from "react";
import type { JSONContent } from "@tiptap/core";
import { cn } from "@/lib/utils";
import { parseQuestionContent } from "@/lib/question-content";

const safeHref = (href: unknown) => {
  if (typeof href !== "string") return undefined;
  return /^(https?:|mailto:)/i.test(href) ? href : undefined;
};

const renderMarks = (text: ReactNode, marks: JSONContent["marks"] = []) =>
  marks.reduce<ReactNode>((child, mark, index) => {
    const key = `${mark.type ?? "mark"}-${index}`;

    if (mark.type === "bold") return <strong key={key}>{child}</strong>;
    if (mark.type === "italic") return <em key={key}>{child}</em>;
    if (mark.type === "underline") return <u key={key}>{child}</u>;
    if (mark.type === "strike") return <s key={key}>{child}</s>;
    if (mark.type === "code") {
      return (
        <code key={key} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.9em]">
          {child}
        </code>
      );
    }
    if (mark.type === "link") {
      const href = safeHref(mark.attrs?.href);
      return href ? (
        <a key={key} href={href} target="_blank" rel="noreferrer" className="underline">
          {child}
        </a>
      ) : (
        child
      );
    }
    if (mark.type === "textStyle") {
      const style: CSSProperties = {
        color: typeof mark.attrs?.color === "string" ? mark.attrs.color : undefined,
        backgroundColor:
          typeof mark.attrs?.backgroundColor === "string"
            ? mark.attrs.backgroundColor
            : undefined,
        fontSize:
          typeof mark.attrs?.fontSize === "string" ? mark.attrs.fontSize : undefined,
        fontFamily:
          typeof mark.attrs?.fontFamily === "string" ? mark.attrs.fontFamily : undefined,
      };
      return (
        <span key={key} style={style}>
          {child}
        </span>
      );
    }

    return child;
  }, text);

const renderNode = (node: JSONContent, key: string): ReactNode => {
  if (node.type === "text") {
    return <span key={key}>{renderMarks(node.text ?? "", node.marks)}</span>;
  }
  if (node.type === "hardBreak") return <br key={key} />;
  if (node.type === "horizontalRule") return <hr key={key} className="my-3 border-border" />;

  const children = (node.content ?? []).map((child, index) =>
    renderNode(child, `${key}-${index}`),
  );
  const blockStyle: CSSProperties = {
    textAlign:
      typeof node.attrs?.textAlign === "string"
        ? (node.attrs.textAlign as CSSProperties["textAlign"])
        : undefined,
    backgroundColor:
      typeof node.attrs?.blockBackground === "string"
        ? node.attrs.blockBackground
        : undefined,
  };
  const hasBlockBackground = Boolean(blockStyle.backgroundColor);

  if (node.type === "paragraph") {
    return (
      <p
        key={key}
        style={blockStyle}
        className={cn(
          "min-h-[1.4em] whitespace-pre-wrap leading-relaxed",
          hasBlockBackground && "rounded-md px-3 py-2",
        )}
      >
        {children}
      </p>
    );
  }
  if (node.type === "heading") {
    const level = Number(node.attrs?.level) || 2;
    const className = cn(
      "font-heading font-bold leading-tight",
      level === 1 ? "text-2xl" : level === 2 ? "text-xl" : "text-lg",
      hasBlockBackground && "rounded-md px-3 py-2",
    );
    if (level === 1)
      return (
        <h1 key={key} style={blockStyle} className={className}>
          {children}
        </h1>
      );
    if (level === 3)
      return (
        <h3 key={key} style={blockStyle} className={className}>
          {children}
        </h3>
      );
    return (
      <h2 key={key} style={blockStyle} className={className}>
        {children}
      </h2>
    );
  }
  if (node.type === "bulletList") {
    return (
      <ul key={key} className="list-disc space-y-1 pl-5">
        {children}
      </ul>
    );
  }
  if (node.type === "orderedList") {
    return (
      <ol key={key} className="list-decimal space-y-1 pl-5">
        {children}
      </ol>
    );
  }
  if (node.type === "listItem") return <li key={key}>{children}</li>;
  if (node.type === "blockquote") {
    return (
      <blockquote key={key} className="border-l-2 border-primary/40 pl-3 italic">
        {children}
      </blockquote>
    );
  }

  return <span key={key}>{children}</span>;
};

export function RichQuestionContent({
  value,
  className,
}: {
  value?: string;
  className?: string;
}) {
  const doc = parseQuestionContent(value);

  return (
    <div className={cn("space-y-2 wrap-break-word", className)}>
      {(doc.content ?? []).map((node, index) => renderNode(node, `node-${index}`))}
    </div>
  );
}
