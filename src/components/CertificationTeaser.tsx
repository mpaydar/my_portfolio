import Image from "next/image";
import Link from "next/link";
import { certificationTrack, certifications } from "@/lib/data";

export default function CertificationTeaser() {
  const earned = certifications.filter((cert) => cert.status === "earned");
  const inProgress = certifications.filter((cert) => cert.status === "in-progress");

  return (
    <aside className="cert-teaser" aria-label="Certification progress">
      <div className="cert-teaser-inner">
        <div className="cert-teaser-copy">
          <p className="cert-teaser-label">Currently preparing</p>
          <p className="cert-teaser-title">{certificationTrack.title}</p>
        </div>

        <div className="cert-teaser-badges" aria-hidden={earned.length === 0}>
          {earned.map((cert) =>
            cert.image ? (
              <div key={cert.id} className="cert-teaser-thumb-wrap" title={cert.title}>
                <Image
                  src={cert.image}
                  alt=""
                  width={72}
                  height={54}
                  className="cert-teaser-thumb"
                />
              </div>
            ) : null,
          )}
          {inProgress.length > 0 ? (
            <span className="cert-teaser-progress">
              <span className="cert-teaser-progress-dot" />
              {inProgress.length} in progress
            </span>
          ) : null}
        </div>

        <Link href="/about#certifications" className="cert-teaser-link">
          badges & progress
          <span aria-hidden>→</span>
        </Link>
      </div>
    </aside>
  );
}
