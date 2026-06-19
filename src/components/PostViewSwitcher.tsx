"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { PostPresentation } from "@/lib/posts";
import PresentationViewer from "@/components/PresentationViewer";

type ViewMode = "article" | "slides";

type PostViewContextValue = {
  presentation: PostPresentation;
  presentationProxyUrl: string;
  title: string;
  hasArticle: boolean;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  enterSlidesMode: () => void;
  slidesFocus: boolean;
  exitSlidesFocus: () => void;
  slidesLabel: string;
};

const PostViewContext = createContext<PostViewContextValue | null>(null);

type PostViewProviderProps = {
  presentation: PostPresentation | null;
  presentationProxyUrl: string;
  title: string;
  hasArticle: boolean;
  children: ReactNode;
};

export function PostViewProvider({
  presentation,
  presentationProxyUrl,
  title,
  hasArticle,
  children,
}: PostViewProviderProps) {
  const [view, setView] = useState<ViewMode>(hasArticle ? "article" : "slides");
  const [slidesFocus, setSlidesFocus] = useState(false);
  const [slidesFocusRequest, setSlidesFocusRequest] = useState(0);

  const enterSlidesMode = useCallback(() => {
    setView("slides");
    setSlidesFocusRequest((count) => count + 1);
  }, []);

  const exitSlidesFocus = useCallback(() => {
    setSlidesFocus(false);
  }, []);

  if (!presentation) {
    return <>{children}</>;
  }

  const slidesLabel = presentation.kind === "pdf" ? "Slides" : "PowerPoint";

  return (
    <PostViewContext.Provider
      value={{
        presentation,
        presentationProxyUrl,
        title,
        hasArticle,
        view,
        setView: (nextView) => {
          setView(nextView);
          if (nextView === "article") {
            setSlidesFocus(false);
          }
        },
        enterSlidesMode,
        slidesFocus,
        exitSlidesFocus,
        slidesLabel,
      }}
    >
      <SlidesFocusRequestHandler
        requestId={slidesFocusRequest}
        view={view}
        onFocus={() => setSlidesFocus(true)}
      />
      {children}
    </PostViewContext.Provider>
  );
}

function SlidesFocusRequestHandler({
  requestId,
  view,
  onFocus,
}: {
  requestId: number;
  view: ViewMode;
  onFocus: () => void;
}) {
  useEffect(() => {
    if (view !== "slides" || requestId === 0) return;

    const panel = document.getElementById("post-slides-panel");
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });

    const timer = window.setTimeout(() => {
      onFocus();
    }, 320);

    return () => window.clearTimeout(timer);
  }, [requestId, view, onFocus]);

  return null;
}

export function PostViewToggle() {
  const context = useContext(PostViewContext);
  if (!context) return null;

  const { hasArticle, view, setView, enterSlidesMode, slidesLabel } = context;
  const showSlides = view === "slides";

  return (
    <div className="view-toggle-shell view-toggle-shell--header">
      <p className="view-toggle-label">View as</p>
      <div className="view-toggle" role="tablist" aria-label="Reading mode">
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
          onClick={() => enterSlidesMode()}
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
  );
}

type PostViewPanelProps = {
  article: ReactNode;
};

export function PostViewPanel({ article }: PostViewPanelProps) {
  const context = useContext(PostViewContext);

  if (!context) {
    return <>{article}</>;
  }

  const {
    presentation,
    presentationProxyUrl,
    title,
    hasArticle,
    view,
    slidesFocus,
    exitSlidesFocus,
    slidesLabel,
  } = context;
  const showSlides = view === "slides";

  return (
    <div
      id="post-slides-panel"
      className={`view-panel scroll-mt-24 ${showSlides ? "is-slides" : "is-article"}`}
      role="tabpanel"
    >
      {showSlides ? (
        <PresentationViewer
          presentation={presentation}
          presentationProxyUrl={presentationProxyUrl}
          title={title}
          focusMode={slidesFocus}
          onExitFocus={exitSlidesFocus}
        />
      ) : hasArticle ? (
        article
      ) : (
        <p className="article-prose text-muted">
          No article body yet. Switch to {slidesLabel.toLowerCase()} to view the
          deck.
        </p>
      )}
    </div>
  );
}

/** @deprecated Use PostViewProvider, PostViewToggle, and PostViewPanel instead. */
export default function PostViewSwitcher({
  presentation,
  presentationProxyUrl,
  title,
  article,
  hasArticle,
}: {
  presentation: PostPresentation | null;
  presentationProxyUrl: string;
  title: string;
  article: ReactNode;
  hasArticle: boolean;
}) {
  return (
    <PostViewProvider
      presentation={presentation}
      presentationProxyUrl={presentationProxyUrl}
      title={title}
      hasArticle={hasArticle}
    >
      <div className="post-view-switcher mb-8 flex justify-center">
        <PostViewToggle />
      </div>
      <PostViewPanel article={article} />
    </PostViewProvider>
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
