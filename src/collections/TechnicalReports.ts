import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { POST_CATEGORY_OPTIONS } from "@/lib/post-categories";

export const TechnicalReports: CollectionConfig = {
  slug: "technical-reports",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "updatedAt"],
    description:
      "Daily technical reports — distributed systems, agentic apps, and scalable architecture.",
    group: "Content",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    slugField(),
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        description: "Short summary shown on the posts listing and home page.",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: POST_CATEGORY_OPTIONS,
      admin: {
        position: "sidebar",
        description: "Primary focus area for this post.",
      },
    },
    {
      name: "content",
      type: "richText",
      required: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ["h1", "h2", "h3", "h4"] }),
          UploadFeature({
            collections: {
              media: {
                fields: [{ name: "alt", type: "text", label: "Alt text" }],
              },
            },
          }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
    },
    {
      name: "tags",
      type: "array",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "readTime",
      type: "text",
      admin: {
        position: "sidebar",
        description: 'Estimated read time, e.g. "8 min"',
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === "published" && !value) {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
  ],
  versions: {
    drafts: {
      autosave: false,
    },
  },
};
