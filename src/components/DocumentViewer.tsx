"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { PostSourceDocument } from "@/lib/posts";

const PdfDocumentViewer = dynamic(() => import("@/components/PdfDocumentViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-surface font-mono text-sm text-muted">
      Loading document viewer…
    </div>
  ),
});

type DocumentViewerProps = {
  document: PostSourceDocument;
  documentProxyUrl: string;
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

export default function DocumentViewer({
  document,
  documentProxyUrl,
  title,
}: DocumentViewerProps) {
  if (document.kind === "pdf") {
    return (
      <PdfDocumentViewer
        fileUrl={documentProxyUrl}
        downloadUrl={document.url}
        title={title}
      />
    );
  }

  return (
    <WordDocumentViewer
      document={document}
      documentProxyUrl={documentProxyUrl}
      title={title}
    />
  );
}

function WordDocumentViewer({
  document,
  documentProxyUrl,
  title,
}: DocumentViewerProps) {
  const [embedFailed, setEmbedFailed] = useState(false);
  const embedSource = useMemo(() => {
    if (typeof window === "undefined") {
      return document.url;
    }

    try {
      return new URL(documentProxyUrl, window.location.origin).toString();
    } catch {
      return document.url;
    }
  }, [document.url, documentProxyUrl]);
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
      <div className="document-fallback rounded-xl border border-border bg-surface p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          <DocumentIcon />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Word document attached
        </h3>
        <p className="mx-auto mb-5 max-w-md text-sm text-muted">
          {canEmbed
            ? "The embedded viewer could not load this document. Download it to open in Word or Pages."
            : "In-browser Word preview needs a public HTTPS URL (available after deploy). Download the file to view it locally."}
        </p>
        <a
          href={document.url}
          download={document.filename}
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-sm text-accent transition hover:border-accent hover:bg-accent/20"
        >
          Download {document.filename}
        </a>
        <p className="mt-4 font-mono text-[11px] text-muted">{title}</p>
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <div className="document-toolbar flex flex-wrap items-center justify-between gap-3 rounded-t-xl border border-b-0 border-border bg-surface px-4 py-3">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Technical report
          </p>
          <p className="text-sm font-medium text-foreground">{title}</p>
        </div>
        <a
          href={document.url}
          download={document.filename}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition hover:border-accent hover:text-accent"
        >
          Download original
        </a>
      </div>
      <iframe
        src={embedUrl}
        title={`${title} document`}
        className="document-iframe w-full rounded-b-xl border border-border bg-white"
        allowFullScreen
        onError={() => setEmbedFailed(true)}
      />
    </div>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h8M8 9h2" />
    </svg>
  );
}
