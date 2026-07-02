"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { PostPresentation, PostSourceDocument } from "@/lib/posts";
import PresentationViewer from "@/components/PresentationViewer";
import DocumentViewer from "@/components/DocumentViewer";

type ViewMode = "article" | "slides" | "document";

type PostViewContextValue = {
  presentation: PostPresentation | null;
  sourceDocument: PostSourceDocument | null;
  presentationProxyUrl: string;
  documentProxyUrl: string;
  title: string;
  hasArticle: boolean;
  view: ViewMode;
  setView: (view: ViewMode) => void;
  enterSlidesMode: () => void;
  enterDocumentMode: () => void;
  slidesFocus: boolean;
  exitSlidesFocus: () => void;
  slidesLabel: string;
  documentLabel: string;
  availableViews: ViewMode[];
};

const PostViewContext = createContext<PostViewContextValue | null>(null);

function getDefaultView(
  hasArticle: boolean,
  hasPresentation: boolean,
  hasSourceDocument: boolean,
  sourceDocumentKind: PostSourceDocument["kind"] | null,
): ViewMode {
  if (hasArticle) return "article";
  if (hasSourceDocument && sourceDocumentKind === "pdf") return "document";
  if (hasPresentation) return "slides";
  if (hasSourceDocument) return "document";
  return "article";
}

type PostViewProviderProps = {
  presentation: PostPresentation | null;
  sourceDocument: PostSourceDocument | null;
  presentationProxyUrl: string;
  documentProxyUrl: string;
  title: string;
  hasArticle: boolean;
  children: ReactNode;
};

export function PostViewProvider({
  presentation,
  sourceDocument,
  presentationProxyUrl,
  documentProxyUrl,
  title,
  hasArticle,
  children,
}: PostViewProviderProps) {
  const availableViews = useMemo(() => {
    const views: ViewMode[] = [];
    if (hasArticle) views.push("article");
    if (sourceDocument) views.push("document");
    if (presentation) views.push("slides");
    return views;
  }, [hasArticle, presentation, sourceDocument]);

  const [view, setView] = useState<ViewMode>(() =>
    getDefaultView(
      hasArticle,
      Boolean(presentation),
      Boolean(sourceDocument),
      sourceDocument?.kind ?? null,
    ),
  );
  const [slidesFocus, setSlidesFocus] = useState(false);
  const [slidesFocusRequest, setSlidesFocusRequest] = useState(0);

  useEffect(() => {
    if (!availableViews.includes(view)) {
      setView(
        getDefaultView(
          hasArticle,
          Boolean(presentation),
          Boolean(sourceDocument),
          sourceDocument?.kind ?? null,
        ),
      );
    }
  }, [availableViews, hasArticle, presentation, sourceDocument, view]);

  const enterSlidesMode = useCallback(() => {
    setView("slides");
    setSlidesFocusRequest((count) => count + 1);
  }, []);

  const enterDocumentMode = useCallback(() => {
    setView("document");
    setSlidesFocus(false);
  }, []);

  const activateSlidesFocus = useCallback(() => {
    setSlidesFocus(true);
  }, []);

  const exitSlidesFocus = useCallback(() => {
    setSlidesFocus(false);
    if (hasArticle) {
      setView("article");
    }
  }, [hasArticle]);

  if (!presentation && !sourceDocument) {
    return <>{children}</>;
  }

  const slidesLabel = presentation?.kind === "pdf" ? "Slides" : "PowerPoint";
  const documentLabel =
    sourceDocument?.kind === "pdf" ? "Document" : "Original";

  return (
    <PostViewContext.Provider
      value={{
        presentation,
        sourceDocument,
        presentationProxyUrl,
        documentProxyUrl,
        title,
        hasArticle,
        view,
        setView: (nextView) => {
          setView(nextView);
          if (nextView !== "slides") {
            setSlidesFocus(false);
          }
        },
        enterSlidesMode,
        enterDocumentMode,
        slidesFocus,
        exitSlidesFocus,
        slidesLabel,
        documentLabel,
        availableViews,
      }}
    >
      <SlidesFocusRequestHandler
        requestId={slidesFocusRequest}
        view={view}
        onActivateFocus={activateSlidesFocus}
      />
      {children}
    </PostViewContext.Provider>
  );
}

