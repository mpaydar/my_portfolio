import type { PostType } from "@/lib/posts";

const LABELS: Record<PostType, string> = {
  explainer: "Explainer",
  "build-log": "Build Log",
};

// Neutral styling on purpose — neither post type should visually outrank the other.
export default function PostTypeTag({
  postType,
  className = "",
}: {
  postType: PostType | null;
  className?: string;
}) {
  if (!postType) return null;

  return (
    <span
      className={`rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted ${className}`.trim()}
    >
      {LABELS[postType]}
    </span>
  );
}
