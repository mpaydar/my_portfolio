import type { TechnicalReport } from "@/payload-types";

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

function nodeHasText(node: LexicalNode): boolean {
  if (node.type === "text" && node.text?.trim()) {
    return true;
  }

  return node.children?.some(nodeHasText) ?? false;
}

export function hasRichTextBody(
  content: TechnicalReport["content"] | null | undefined,
): boolean {
  const children = content?.root?.children as LexicalNode[] | undefined;
  if (!children?.length) return false;
  return children.some(nodeHasText);
}
