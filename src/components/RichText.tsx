import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as SerializeRichText,
  UploadJSXConverter,
} from "@payloadcms/richtext-lexical/react";
import { resolveMediaUrl } from "@/lib/media-url";
import type { Media, TechnicalReport } from "@/payload-types";

function isMedia(value: unknown): value is Media {
  return typeof value === "object" && value !== null && "url" in value;
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
    if (!isMedia(node.value)) return null;

    const media = node.value;
    const src = resolveMediaUrl(media.url);
    if (!src) return null;

    const alt =
      (typeof node.fields?.alt === "string" ? node.fields.alt : "") ||
      media.alt ||
      "";

    return (
      <figure className="article-figure">
        <img
          src={src}
          alt={alt}
          width={media.width ?? undefined}
          height={media.height ?? undefined}
          loading="lazy"
        />
        {alt ? <figcaption>{alt}</figcaption> : null}
      </figure>
    );
  },
});

export default function RichText({
  data,
}: {
  data: NonNullable<TechnicalReport["content"]>;
}) {
  return (
    <div className="article-prose">
      <SerializeRichText converters={jsxConverters} data={data} />
    </div>
  );
}
