"use client";

import { useEffect, type ReactNode } from "react";

type SlidesFocusFrameProps = {
  active: boolean;
  title: string;
  downloadUrl: string;
  downloadFilename?: string;
  onExit: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export default function SlidesFocusFrame({
  active,
  title,
  downloadUrl,
  downloadFilename,
  onExit,
  children,
  footer,
}: SlidesFocusFrameProps) {
  useEffect(() => {
    if (!active) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onExit();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active, onExit]);

  if (!active) {
    return (
      <div className="slides-focus-inline flex flex-col">
        {children}
        {footer}
      </div>
    );
  }

  return (
    <div
      className="slides-focus-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} presentation`}
    >
      <div className="slides-focus-toolbar">
        <div className="min-w-0">
          <p className="slides-focus-kicker">Presentation mode</p>
          <p className="slides-focus-title truncate">{title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="slides-focus-action"
          >
            Download
          </a>
          <button type="button" onClick={onExit} className="slides-focus-exit">
            Exit focus
          </button>
        </div>
      </div>

      <div className="slides-focus-body">
        <div className="slides-focus-stage">{children}</div>
        {footer ? <div className="slides-focus-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
