import type { GlobalConfig } from "payload";

export const AuthorProfile: GlobalConfig = {
  slug: "author-profile",
  label: "Author Profile",
  admin: {
    group: "Content",
    description:
      "Rendered near the top of the homepage. Stays fully hidden until at least a name is set — no placeholder shows in the meantime.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      filterOptions: {
        mimeType: { contains: "image" },
      },
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "role",
      type: "text",
    },
    {
      name: "focusStatement",
      type: "textarea",
      admin: {
        description: "One-line statement of what you're currently focused on.",
      },
    },
  ],
};
