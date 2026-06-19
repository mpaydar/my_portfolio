"use client";

import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PdfSlideViewerProps = {
  url: string;
  title: string;
};

export default function PdfSlideViewer({ url, title }: PdfSlideViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const goToPrevious = useCallback(() => {
    setPageNumber((current) => Math.max(current - 1, 1));
  }, []);

  const goToNext = useCallback(() => {
    setPageNumber((current) => Math.min(current + 1, numPages || current));
  }, [numPages]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goToPrevious();
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
        event.preventDefault();
        goToNext();
      }
      if (event.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToNext, goToPrevious, isFullscreen]);

  useEffect(() => {
    function updateWidth() {
      const shell = document.getElementById("pdf-slide-shell");
      if (shell) {
        setContainerWidth(shell.clientWidth);
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [isFullscreen]);

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-background"
          : "flex flex-col"
      }
    >
      <div
        id="pdf-slide-shell"
        className={
          isFullscreen
            ? "flex flex-1 flex-col overflow-hidden px-4 py-4 sm:px-8"
            : "flex flex-col"
        }
      >
        <div className="slide-stage mb-4 flex flex-1 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface p-2 sm:p-4">
          {loadError ? (
            <div className="px-6 text-center">
              <p className="mb-3 text-sm text-muted">{loadError}</p>
              <a
                href={url}
                download
                className="font-mono text-sm text-accent transition hover:text-foreground"
              >
                Download PDF instead
              </a>
            </div>
          ) : (
            <Document
              file={url}
              onLoadSuccess={({ numPages: total }) => {
                setNumPages(total);
                setPageNumber(1);
                setLoadError(null);
              }}
              onLoadError={() => {
                setLoadError("Could not load this PDF in the browser.");
              }}
              loading={
                <div className="flex h-64 items-center justify-center font-mono text-sm text-muted">
                  Loading slides…
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                width={containerWidth ? Math.min(containerWidth - 32, 960) : undefined}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
                loading={
                  <div className="flex h-64 items-center justify-center font-mono text-sm text-muted">
                    Rendering slide…
                  </div>
                }
              />
            </Document>
          )}
        </div>

        <div className="slide-controls flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              disabled={pageNumber <= 1}
              aria-label="Previous slide"
              className="slide-nav-btn"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={goToNext}
              disabled={!numPages || pageNumber >= numPages}
              aria-label="Next slide"
              className="slide-nav-btn"
            >
              <ChevronRightIcon />
            </button>
          </div>

          <p className="font-mono text-xs text-muted sm:text-sm">
            Slide{" "}
            <span className="text-foreground">{pageNumber}</span>
            {numPages ? (
              <>
                {" "}
                of <span className="text-foreground">{numPages}</span>
              </>
            ) : null}
          </p>

          <div className="flex items-center gap-2">
            <a
              href={url}
              download
              className="rounded-md border border-border px-2.5 py-1.5 font-mono text-xs text-muted transition hover:border-accent-dim hover:text-accent"
            >
              Download
            </a>
            <button
              type="button"
              onClick={() => setIsFullscreen((value) => !value)}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              className="slide-nav-btn"
            >
              {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
            </button>
          </div>
        </div>

        <p className="mt-2 text-center font-mono text-[11px] text-muted">
          Use arrow keys or space to navigate · {title}
        </p>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function MaximizeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
    </svg>
  );
}

function MinimizeIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
    </svg>
  );
}
