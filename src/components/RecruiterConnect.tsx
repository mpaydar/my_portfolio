"use client";

import { useMemo, useState } from "react";
import { recruiter, resume } from "@/lib/data";

type Slot = {
  id: string;
  label: string;
  timeLabel: string;
  iso: string;
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function getNowInTimezone() {
  return new Date(
    new Date().toLocaleString("en-US", { timeZone: recruiter.timezone }),
  );
}

function getTodayInTimezone() {
  return getNowInTimezone().getDay();
}

function getNextDateForDay(dayIndex: number, from: Date): Date {
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);

  let delta = dayIndex - date.getDay();
  if (delta < 0) delta += 7;

  if (delta === 0) {
    const hasUpcomingSlot = recruiter.slotTimes.some(({ hour, minute }) => {
      const slot = new Date(date);
      slot.setHours(hour, minute, 0, 0);
      return slot > from;
    });
    if (!hasUpcomingSlot) delta = 7;
  }

  date.setDate(date.getDate() + delta);
  return date;
}

function getDefaultDay(now: Date) {
  const today = now.getDay();

  if (recruiter.availableDays.includes(today)) {
    const hasUpcomingSlot = recruiter.slotTimes.some(({ hour, minute }) => {
      const slot = new Date(now);
      slot.setHours(hour, minute, 0, 0);
      return slot > now;
    });
    if (hasUpcomingSlot) return today;
  }

  for (let offset = 1; offset <= 7; offset += 1) {
    const day = (today + offset) % 7;
    if (recruiter.availableDays.includes(day)) return day;
  }

  return recruiter.availableDays[0];
}

function getSlotsForDay(dayIndex: number, now = getNowInTimezone()): Slot[] {
  const date = getNextDateForDay(dayIndex, now);

  return recruiter.slotTimes
    .map(({ hour, minute }) => {
      const candidate = new Date(date);
      candidate.setHours(hour, minute, 0, 0);

      if (candidate <= now) return null;

      return {
        id: candidate.toISOString(),
        label: candidate.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: recruiter.timezone,
        }),
        timeLabel: candidate.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: recruiter.timezone,
          timeZoneName: "short",
        }),
        iso: candidate.toISOString(),
      };
    })
    .filter((slot): slot is Slot => slot !== null);
}

function buildScheduleHref(slot?: Slot) {
  if (resume.links.schedule) {
    return resume.links.schedule;
  }

  const slotText = slot ? `${slot.label} · ${slot.timeLabel}` : undefined;
  const subject = encodeURIComponent("Intro call — Moe Bayat");
  const body = slotText
    ? encodeURIComponent(
        `Hi Moe,\n\nI'd like to schedule a ${recruiter.slotMinutes}-minute intro call.\n\nPreferred time: ${slotText}\n\nThanks,`,
      )
    : encodeURIComponent(
        `Hi Moe,\n\nI'd like to schedule a ${recruiter.slotMinutes}-minute intro call.\n\nThanks,`,
      );

  return `${resume.links.email}?subject=${subject}&body=${body}`;
}

export default function RecruiterConnect({ compact = false }: { compact?: boolean }) {
  const now = useMemo(() => getNowInTimezone(), []);
  const defaultDay = useMemo(() => getDefaultDay(now), [now]);
  const [selectedDay, setSelectedDay] = useState(defaultDay);

  const slots = useMemo(
    () => getSlotsForDay(selectedDay, now),
    [selectedDay, now],
  );

  const [selectedId, setSelectedId] = useState(() => slots[0]?.id ?? "");

  const selected =
    slots.find((slot) => slot.id === selectedId) ?? slots[0] ?? undefined;

  const today = getTodayInTimezone();

  function handleDaySelect(dayIndex: number) {
    if (!recruiter.availableDays.includes(dayIndex)) return;

    setSelectedDay(dayIndex);
    const daySlots = getSlotsForDay(dayIndex, getNowInTimezone());
    setSelectedId(daySlots[0]?.id ?? "");
  }

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
        {recruiter.slotMinutes}-minute intro calls on weekdays between 4:00 and
        5:00 PM ET. Select a day, then pick a time.
      </p>

      <div className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          Select a day
        </p>
        <div className="flex justify-between gap-1" role="group" aria-label="Available weekdays">
          {DAY_LABELS.map((label, index) => {
            const available = recruiter.availableDays.includes(index);
            const isToday = today === index;
            const isSelected = selectedDay === index;

            return (
              <button
                key={`${label}-${index}`}
                type="button"
                disabled={!available}
                onClick={() => handleDaySelect(index)}
                aria-pressed={isSelected}
                aria-label={
                  available
                    ? `${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}${isToday ? ", today" : ""}`
                    : `${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}, unavailable`
                }
                className={`flex flex-1 flex-col items-center gap-1 rounded-md px-1 py-2 transition ${
                  available
                    ? isSelected
                      ? "bg-accent text-background shadow-[0_0_12px_var(--glow)] ring-1 ring-accent"
                      : "cursor-pointer bg-accent/10 text-accent hover:bg-accent/20 hover:ring-1 hover:ring-accent/40"
                    : "cursor-not-allowed bg-surface-hover/50 text-muted/40"
                } ${isToday && available && !isSelected ? "ring-1 ring-accent/40" : ""}`}
              >
                <span className="font-mono text-[11px] font-medium">{label}</span>
                <span
                  className={`h-1 w-1 rounded-full ${
                    available
                      ? isSelected
                        ? "bg-background"
                        : "bg-accent"
                      : "bg-border"
                  }`}
                />
              </button>
            );
          })}
        </div>
        <p className="mt-2 font-mono text-[11px] text-muted">
          {recruiter.hoursLabel} · {recruiter.timezoneLabel}
        </p>
      </div>

      <div className="mb-4">
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          {slots.length > 0
            ? `Pick a time · ${slots[0]?.label}`
            : "No open slots for this day"}
        </p>
        {slots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {slots.map((slot) => {
              const active = slot.id === (selected?.id ?? selectedId);
              return (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setSelectedId(slot.id)}
                  aria-pressed={active}
                  className={`rounded-lg border px-2 py-2 text-center font-mono text-[10px] leading-tight transition ${
                    active
                      ? "border-accent bg-accent/10 text-accent shadow-[0_0_12px_var(--glow)]"
                      : "cursor-pointer border-border bg-background text-muted hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  {slot.timeLabel.replace(/ ET| EDT| EST/, "")}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-border px-3 py-2 text-center font-mono text-[11px] text-muted">
            Try another weekday
          </p>
        )}
      </div>

      <a
        href={buildScheduleHref(selected)}
        target={resume.links.schedule ? "_blank" : undefined}
        rel={resume.links.schedule ? "noopener noreferrer" : undefined}
        aria-disabled={!selected}
        className={`btn-primary flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium ${
          !selected ? "pointer-events-none opacity-50" : ""
        }`}
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
