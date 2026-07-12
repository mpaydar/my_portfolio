import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: {
    group: "Content",
    description: "Site-wide display settings for the public frontend.",
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "reactionCountThreshold",
      type: "number",
      defaultValue: 3,
      min: 0,
      admin: {
        description:
          'Minimum "Want more like this" count before the number is shown publicly. Below this threshold, only the button renders — no visible tally.',
      },
    },
  ],
};
