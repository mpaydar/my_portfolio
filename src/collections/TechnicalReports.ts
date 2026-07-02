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
import { hasRichTextBody } from "@/lib/rich-text";
import { SOURCE_DOCUMENT_MIME_TYPES } from "@/lib/document-types";

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
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      filterOptions: {
        mimeType: { contains: "image" },
      },
      admin: {
        description:
          "Hero image for cards and the post header. To place images inside the article body, use the upload button in the Content editor below.",
      },
    },
    {
      name: "sourceDocument",
      type: "upload",
      relationTo: "media",
      filterOptions: {
        mimeType: {
          in: [...SOURCE_DOCUMENT_MIME_TYPES],
        },
      },
      admin: {
        description:
          "Upload a PDF or Word document to publish as a technical report. Word files are imported into the article body automatically; PDFs are shown in a professional document reader.",
      },
    },
    {
      name: "documentImportStatus",
      type: "select",
      defaultValue: "idle",
      options: [
        { label: "Not imported", value: "idle" },
        { label: "Imported", value: "imported" },
        { label: "Import failed", value: "failed" },
      ],
      admin: {
        readOnly: true,
        position: "sidebar",
        condition: (_, siblingData) => Boolean(siblingData?.sourceDocument),
      },
    },
    {
      name: "documentImportError",
      type: "text",
      admin: {
        readOnly: true,
        position: "sidebar",
        condition: (_, siblingData) => siblingData?.documentImportStatus === "failed",
      },
    },
    {
      name: "lastImportedDocumentId",
      type: "number",
      admin: {
        hidden: true,
      },
    },
    {
      name: "presentation",
      type: "upload",
      relationTo: "media",
      filterOptions: {
        mimeType: {
          in: [
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.ms-powerpoint",
          ],
        },
      },
      admin: {
        description:
          "Optional slide deck (PDF or PowerPoint). Readers get an Article / Slides toggle on the published post. PDF gives the best in-browser experience.",
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
      required: false,
      validate: (value, { siblingData }) => {
        const data = siblingData as { sourceDocument?: unknown };
        if (value && hasRichTextBody(value as Parameters<typeof hasRichTextBody>[0])) {
          return true;
        }
        if (data.sourceDocument) {
          return true;
        }
        return "Add article content or upload a source document (PDF or Word).";
      },
      admin: {
        description:
          "Write directly or upload a Word document above — content is imported automatically. PDF reports use the document viewer instead.",
      },
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
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, req, context }) => {
        if (context?.skipDocumentImport) return;

        const sourceDocumentId =
          typeof doc.sourceDocument === "number"
            ? doc.sourceDocument
            : doc.sourceDocument?.id;

        if (!sourceDocumentId) return;

        const previousSourceDocumentId =
          typeof previousDoc?.sourceDocument === "number"
            ? previousDoc.sourceDocument
            : previousDoc?.sourceDocument?.id ?? null;

        const { maybeImportSourceDocument } = await import(
          "@/lib/document-import"
        );

        await maybeImportSourceDocument({
          payload: req.payload,
          reportId: doc.id,
          sourceDocumentId,
          previousSourceDocumentId,
          currentContent: doc.content,
          currentExcerpt: doc.excerpt,
          currentReadTime: doc.readTime,
        });
      },
    ],
  },
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
