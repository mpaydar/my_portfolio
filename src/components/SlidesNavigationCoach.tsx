"use client";

import { useEffect } from "react";

type SlidesNavigationCoachProps = {
  onDismiss: () => void;
};

export default function SlidesNavigationCoach({
  onDismiss,
}: SlidesNavigationCoachProps) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 6000);

    function dismissOnKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") return;
      onDismiss();
    }

    window.addEventListener("keydown", dismissOnKeyDown);
    window.addEventListener("pointerdown", onDismiss);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", dismissOnKeyDown);
      window.removeEventListener("pointerdown", onDismiss);
    };
  }, [onDismiss]);

  return (
    <div
      className="slides-coach"
      role="presentation"
      onClick={(event) => {
        event.stopPropagation();
        onDismiss();
      }}
    >
      <div
        className="slides-coach-card"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="slides-coach-title">Navigate slides</p>

        <div className="slides-coach-demo" aria-hidden>
          <div className="slides-coach-side slides-coach-side--prev">
            <span className="slides-coach-arrow slides-coach-arrow--left">
              <ChevronLeftIcon />
            </span>
            <span className="slides-coach-key">←</span>
            <span className="slides-coach-label">Previous</span>
          </div>

          <div className="slides-coach-slide-preview" />

          <div className="slides-coach-side slides-coach-side--next">
            <span className="slides-coach-arrow slides-coach-arrow--right">
              <ChevronRightIcon />
            </span>
            <span className="slides-coach-key">→</span>
            <span className="slides-coach-label">Next</span>
          </div>
        </div>

        <p className="slides-coach-hint">
          Use <kbd>←</kbd> <kbd>→</kbd> arrow keys or <kbd>Space</kbd> to move
          between slides
        </p>
        <p className="slides-coach-exit-hint">
          Press <kbd>Esc</kbd> or tap <strong>Exit presentation</strong> below
          to leave focus mode
        </p>

        <button type="button" className="slides-coach-dismiss" onClick={onDismiss}>
          Got it
        </button>
      </div>
    </div>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}
