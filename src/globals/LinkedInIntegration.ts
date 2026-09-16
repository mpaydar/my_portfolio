import type { Access, FieldAccess, GlobalConfig } from "payload";

// Payload's default access for an unspecified operation is `Boolean(user)` —
// true for any authenticated session, including a self-registered `members`
// account. This global holds LinkedIn OAuth tokens, so both the global and its
// token fields must be restricted to admin (`users`-collection) sessions.
const isAdmin: Access = ({ req: { user } }) => user?.collection === "users";
const isAdminField: FieldAccess = ({ req: { user } }) => user?.collection === "users";

export const LinkedInIntegration: GlobalConfig = {
  slug: "linkedin-integration",
  label: "LinkedIn Integration",
  admin: {
    group: "Integrations",
    description:
      "Connect your LinkedIn account once, then share technical reports from each post in the CMS.",
  },
  access: {
    read: isAdmin,
    update: isAdmin,
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
      access: {
        read: isAdminField,
      },
    },
    {
      name: "refreshToken",
      type: "text",
      admin: {
        hidden: true,
      },
      access: {
        read: isAdminField,
      },
    },
  ],
};
