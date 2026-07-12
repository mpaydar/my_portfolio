import type { AuthorPresence as AuthorPresenceData } from "@/lib/author-profile";

// Caller is responsible for not rendering this at all when there's no profile.
export default function AuthorPresence({
  author,
}: {
  author: AuthorPresenceData;
}) {
  return (
    <section className="border-b border-border" aria-label="About the author">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-6 py-6">
        {author.photo ? (
          <img
            src={author.photo.url}
            alt={author.photo.alt || author.name}
            width={56}
            height={56}
            className="h-14 w-14 shrink-0 rounded-full border border-border object-cover"
          />
        ) : null}
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{author.name}</p>
          {author.role ? (
            <p className="text-sm text-muted">{author.role}</p>
          ) : null}
          {author.focusStatement ? (
            <p className="mt-1 text-sm text-muted">{author.focusStatement}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
