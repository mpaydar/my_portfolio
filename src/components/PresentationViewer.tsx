"use client";

import { useMemo, useState } from "react";
import type { PostPresentation } from "@/lib/posts";
import dynamic from "next/dynamic";

const PdfSlideViewer = dynamic(() => import("@/components/PdfSlideViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-surface font-mono text-sm text-muted">
      Loading slide viewer…
    </div>
  ),
});

type PresentationViewerProps = {
  presentation: PostPresentation;
  presentationProxyUrl: string;
  title: string;
};

function getOfficeEmbedUrl(fileUrl: string) {
  return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
}

function isPubliclyEmbeddable(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !parsed.hostname.includes("localhost");
  } catch {
    return false;
  }
}

export default function PresentationViewer({
  presentation,
  presentationProxyUrl,
  title,
}: PresentationViewerProps) {
  if (presentation.kind === "pdf") {
    return (
      <PdfSlideViewer
        fileUrl={presentationProxyUrl}
        downloadUrl={presentation.url}
        title={title}
      />
    );
  }

  return (
    <PptxSlideViewer
      presentation={presentation}
      presentationProxyUrl={presentationProxyUrl}
      title={title}
    />
  );
}

function PptxSlideViewer({
  presentation,
  presentationProxyUrl,
  title,
}: PresentationViewerProps) {
  const [embedFailed, setEmbedFailed] = useState(false);
  const embedSource = useMemo(() => {
    if (typeof window === "undefined") {
      return presentation.url;
    }

    try {
      return new URL(presentationProxyUrl, window.location.origin).toString();
    } catch {
      return presentation.url;
    }
  }, [presentation.url, presentationProxyUrl]);
  const canEmbed = useMemo(
    () => isPubliclyEmbeddable(embedSource),
    [embedSource],
  );
  const embedUrl = useMemo(
    () => getOfficeEmbedUrl(embedSource),
    [embedSource],
  );

  if (!canEmbed || embedFailed) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6 text-center sm:p-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          <SlidesIcon />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          PowerPoint deck attached
        </h3>
        <p className="mx-auto mb-5 max-w-md text-sm text-muted">
          {canEmbed
            ? "The embedded viewer could not load this deck. Download it to open in PowerPoint or Keynote."
            : "In-browser PowerPoint preview needs a public HTTPS URL (available after deploy). Download the file to view it locally."}
        </p>
        <a
          href={presentation.url}
          download={presentation.filename}
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-sm text-accent transition hover:border-accent hover:bg-accent/20"
        >
          <DownloadIcon />
          Download {presentation.filename}
        </a>
        <p className="mt-4 font-mono text-[11px] text-muted">{title}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="slide-stage mb-4 overflow-hidden rounded-xl border border-border bg-surface">
        <iframe
          src={embedUrl}
          title={`${title} slides`}
          className="aspect-video w-full min-h-[420px] bg-white"
          allowFullScreen
          onError={() => setEmbedFailed(true)}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 sm:px-4">
        <p className="font-mono text-xs text-muted sm:text-sm">
          PowerPoint presentation
        </p>
        <a
          href={presentation.url}
          download={presentation.filename}
          className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted transition hover:border-accent-dim hover:text-accent"
        >
          Download
        </a>
      </div>
    </div>
  );
}

function SlidesIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M7 20h10M12 16v4" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}
