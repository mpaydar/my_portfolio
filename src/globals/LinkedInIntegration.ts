import type { GlobalConfig } from "payload";

export const LinkedInIntegration: GlobalConfig = {
  slug: "linkedin-integration",
  label: "LinkedIn Integration",
  admin: {
    group: "Integrations",
    description:
      "Connect your LinkedIn account once, then share technical reports from each post in the CMS.",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "connectionPanel",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/admin/LinkedInConnectField#LinkedInConnectField",
        },
      },
    },
    {
      name: "memberUrn",
      type: "text",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "LinkedIn member URN used as the post author.",
      },
    },
    {
      name: "connectedAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "expiresAt",
      type: "date",
      admin: {
        readOnly: true,
        position: "sidebar",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "accessToken",
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "refreshToken",
      type: "text",
      admin: {
        hidden: true,
      },
    },
  ],
};
