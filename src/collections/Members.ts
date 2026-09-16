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
      if (user?.collection !== "members") return false;
      return id ? user.id === id : { id: { equals: user.id } };
    },
    update: ({ req: { user }, id }) => {
      if (user?.collection === "users") return true;
      if (user?.collection !== "members") return false;
      return id ? user.id === id : { id: { equals: user.id } };
    },
    delete: () => false,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "password",
      type: "text",
      hidden: true,
      validate: (value: string | null | undefined) => {
        if (!value || value.length < 8) {
          return "Password must be at least 8 characters.";
        }
        return true;
      },
    },
  ],
};
