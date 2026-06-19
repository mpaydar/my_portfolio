"use client";

import { useState, type ReactNode } from "react";
import type { PostPresentation } from "@/lib/posts";
import PresentationViewer from "@/components/PresentationViewer";

type ViewMode = "article" | "slides";

type PostViewSwitcherProps = {
  presentation: PostPresentation | null;
  presentationProxyUrl: string;
  title: string;
  article: ReactNode;
  hasArticle: boolean;
};

export default function PostViewSwitcher({
  presentation,
  presentationProxyUrl,
  title,
  article,
  hasArticle,
}: PostViewSwitcherProps) {
  const [view, setView] = useState<ViewMode>(hasArticle ? "article" : "slides");

  if (!presentation) {
    return <>{article}</>;
  }

  const showSlides = view === "slides";
  const slidesLabel =
    presentation.kind === "pdf" ? "Slides" : "PowerPoint";

  return (
    <div className="post-view-switcher">
      <div className="mb-8 flex justify-center">
        <div className="view-toggle-shell">
          <p className="view-toggle-label">View as</p>
          <div
            className="view-toggle"
            role="tablist"
            aria-label="Reading mode"
          >
          <button
            type="button"
            role="tab"
            aria-selected={!showSlides}
            onClick={() => setView("article")}
            className={`view-toggle-btn ${!showSlides ? "is-active" : ""}`}
            disabled={!hasArticle}
          >
            <ArticleIcon />
            Article
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={showSlides}
            onClick={() => setView("slides")}
            className={`view-toggle-btn ${showSlides ? "is-active" : ""}`}
          >
            <SlidesIcon />
            {slidesLabel}
          </button>
          <span
            className="view-toggle-indicator"
            data-active={showSlides ? "slides" : "article"}
            aria-hidden
          />
          </div>
        </div>
      </div>

      <div
        className={`view-panel ${showSlides ? "is-slides" : "is-article"}`}
        role="tabpanel"
      >
        {showSlides ? (
          <PresentationViewer
            presentation={presentation}
            presentationProxyUrl={presentationProxyUrl}
            title={title}
          />
        ) : hasArticle ? (
          article
        ) : (
          <p className="article-prose text-muted">
            No article body yet. Switch to {slidesLabel.toLowerCase()} to view
            the deck.
          </p>
        )}
      </div>
    </div>
  );
}

function ArticleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M4 12h10M4 18h14" />
    </svg>
  );
}

function SlidesIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="11" rx="2" />
      <path d="M7 20h10M12 16v4" />
    </svg>
  );
}
