"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfDocumentViewerProps = {
  fileUrl: string;
  downloadUrl: string;
  title: string;
};

export default function PdfDocumentViewer({
  fileUrl,
  downloadUrl,
  title,
}: PdfDocumentViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    function updateWidth() {
      const shell = document.getElementById("pdf-document-shell");
      if (shell) {
        setContainerWidth(shell.clientWidth);
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  if (loadError) {
    return (
      <div className="document-fallback rounded-xl border border-border bg-surface p-8 text-center">
        <p className="mb-4 text-sm text-muted">{loadError}</p>
        <a
          href={downloadUrl}
          download
          className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-2 font-mono text-sm text-accent transition hover:border-accent hover:bg-accent/20"
        >
          Download PDF
        </a>
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
        <div className="flex items-center gap-3">
          {numPages ? (
            <p className="font-mono text-xs text-muted">
              {numPages} {numPages === 1 ? "page" : "pages"}
            </p>
          ) : null}
          <a
            href={downloadUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted transition hover:border-accent hover:text-accent"
          >
            <DownloadIcon />
            Download
          </a>
        </div>
      </div>

      <div
        id="pdf-document-shell"
        className="document-pages rounded-b-xl border border-border bg-[#525659] p-4 sm:p-6"
      >
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages: total }) => {
            setNumPages(total);
            setLoadError(null);
          }}
          onLoadError={(error) => {
            console.error("PDF document viewer failed to load:", error);
            setLoadError("Could not load this PDF in the browser.");
          }}
          loading={
            <div className="flex h-64 items-center justify-center font-mono text-sm text-white/70">
              Loading document…
            </div>
          }
        >
          {numPages > 0
            ? Array.from({ length: numPages }, (_, index) => (
                <Page
                  key={`page-${index + 1}`}
                  pageNumber={index + 1}
                  width={
                    containerWidth
                      ? Math.min(containerWidth - 32, 920)
                      : undefined
                  }
                  renderTextLayer
                  renderAnnotationLayer
                  className="document-page mx-auto mb-6 shadow-2xl last:mb-0"
                  loading={
                    <div className="flex h-96 items-center justify-center font-mono text-sm text-white/70">
                      Rendering page {index + 1}…
                    </div>
                  }
                />
              ))
            : null}
        </Document>
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12m0 0l4-4m-4 4l-4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
  );
}
