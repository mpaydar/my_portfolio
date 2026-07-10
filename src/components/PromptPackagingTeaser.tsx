import Link from "next/link";
import { promptPackagingTrack } from "@/lib/data";
import PromptLockIcon from "@/components/PromptLockIcon";

export default function PromptPackagingTeaser() {
  const { series, announcement } = promptPackagingTrack;

  return (
    <aside className="prompt-teaser" aria-label="Prompt Packaging">
      <div className="prompt-teaser-inner">
        <div className="prompt-teaser-copy">
          <p className="prompt-teaser-label">Engineer toolkit</p>
          <p className="prompt-teaser-title">{promptPackagingTrack.title}</p>
          <p className="prompt-teaser-subtitle">
            Series {series.number} · {series.title}
          </p>
        </div>

        <div className="prompt-teaser-meta">
          <span className="prompt-teaser-count">{announcement.statusNote}</span>
          <span className="prompt-teaser-focus">
            <PromptLockIcon className="h-3 w-3" />
            Azure · Python SDK
          </span>
        </div>

        <Link href="/prompt-packaging/optimization" className="prompt-teaser-link">
          concept preview
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