function SlidesFocusRequestHandler({
  requestId,
  view,
  onActivateFocus,
}: {
  requestId: number;
  view: ViewMode;
  onActivateFocus: () => void;
}) {
  useEffect(() => {
    if (view !== "slides" || requestId === 0) return;

    const panel = document.getElementById("post-content-panel");
    panel?.scrollIntoView({ behavior: "smooth", block: "start" });

    const timer = window.setTimeout(() => {
      onActivateFocus();
    }, 320);

    return () => window.clearTimeout(timer);
  }, [requestId, view, onActivateFocus]);

  return null;
}

export function PostViewToggle() {
  const context = useContext(PostViewContext);
  if (!context || context.availableViews.length < 2) return null;

  const {
    hasArticle,
    view,
    setView,
    enterSlidesMode,
    enterDocumentMode,
    slidesLabel,
    documentLabel,
    availableViews,
    presentation,
    sourceDocument,
  } = context;

  return (
    <div className="view-toggle-shell view-toggle-shell--header">
      <p className="view-toggle-label">View as</p>
      <div
        className={`view-toggle ${availableViews.length === 3 ? "view-toggle--triple" : ""}`}
        role="tablist"
        aria-label="Reading mode"
      >
        {availableViews.includes("article") ? (
          <button
            type="button"
            role="tab"
            aria-selected={view === "article"}
            onClick={() => setView("article")}
            className={`view-toggle-btn ${view === "article" ? "is-active" : ""}`}
            disabled={!hasArticle}
          >
            <ArticleIcon />
            Article
          </button>
        ) : null}
        {availableViews.includes("document") && sourceDocument ? (
          <button
            type="button"
            role="tab"
            aria-selected={view === "document"}
            onClick={() => enterDocumentMode()}
            className={`view-toggle-btn ${view === "document" ? "is-active" : ""}`}
          >
            <DocumentIcon />
            {documentLabel}
          </button>
        ) : null}
        {availableViews.includes("slides") && presentation ? (
          <button
            type="button"
            role="tab"
            aria-selected={view === "slides"}
            onClick={() => enterSlidesMode()}
            className={`view-toggle-btn ${view === "slides" ? "is-active" : ""}`}
          >
            <SlidesIcon />
            {slidesLabel}
          </button>
        ) : null}
        <span
          className="view-toggle-indicator"
          data-active={view}
          data-count={availableViews.length}
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
    sourceDocument,
    presentationProxyUrl,
    documentProxyUrl,
    title,
    hasArticle,
    view,
    slidesFocus,
    exitSlidesFocus,
    slidesLabel,
    documentLabel,
  } = context;

  return (
    <div
      id="post-content-panel"
      className={`view-panel scroll-mt-24 ${view !== "article" ? `is-${view}` : "is-article"}`}
      role="tabpanel"
    >
      {view === "slides" && presentation ? (
        <PresentationViewer
          presentation={presentation}
          presentationProxyUrl={presentationProxyUrl}
          title={title}
          focusMode={slidesFocus}
          onExitFocus={exitSlidesFocus}
        />
      ) : view === "document" && sourceDocument ? (
        <DocumentViewer
          document={sourceDocument}
          documentProxyUrl={documentProxyUrl}
          title={title}
        />
      ) : hasArticle ? (
        article
      ) : (
        <p className="article-prose text-muted">
          No article body yet. Switch to {documentLabel.toLowerCase()} or{" "}
          {slidesLabel.toLowerCase()} to view the report.
        </p>
      )}
    </div>
  );
}

/** @deprecated Use PostViewProvider, PostViewToggle, and PostViewPanel instead. */
export default function PostViewSwitcher({
  presentation,
  sourceDocument,
  presentationProxyUrl,
  documentProxyUrl,
  title,
  article,
  hasArticle,
}: {
  presentation: PostPresentation | null;
  sourceDocument: PostSourceDocument | null;
  presentationProxyUrl: string;
  documentProxyUrl: string;
  title: string;
  article: ReactNode;
  hasArticle: boolean;
}) {
  return (
    <PostViewProvider
      presentation={presentation}
      sourceDocument={sourceDocument}
      presentationProxyUrl={presentationProxyUrl}
      documentProxyUrl={documentProxyUrl}
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

function DocumentIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
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
