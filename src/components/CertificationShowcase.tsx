import Image from "next/image";
import {
  certificationTrack,
  certifications,
  type Certification,
  type CertificationStatus,
} from "@/lib/data";

function formatCertDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusLabel(status: CertificationStatus) {
  switch (status) {
    case "earned":
      return "Earned";
    case "in-progress":
      return "In progress";
    case "planned":
      return "Planned";
  }
}

function StatusBadge({ status }: { status: CertificationStatus }) {
  return (
    <span className={`cert-status cert-status--${status}`}>
      {status === "in-progress" ? (
        <span className="cert-status-pulse" aria-hidden />
      ) : null}
      {statusLabel(status)}
    </span>
  );
}

function CertificationCard({ certification }: { certification: Certification }) {
  return (
    <article className="cert-card">
      <div
        className="cert-card-accent"
        style={{ background: certification.accent }}
        aria-hidden
      />

      <div className="cert-card-body">
        <div className="cert-card-header">
          <div>
            <p className="cert-issuer">{certification.issuer}</p>
            <h3 className="cert-title">{certification.title}</h3>
          </div>
          <StatusBadge status={certification.status} />
        </div>

        {certification.image ? (
          <figure className="cert-image-frame">
            <Image
              src={certification.image}
              alt={certification.imageAlt || certification.title}
              width={640}
              height={480}
              className="cert-image"
            />
          </figure>
        ) : (
          <div className="cert-placeholder" style={{ borderColor: `${certification.accent}44` }}>
            <div
              className="cert-placeholder-icon"
              style={{
                color: certification.accent,
                borderColor: `${certification.accent}55`,
                background: `${certification.accent}12`,
              }}
            >
              <BadgeIcon />
            </div>
            <p className="cert-placeholder-text">
              Badge in progress — updated here when earned
            </p>
          </div>
        )}

        <div className="cert-card-footer">
          {certification.earnedDate ? (
            <p className="cert-date">
              Completed {formatCertDate(certification.earnedDate)}
            </p>
          ) : (
            <p className="cert-date cert-date--muted">
              Working toward exam readiness
            </p>
          )}

          <div className="cert-skills">
            {certification.skills.map((skill) => (
              <span key={skill} className="cert-skill">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CertificationShowcase() {
  const earnedCount = certifications.filter((c) => c.status === "earned").length;

  return (
    <section className="cert-showcase" id="certifications" aria-labelledby="certifications-heading">
      <div className="cert-track-banner">
        <div className="cert-track-copy">
          <p className="section-label mb-2">Current focus</p>
          <h2 id="certifications-heading" className="cert-track-title">
            {certificationTrack.title}
          </h2>
          <p className="cert-track-subtitle">{certificationTrack.subtitle}</p>
          <p className="cert-track-description">{certificationTrack.description}</p>
        </div>

        <div className="cert-track-stats" aria-label="Certification progress">
          <div className="cert-stat">
            <span className="cert-stat-value">{earnedCount}</span>
            <span className="cert-stat-label">Earned</span>
          </div>
          <div className="cert-stat-divider" aria-hidden />
          <div className="cert-stat">
            <span className="cert-stat-value">
              {certifications.filter((c) => c.status === "in-progress").length}
            </span>
            <span className="cert-stat-label">In progress</span>
          </div>
          <div className="cert-stat-divider" aria-hidden />
          <div className="cert-stat">
            <span className="cert-stat-value">{certifications.length}</span>
            <span className="cert-stat-label">On the board</span>
          </div>
        </div>
      </div>

      <div className="cert-grid">
        {certifications.map((certification) => (
          <CertificationCard key={certification.id} certification={certification} />
        ))}
      </div>
    </section>
  );
}

function BadgeIcon() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="12" cy="8" r="5" />
      <path d="M8.5 14.5L7 22l5-2.5L17 22l-1.5-7.5" />
    </svg>
  );
}
