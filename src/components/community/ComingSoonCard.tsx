import type { CommunityFeature } from "@/lib/community/features";

export default function ComingSoonCard({
  icon,
  title,
  description,
}: CommunityFeature) {
  return (
    <div className="card relative rounded-xl p-5">
      <span className="absolute right-4 top-4 rounded-full border border-border bg-surface-hover px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wide text-muted">
        Coming soon
      </span>
      <span className="mb-2 block font-mono text-lg text-accent">{icon}</span>
      <h3 className="mb-1 font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{description}</p>
    </div>
  );
}
