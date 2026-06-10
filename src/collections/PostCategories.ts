import type { CollectionConfig } from "payload";
import { slugField } from "payload";

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
