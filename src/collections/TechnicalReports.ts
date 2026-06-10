import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  UploadFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";
import { slugField } from "payload";

import { getSiteUrl } from "@/lib/linkedin/config";

export const TechnicalReports: CollectionConfig = {
  slug: "technical-reports",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "publishedAt", "updatedAt"],
    description:
      "Daily technical reports — distributed systems, agentic apps, and scalable architecture.",
    group: "Content",
    components: {
      edit: {
        beforeDocumentControls: [
          "@/components/admin/PostQuickActions#PostQuickActions",
        ],
      },
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "editorDashboard",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/admin/PostEditorDashboard#PostEditorDashboard",
        },
      },
    },
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
      type: "relationship",
      relationTo: "post-categories",
      required: true,
      admin: {
        position: "sidebar",
        description:
          "Primary focus area for this post. Create a new category if none of the existing categories fit.",
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
    {
      type: "collapsible",
      label: "LinkedIn",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: "linkedInSharePanel",
          type: "ui",
          admin: {
            components: {
              Field:
                "@/components/admin/LinkedInConnectField#ShareToLinkedInField",
            },
          },
        },
        {
          name: "linkedInCommentary",
          type: "textarea",
          admin: {
            description:
              "Optional custom LinkedIn post text. Leave blank to auto-compose from title, excerpt, and blog URL.",
          },
        },
        {
          name: "linkedInAttachment",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Optional image or MP4 video attached to the LinkedIn post.",
          },
        },
        {
          name: "linkedInPostId",
          type: "text",
          admin: {
            readOnly: true,
            description: "LinkedIn post URN returned by the API.",
          },
        },
        {
          name: "linkedInPostUrl",
          type: "text",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "linkedInSharedAt",
          type: "date",
          admin: {
            readOnly: true,
            date: { pickerAppearance: "dayAndTime" },
          },
        },
      ],
    },
  ],
  endpoints: [
    {
      path: "/:id/share-linkedin",
      method: "post",
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: "Authentication required." }, { status: 401 });
        }

        const reportId = req.routeParams?.id;
        if (!reportId || Array.isArray(reportId)) {
          return Response.json({ error: "Post id is required." }, { status: 400 });
        }

        try {
          const { shareTechnicalReportToLinkedIn } = await import(
            "@/lib/linkedin/share"
          );
          const result = await shareTechnicalReportToLinkedIn(
            req.payload,
            reportId as string | number,
            getSiteUrl(req.url ? new URL(req.url).origin : undefined),
          );

          return Response.json({
            message: "Post shared to LinkedIn.",
            postId: result.postId,
            postUrl: result.postUrl,
            sharedAt: result.sharedAt,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to share to LinkedIn.";

          return Response.json({ error: message }, { status: 400 });
        }
      },
    },
  ],
  versions: {
    drafts: {
      autosave: false,
    },
  },
};
