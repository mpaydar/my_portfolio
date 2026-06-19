"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import SlidesNavigationCoach from "@/components/SlidesNavigationCoach";

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
  const [mounted, setMounted] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const showCoachRef = useRef(false);

  useEffect(() => {
    showCoachRef.current = showCoach;
  }, [showCoach]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active) {
      setShowCoach(false);
      return;
    }

    setShowCoach(true);

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (showCoachRef.current) {
          setShowCoach(false);
          return;
        }
        onExit();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown, true);
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

  if (!mounted) {
    return null;
  }

  return createPortal(
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
            Exit presentation
          </button>
        </div>
      </div>

      <div className="slides-focus-body">
        <div className="slides-focus-stage">
          {children}
          {showCoach ? (
            <SlidesNavigationCoach onDismiss={() => setShowCoach(false)} />
          ) : null}
        </div>

        <div className="slides-focus-footer">
          {footer}
          <div className="slides-focus-footer-actions">
            <p className="slides-focus-footer-hint">
              <kbd>←</kbd> <kbd>→</kbd> or <kbd>Space</kbd> · slide navigation
            </p>
            <button type="button" onClick={onExit} className="slides-focus-exit-prominent">
              <CloseIcon />
              Exit presentation
              <span className="slides-focus-exit-key">Esc</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function CloseIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
