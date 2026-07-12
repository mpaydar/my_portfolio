// Pure data-structure walk, no framework imports — safe to use from client
// components (unlike the full RichText renderer, which pulls in server-only
// code through resolveMediaUrl's dependency chain).
type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
};

function collectText(node: LexicalNode, out: string[]): void {
  if (node.type === "text" && node.text) {
    out.push(node.text);
  }
  node.children?.forEach((child) => collectText(child, out));
}

export function extractLexicalPlainText(
  content: { root?: { children?: LexicalNode[] } } | null | undefined,
): string {
  const children = content?.root?.children;
  if (!children?.length) return "";

  const out: string[] = [];
  children.forEach((child) => collectText(child, out));
  return out.join(" ").trim();
}
