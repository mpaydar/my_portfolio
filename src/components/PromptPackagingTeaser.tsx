import Link from "next/link";
import { promptPackagingTrack, promptPackages } from "@/lib/data";

export default function PromptPackagingTeaser() {
  return (
    <aside className="prompt-teaser" aria-label="Prompt Packaging">
      <div className="prompt-teaser-inner">
        <div className="prompt-teaser-copy">
          <p className="prompt-teaser-label">Engineer toolkit</p>
          <p className="prompt-teaser-title">{promptPackagingTrack.title}</p>
          <p className="prompt-teaser-subtitle">{promptPackagingTrack.subtitle}</p>
        </div>

        <div className="prompt-teaser-meta">
          <span className="prompt-teaser-count">
            {promptPackages.length} packages
          </span>
          <span className="prompt-teaser-focus">Azure · Python SDK</span>
        </div>

        <Link href="/prompt-packaging" className="prompt-teaser-link">
          browse prompts
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
