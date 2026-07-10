import Link from "next/link";
import { promptPackagingTrack } from "@/lib/data";
import PromptLockIcon from "@/components/PromptLockIcon";

export default function PromptPackagingAnnouncement({
  variant = "hero",
}: {
  variant?: "hero" | "inline";
}) {
  const { announcement, series } = promptPackagingTrack;
  const isPreparing = series.status === "preparing";

  if (variant === "inline") {
    return (
      <aside
        className="prompt-announcement prompt-announcement--inline"
        aria-label="Prompt Packaging announcement"
      >
        <div className="prompt-announcement-icon-wrap" aria-hidden>
          <PromptLockIcon className="h-5 w-5" />
        </div>
        <div className="prompt-announcement-copy">
          <div className="prompt-announcement-meta">
            <span className="prompt-announcement-badge">{announcement.badge}</span>
            <span className="prompt-announcement-series">
              Series {series.number} · {isPreparing ? announcement.statusNote : "Available"}
            </span>
          </div>
          <p className="prompt-announcement-title">{announcement.title}</p>
          <p className="prompt-announcement-description">{announcement.description}</p>
        </div>
        {isPreparing ? (
          <div className="prompt-announcement-stats" aria-label="Availability status">
            <span className="prompt-announcement-stat prompt-announcement-stat--locked">
              <PromptLockIcon className="h-3.5 w-3.5" />
              {announcement.footnote}
            </span>
          </div>
        ) : null}
      </aside>
    );
  }

  return (
    <section
      className="prompt-announcement prompt-announcement--hero"
      aria-label="Prompt Packaging announcement"
    >
      <div className="prompt-announcement-glow" aria-hidden />
      <div className="prompt-announcement-inner">
        <div className="prompt-announcement-icon-wrap prompt-announcement-icon-wrap--hero" aria-hidden>
          <PromptLockIcon className="h-6 w-6" />
        </div>

        <div className="prompt-announcement-copy">
          <div className="prompt-announcement-meta">
            <span className="prompt-announcement-badge">{announcement.badge}</span>
            <span className="prompt-announcement-series">
              Series {series.number}: {series.title}
            </span>
          </div>
          <h2 className="prompt-announcement-title">{announcement.title}</h2>
          <p className="prompt-announcement-description">{announcement.description}</p>
          <div className="prompt-announcement-foot">
            <span className="prompt-announcement-pill">
              {announcement.statusNote}
            </span>
            <span className="prompt-announcement-pill prompt-announcement-pill--muted">
              {announcement.footnote}
            </span>
          </div>
        </div>

        <Link href="/prompt-packaging" className="prompt-announcement-cta">
          <PromptLockIcon className="h-4 w-4" />
          {announcement.cta}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
