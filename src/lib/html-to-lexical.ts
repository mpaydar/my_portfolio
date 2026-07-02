import { createHeadlessEditor } from "@lexical/headless";
import { $generateNodesFromDOM } from "@lexical/html";
import { LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $getRoot, $insertNodes, ParagraphNode, TextNode } from "lexical";
import { JSDOM } from "jsdom";

import type { TechnicalReport } from "@/payload-types";

const editor = createHeadlessEditor({
  nodes: [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
  ],
});

export function htmlToLexicalContent(
  html: string,
): TechnicalReport["content"] {
  editor.update(
    () => {
      const dom = new JSDOM(`<body>${html}</body>`);
      const nodes = $generateNodesFromDOM(editor, dom.window.document);
      const root = $getRoot();
      root.clear();
      $insertNodes(nodes);
    },
    { discrete: true },
  );

  const serialized = editor.getEditorState().toJSON();

  return {
    root: serialized.root,
  } as TechnicalReport["content"];
}
