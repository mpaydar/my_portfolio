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
import {
  hasPublishableContent,
  resolveSourceDocumentId,
} from "@/lib/document-import-utils";
import { SOURCE_DOCUMENT_MIME_TYPES } from "@/lib/document-types";
import { normalizeTagList, tagListsDiffer } from "@/lib/tag-normalization";

export const TechnicalReports: CollectionConfig = {
  slug: "technical-reports",
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "postType",
      "category",
      "interestCount",
      "publishedAt",
      "updatedAt",
    ],
    description:
      "Technical reports — Explainers (conceptual deep-dives) and Build Logs (real repo + dataset, reproducible pipelines).",
    group: "Content",
    components: {
      edit: {
        beforeDocumentControls: [
          "@/components/admin/PostQuickActions#PostQuickActions",
        ],
      },
      beforeListTable: [
        "@/components/admin/TagNormalizerPanel#TagNormalizerPanel",
      ],
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
      name: "postType",
      type: "select",
      options: [
        { label: "Explainer", value: "explainer" },
        { label: "Build Log", value: "build-log" },
      ],
      admin: {
        position: "sidebar",
        description:
          'Explainer = conceptual deep-dive. Build Log = real repo + dataset, reproducible pipeline. Leave unset if unsure.',
      },
    },
    {
      name: "tldr",
      type: "text",
      maxLength: 200,
      admin: {
        description:
          "Optional one-sentence summary, shown above the excerpt on preview cards.",
      },
    },
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
      name: "prerequisiteTag",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          'Optional reading-level hint, e.g. "Assumes: basic ARM/Bicep knowledge".',
      },
    },
    {
      type: "collapsible",
      label: "Proof of Work (optional)",
      admin: {
        initCollapsed: true,
        description:
          "For Build Log posts: link the real repo and dataset. Leave all blank for Explainer posts — the section won't render on the site unless at least one field is filled in.",
      },
      fields: [
        {
          name: "githubRepoUrl",
          type: "text",
          admin: {
            description:
              "Repo URL — renders as a styled link/button near the top of the post.",
          },
          validate: (value: string | null | undefined) => {
            if (!value) return true;
            try {
              new URL(value);
              return true;
            } catch {
              return "Enter a full URL, e.g. https://github.com/you/repo";
            }
          },
        },
        {
          name: "datasetUsed",
          type: "text",
          admin: {
            description:
              "Dataset name or link. Rendered as a link if it starts with http, plain text otherwise.",
          },
        },
        {
          name: "reproduceSteps",
          type: "richText",
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          admin: {
            description: "Optional step-by-step reproduction instructions.",
          },
        },
        {
          name: "proofOfWorkPreview",
          type: "ui",
          admin: {
            components: {
              Field:
                "@/components/admin/ProofOfWorkPreview#ProofOfWorkPreview",
            },
          },
        },
      ],
    },
    {
      name: "content",
      type: "richText",
      required: false,
      validate: (value, { data }) => {
        const docData = data as { sourceDocument?: unknown };
        if (value && hasRichTextBody(value as Parameters<typeof hasRichTextBody>[0])) {
          return true;
        }
        if (docData?.sourceDocument) {
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
      name: "interestCount",
      type: "number",
      defaultValue: 0,
      admin: {
        readOnly: true,
        position: "sidebar",
        description:
          "Times readers clicked \"Want more like this\" on the published post. Updated by the public reaction endpoint, not editable here.",
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
    beforeChange: [
      async ({ data, originalDoc, req, context }) => {
        if (context?.skipDocumentImport) return data;

        const previousSourceDocumentId = resolveSourceDocumentId(
          originalDoc?.sourceDocument as typeof data.sourceDocument,
        );

        const { applySourceDocumentImport } = await import(
          "@/lib/document-import"
        );

        return applySourceDocumentImport(req.payload, data, previousSourceDocumentId);
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;

        if (!hasPublishableContent(data)) {
          return data;
        }

        const sourceDocumentId = resolveSourceDocumentId(data.sourceDocument);
        if (
          sourceDocumentId &&
          !hasRichTextBody(data.content) &&
          data.documentImportStatus !== "imported"
        ) {
          data.documentImportStatus = "imported";
        }

        return data;
      },
    ],
  },
  endpoints: [
    {
      path: "/normalize-tags",
      method: "post",
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: "Authentication required." }, { status: 401 });
        }

        let apply = false;
        try {
          const body = (await req.json?.()) as { apply?: boolean } | undefined;
          apply = Boolean(body?.apply);
        } catch {
          apply = false;
        }

        const result = await req.payload.find({
          collection: "technical-reports",
          limit: 1000,
          depth: 0,
          overrideAccess: true,
          draft: true,
        });

        const changes: Array<{
          id: number;
          title: string;
          before: string[];
          after: string[];
        }> = [];

        for (const doc of result.docs) {
          const before = (doc.tags ?? []).map((t) => t.tag);
          const after = normalizeTagList(doc.tags ?? []);

          if (!tagListsDiffer(before, after)) continue;

          changes.push({ id: doc.id, title: doc.title, before, after });

          if (apply) {
            await req.payload.update({
              collection: "technical-reports",
              id: doc.id,
              data: { tags: after.map((tag) => ({ tag })) },
              overrideAccess: true,
              context: { skipDocumentImport: true },
            });
          }
        }

        return Response.json({ applied: apply, changes });
      },
    },
    {
      path: "/:id/react",
      method: "post",
      handler: async (req) => {
        const reportId = req.routeParams?.id;
        if (!reportId || Array.isArray(reportId)) {
          return Response.json({ error: "Post id is required." }, { status: 400 });
        }

        try {
          const current = await req.payload.findByID({
            collection: "technical-reports",
            id: reportId as string | number,
            depth: 0,
            overrideAccess: true,
          });

          const nextCount = (current.interestCount ?? 0) + 1;

          const updated = await req.payload.update({
            collection: "technical-reports",
            id: reportId as string | number,
            data: { interestCount: nextCount },
            overrideAccess: true,
            context: { skipDocumentImport: true },
          });

          return Response.json({ interestCount: updated.interestCount });
        } catch {
          return Response.json(
            { error: "Failed to record reaction." },
            { status: 400 },
          );
        }
      },
    },
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
