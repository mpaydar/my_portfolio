import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as SerializeRichText,
  UploadJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import type { Media, TechnicalReport } from "@/payload-types";

function isMedia(value: unknown): value is Media {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    typeof (value as Media).url === "string"
  );
}

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({
    internalDocToHref: ({ linkNode }) => {
      const { value, relationTo } = linkNode.fields.doc!;
      if (typeof value !== "object") return "#";
      const slug = value.slug;
      return relationTo === "technical-reports"
        ? `/posts/${slug}`
        : `/${slug}`;
    },
  }),
  ...UploadJSXConverter,
  upload: ({ node }) => {
    if (!isMedia(node.value) || !node.value.url) return null;
    const media = node.value;

    return (
      <figure className="my-8">
        <img
          src={media.url!}
          alt={media.alt || ""}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          className="w-full rounded-xl border border-border"
        />
        {media.alt && (
          <figcaption className="mt-2 text-center font-mono text-xs text-muted">
            {media.alt}
          </figcaption>
        )}
      </figure>
    );
  },
});

export default function RichText({
  data,
}: {
  data: TechnicalReport["content"];
}) {
  return (
    <div className="rich-text text-base leading-relaxed text-muted [&_a]:text-accent [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-surface-hover [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-accent [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:ml-4 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:text-foreground [&_ul]:my-4 [&_ul]:list-disc">
      <SerializeRichText converters={jsxConverters} data={data} />
    </div>
  );
}
