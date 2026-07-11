"use client";

import { useEffect, useState } from "react";

type PostReactionProps = {
  id: number;
  slug: string;
  initialCount: number;
  size?: "sm" | "md";
};

function storageKey(slug: string) {
  return `post-reaction:${slug}`;
}

export default function PostReaction({
  id,
  slug,
  initialCount,
  size = "md",
}: PostReactionProps) {
  const [count, setCount] = useState(initialCount);
  const [reacted, setReacted] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setReacted(window.localStorage.getItem(storageKey(slug)) === "1");
  }, [slug]);

  async function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (reacted || pending) return;

    setPending(true);
    setReacted(true);
    setCount((prev) => prev + 1);
    window.localStorage.setItem(storageKey(slug), "1");

    try {
      const response = await fetch(`/api/technical-reports/${id}/react`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Reaction request failed");

      const data = (await response.json()) as { interestCount?: number };
      if (typeof data.interestCount === "number") {
        setCount(data.interestCount);
      }
    } catch {
      setReacted(false);
      setCount((prev) => Math.max(0, prev - 1));
      window.localStorage.removeItem(storageKey(slug));
    } finally {
      setPending(false);
    }
  }

  const isCompact = size === "sm";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={reacted || pending}
      aria-pressed={reacted}
      title={
        reacted
          ? "Thanks — you've flagged this as worth more coverage"
          : "One click — tells us to write more like this"
      }
      className={`relative z-[2] inline-flex shrink-0 items-center gap-1.5 rounded-full border font-mono transition ${
        isCompact ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm"
      } ${
        reacted
          ? "border-accent/40 bg-accent/10 text-accent"
          : "cursor-pointer border-border bg-surface-hover text-muted hover:border-accent hover:text-accent"
      } ${pending ? "opacity-70" : ""}`}
    >
      <span aria-hidden>{reacted ? "✓" : "🔥"}</span>
      <span>{reacted ? "Want more like this" : "Want more like this?"}</span>
      <span
        className={`rounded-full px-1.5 ${
          reacted ? "bg-accent/20" : "bg-border/60"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
