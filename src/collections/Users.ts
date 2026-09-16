import type { Access, CollectionConfig } from "payload";

// Payload's default access for an unspecified operation is `Boolean(user)` —
// true for ANY authenticated session, including a self-registered `members`
// account (see src/collections/Members.ts). Admin accounts must only ever be
// managed by an existing admin (`users`-collection) session.
const isAdmin: Access = ({ req: { user } }) => user?.collection === "users";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    create: isAdmin,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
  },
  fields: [],
};
