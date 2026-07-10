import {
  promptPackagingTrack,
  promptPackages,
} from "@/lib/data";
import PromptPackageCard from "@/components/PromptPackageCard";

export default function PromptPackagingShowcase() {
  return (
    <section className="prompt-showcase" aria-labelledby="prompt-packaging-heading">
      <div className="prompt-track-banner">
        <div className="prompt-track-copy">
          <p className="section-label mb-2">Methodology</p>
          <h2 id="prompt-packaging-heading" className="prompt-track-title">
            {promptPackagingTrack.title}
          </h2>
          <p className="prompt-track-subtitle">{promptPackagingTrack.subtitle}</p>
          <p className="prompt-track-description">
            {promptPackagingTrack.description}
          </p>
        </div>

        <div className="prompt-track-stats" aria-label="Prompt packaging focus">
          <div className="prompt-stat">
            <span className="prompt-stat-value">{promptPackages.length}</span>
            <span className="prompt-stat-label">Planned</span>
          </div>
          <div className="prompt-stat-divider" aria-hidden />
          <div className="prompt-stat">
            <span className="prompt-stat-value">
              {promptPackagingTrack.series.number}
            </span>
            <span className="prompt-stat-label">Series</span>
          </div>
        </div>
      </div>

      <div className="prompt-focus-pills" aria-label="Primary focus areas">
        {promptPackagingTrack.focusAreas.map((area) => (
          <span key={area} className="prompt-focus-pill">
            {area}
          </span>
        ))}
      </div>

      <div className="prompt-planned-header">
        <h3 className="prompt-planned-title">Planned packages</h3>
        <p className="prompt-planned-copy">
          Series {promptPackagingTrack.series.number} is in preparation. These
          packages are planned — prompts are not available yet.
        </p>
      </div>

      <div className="prompt-grid">
        {promptPackages.map((pkg) => (
          <PromptPackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
