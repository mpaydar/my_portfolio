import type { Payload } from "payload";
import type { TechnicalReport } from "@/payload-types";

type LexicalNode = {
  type?: string;
  children?: LexicalNode[];
  relationTo?: string;
  value?: unknown;
  [key: string]: unknown;
};

async function walkUploadNodes(
  payload: Payload,
  nodes: LexicalNode[],
): Promise<LexicalNode[]> {
  return Promise.all(
    nodes.map(async (node) => {
      if (
        node.type === "upload" &&
        typeof node.value === "number" &&
        node.relationTo === "media"
      ) {
        try {
          const doc = await payload.findByID({
            collection: "media",
            id: node.value,
            depth: 0,
          });

          return { ...node, value: doc };
        } catch {
          return node;
        }
      }

      if (node.children?.length) {
        return { ...node, children: await walkUploadNodes(payload, node.children) };
      }

      return node;
    }),
  );
}

export async function populateUploadNodesInContent(
  payload: Payload,
  content: TechnicalReport["content"] | null | undefined,
): Promise<TechnicalReport["content"] | undefined> {
  if (!content?.root?.children?.length) {
    return content ?? undefined;
  }

  return {
    ...content,
    root: {
      ...content.root,
      children: await walkUploadNodes(
        payload,
        content.root.children as LexicalNode[],
      ),
    },
  } as TechnicalReport["content"];
}
