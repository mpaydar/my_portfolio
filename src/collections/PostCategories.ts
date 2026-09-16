import type { Access, CollectionConfig } from "payload";
import { slugField } from "payload";

// Payload's default access for an unspecified operation is `Boolean(user)` —
// true for any authenticated session, including a self-registered `members`
// account. Writes here must be restricted to admin (`users`-collection) sessions.
const isAdmin: Access = ({ req: { user } }) => user?.collection === "users";

export const PostCategories: CollectionConfig = {
  slug: "post-categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    description:
      "Reusable focus areas for technical reports. Add a new category here when the existing ones do not fit.",
    group: "Content",
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      unique: true,
    },
    slugField(),
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Optional text shown under the category heading on the posts page.",
      },
    },
  ],
};
