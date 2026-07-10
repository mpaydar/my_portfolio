import Link from "next/link";
import { promptPackagingTrack, promptPackages } from "@/lib/data";
import PromptLockIcon from "@/components/PromptLockIcon";

export default function PromptPackagingTeaser() {
  return (
    <aside className="prompt-teaser" aria-label="Prompt Packaging">
      <div className="prompt-teaser-inner">
        <div className="prompt-teaser-copy">
          <p className="prompt-teaser-label">Engineer toolkit</p>
          <p className="prompt-teaser-title">{promptPackagingTrack.title}</p>
          <p className="prompt-teaser-subtitle">
            Series {promptPackagingTrack.series.number} · {promptPackagingTrack.series.title}
          </p>
        </div>

        <div className="prompt-teaser-meta">
          <span className="prompt-teaser-count">
            {promptPackages.length} packages live
          </span>
          <span className="prompt-teaser-focus">
            <PromptLockIcon className="h-3 w-3" />
            Azure · Python SDK
          </span>
        </div>

        <Link href="/prompt-packaging" className="prompt-teaser-link">
          browse prompts
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
