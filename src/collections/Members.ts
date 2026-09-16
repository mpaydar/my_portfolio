import type { CollectionConfig } from "payload";

// Separate from the admin `Users` collection (never set as config.admin.user) —
// visitors who sign up here can never log into /admin. Payload still shares one
// session cookie across both auth collections; user.collection is what
// distinguishes them (see src/lib/community/session.ts).
export const Members: CollectionConfig = {
  slug: "members",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    create: () => true,
    read: ({ req: { user }, id }) => {
      if (user?.collection === "users") return true;
      return Boolean(user) && user?.collection === "members" && user.id === id;
    },
    update: ({ req: { user }, id }) => {
      if (user?.collection === "users") return true;
      return Boolean(user) && user?.collection === "members" && user.id === id;
    },
    delete: () => false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
