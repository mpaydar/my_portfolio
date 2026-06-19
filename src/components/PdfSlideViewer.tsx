"use client";

import { useCallback, useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import SlidesFocusFrame from "@/components/SlidesFocusFrame";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type PdfSlideViewerProps = {
  /** Same-origin proxy URL used by pdf.js (avoids cross-origin fetch issues). */
  fileUrl: string;
  /** Direct URL for downloads. */
  downloadUrl: string;
  title: string;
  focusMode?: boolean;
  onExitFocus?: () => void;
};

export default function PdfSlideViewer({
  fileUrl,
  downloadUrl,
  title,
  focusMode = false,
  onExitFocus,
}: PdfSlideViewerProps) {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  const goToPrevious = useCallback(() => {
    setPageNumber((current) => Math.max(current - 1, 1));
  }, []);

  const goToNext = useCallback(() => {
    setPageNumber((current) => Math.min(current + 1, numPages || current));
  }, [numPages]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") return;

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        goToPrevious();
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") {
        event.preventDefault();
        goToNext();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToNext, goToPrevious]);

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
  }, [focusMode]);

  const controls = (
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

      <p className="font-mono text-[11px] text-muted">
        Arrow keys or space to navigate
      </p>
    </div>
  );

  const stage = (
    <div
      id="pdf-slide-shell"
      className={`slide-stage flex items-center justify-center overflow-hidden rounded-xl border border-border bg-surface p-2 sm:p-4 ${focusMode ? "slides-focus-pdf-stage" : "mb-4 min-h-[18rem]"}`}
    >
      {loadError ? (
        <div className="px-6 text-center">
          <p className="mb-3 text-sm text-muted">{loadError}</p>
          <a
            href={downloadUrl}
            download
            className="font-mono text-sm text-accent transition hover:text-foreground"
          >
            Download PDF instead
          </a>
        </div>
      ) : (
        <Document
          file={fileUrl}
          onLoadSuccess={({ numPages: total }) => {
            setNumPages(total);
            setPageNumber(1);
            setLoadError(null);
          }}
          onLoadError={(error) => {
            console.error("PDF slide viewer failed to load:", error);
            setLoadError("Could not load this PDF in the browser.");
          }}
          loading={
            <div className="flex h-64 items-center justify-center font-mono text-sm text-muted">
              Loading slides…
            </div>
          }
        >
          {numPages > 0 ? (
            <Page
              pageNumber={pageNumber}
              width={
                containerWidth
                  ? Math.min(containerWidth - 32, focusMode ? 1280 : 960)
                  : undefined
              }
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
              loading={
                <div className="flex h-64 items-center justify-center font-mono text-sm text-muted">
                  Rendering slide…
                </div>
              }
            />
          ) : null}
        </Document>
      )}
    </div>
  );

  return (
    <SlidesFocusFrame
      active={focusMode}
      title={title}
      downloadUrl={downloadUrl}
      onExit={onExitFocus ?? (() => undefined)}
      footer={controls}
    >
      {stage}
    </SlidesFocusFrame>
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
