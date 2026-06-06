"use client";

import { useMemo, useState } from "react";
import { recruiter, resume } from "@/lib/data";

type Slot = {
  id: string;
  label: string;
  iso: string;
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getNextSlots(count: number): Slot[] {
  const slots: Slot[] = [];
  const cursor = new Date();
  cursor.setMinutes(0, 0, 0);
  cursor.setHours(cursor.getHours() + 1);

  let safety = 0;

  while (slots.length < count && safety < 120) {
    safety += 1;
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(recruiter.slotHours[0], 0, 0, 0);

    if (!recruiter.availableDays.includes(cursor.getDay())) continue;

    for (const hour of recruiter.slotHours) {
      const candidate = new Date(cursor);
      candidate.setHours(hour, 0, 0, 0);

      if (candidate <= new Date()) continue;

      const label = candidate.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: recruiter.timezone,
        timeZoneName: "short",
      });

      slots.push({
        id: candidate.toISOString(),
        label,
        iso: candidate.toISOString(),
      });

      if (slots.length >= count) break;
    }
  }

  return slots;
}

function buildScheduleHref(slot?: Slot) {
  if (resume.links.schedule) {
    return resume.links.schedule;
  }

  const subject = encodeURIComponent("Intro call — Moe Bayat");
  const body = slot
    ? encodeURIComponent(
        `Hi Moe,\n\nI'd like to schedule a ${recruiter.slotMinutes}-minute intro call.\n\nPreferred time: ${slot.label}\n\nThanks,`,
      )
    : encodeURIComponent(
        `Hi Moe,\n\nI'd like to schedule a ${recruiter.slotMinutes}-minute intro call.\n\nThanks,`,
      );

  return `${resume.links.email}?subject=${subject}&body=${body}`;
}

export default function RecruiterConnect({ compact = false }: { compact?: boolean }) {
  const slots = useMemo(() => getNextSlots(3), []);
  const [selectedId, setSelectedId] = useState(slots[0]?.id ?? "");
  const selected = slots.find((slot) => slot.id === selectedId);

  const today = new Date().getDay();

  return (
    <aside
      className={`card group relative overflow-hidden rounded-xl border border-border/80 bg-surface transition hover:border-accent/40 hover:shadow-[0_0_28px_var(--glow)] ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition group-hover:opacity-100"
      />

      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="section-label mb-1">Recruiters</p>
          <h3 className="text-sm font-semibold text-foreground">
            Book an intro call
          </h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          Open
        </span>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-muted">
        {recruiter.slotMinutes}-minute intro slots for hiring conversations.
        Pick a time below or open the scheduler.
      </p>

      <div className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          Weekly availability
        </p>
        <div className="flex justify-between gap-1">
          {DAY_LABELS.map((label, index) => {
            const available = recruiter.availableDays.includes(index);
            const isToday = today === index;

            return (
              <div
                key={`${label}-${index}`}
                className={`flex flex-1 flex-col items-center gap-1 rounded-md px-1 py-2 transition ${
                  available
                    ? "bg-accent/10 text-accent"
                    : "bg-surface-hover/50 text-muted/40"
                } ${isToday && available ? "ring-1 ring-accent/40" : ""}`}
              >
                <span className="font-mono text-[11px] font-medium">{label}</span>
                <span
                  className={`h-1 w-1 rounded-full ${
                    available ? "bg-accent" : "bg-border"
                  }`}
                />
              </div>
            );
          })}
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted">
          {recruiter.hoursLabel} · {recruiter.timezoneLabel}
        </p>
      </div>

      <div className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          Next open slots
        </p>
        <div className="flex flex-col gap-2">
          {slots.map((slot) => {
            const active = slot.id === selectedId;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedId(slot.id)}
                className={`rounded-lg border px-3 py-2 text-left font-mono text-[11px] transition ${
                  active
                    ? "border-accent bg-accent/10 text-accent shadow-[0_0_12px_var(--glow)]"
                    : "border-border bg-background text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {slot.label}
              </button>
            );
          })}
        </div>
      </div>

      <a
        href={buildScheduleHref(selected)}
        target={resume.links.schedule ? "_blank" : undefined}
        rel={resume.links.schedule ? "noopener noreferrer" : undefined}
        className="btn-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
      >
        {resume.links.schedule ? "Open scheduler" : "Request this time"}
        <ArrowIcon />
      </a>
    </aside>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
