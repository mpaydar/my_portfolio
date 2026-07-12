import RichText from "@/components/RichText";
import type { ProofOfWork } from "@/lib/posts";
import type { TechnicalReport } from "@/payload-types";

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

// Caller is responsible for not rendering this at all when proofOfWork is null.
export default function ProofOfWorkPanel({
  proofOfWork,
}: {
  proofOfWork: ProofOfWork;
}) {
  const { githubRepoUrl, datasetUsed, reproduceSteps } = proofOfWork;

  return (
    <section
      className="mb-8 rounded-xl border border-accent/30 bg-accent/5 p-5 sm:p-6"
      aria-label="Proof of work"
    >
      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
        Proof of Work
      </p>

      {githubRepoUrl || datasetUsed ? (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {githubRepoUrl ? (
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-sm text-accent transition hover:border-accent hover:bg-accent/20"
            >
              View repo ↗
            </a>
          ) : null}
          {datasetUsed ? (
            isHttpUrl(datasetUsed) ? (
              <a
                href={datasetUsed}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-muted transition hover:text-accent"
              >
                Dataset ↗
              </a>
            ) : (
              <span className="font-mono text-sm text-muted">
                Dataset: {datasetUsed}
              </span>
            )
          ) : null}
        </div>
      ) : null}

      {reproduceSteps ? (
        <div>
          <p className="mb-2 text-sm font-semibold text-foreground">
            Reproduce this
          </p>
          <RichText
            data={reproduceSteps as NonNullable<TechnicalReport["content"]>}
          />
        </div>
      ) : null}
    </section>
  );
}
