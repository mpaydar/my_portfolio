import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as SerializeRichText,
} from "@payloadcms/richtext-lexical/react";
import type { TechnicalReport } from "@/payload-types";

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
});

export default function RichText({
  data,
}: {
  data: TechnicalReport["content"];
}) {
  return (
    <div className="rich-text text-base leading-relaxed text-zinc-700 dark:text-zinc-300 [&_a]:text-emerald-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-zinc-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_h1]:mb-4 [&_h1]:mt-8 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-4 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-zinc-900 [&_pre]:p-4 [&_pre]:text-zinc-100 [&_ul]:my-4 [&_ul]:list-disc">
      <SerializeRichText converters={jsxConverters} data={data} />
    </div>
  );
}
