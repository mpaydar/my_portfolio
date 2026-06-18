import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RecruiterConnect from "@/components/RecruiterConnect";
import JsonLd from "@/components/JsonLd";
import SocialIcons from "@/components/SocialIcons";
import { resume } from "@/lib/data";
import { buildPageMetadata, buildPersonJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Resume",
  description:
    "DevOps and platform engineer specializing in agentic AI systems, serverless machine learning, scalable infrastructure, and distributed systems.",
  path: "/resume",
  keywords: [
    "resume",
    "DevOps engineer",
    "platform engineer",
    "agentic AI",
    "serverless machine learning",
    "distributed systems",
    "Mohammad Bayat",
  ],
});

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <JsonLd data={buildPersonJsonLd()} />
      <Link
        href="/"
        className="mb-8 inline-block font-mono text-sm text-accent transition hover:text-foreground"
      >
        ← articles
      </Link>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div className="min-w-0">
      <header className="mb-12 border-b border-border pb-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-10">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div
              aria-hidden
              className="absolute -inset-2 rounded-full bg-gradient-to-br from-accent/25 via-accent/10 to-transparent blur-xl"
            />
            <div className="relative rounded-full bg-gradient-to-br from-accent/40 to-accent-dim/20 p-[3px] shadow-[0_0_32px_var(--glow)]">
              <div className="relative size-28 overflow-hidden rounded-full bg-surface sm:size-32">
                <Image
                  src="/images/headshot.png"
                  alt={`${resume.name} — ${resume.title}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 112px, 128px"
                  className="object-cover object-[center_15%]"
                />
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="section-label mb-3">Resume</p>
            <h1 className="mb-1 text-3xl font-bold text-foreground">
              {resume.name}
            </h1>
            <p className="mb-4 font-mono text-sm text-accent">{resume.title}</p>
            <p className="mb-6 text-lg leading-relaxed text-muted">
              {resume.summary}
            </p>
            <div className="mb-6 flex flex-wrap justify-center gap-x-4 gap-y-2 font-mono text-sm text-muted sm:justify-start">
              <a
                href={resume.links.email}
                className="transition hover:text-accent"
              >
                {resume.links.email.replace("mailto:", "")}
              </a>
              <span>{resume.phone}</span>
              <span>{resume.location}</span>
            </div>
            <SocialIcons className="justify-center sm:justify-start" />
          </div>
        </div>
      </header>

      <div className="mb-10 lg:hidden">
        <RecruiterConnect compact />
      </div>

      <section className="mb-12">
        <h2 className="section-label mb-6">Experience</h2>
        <div className="space-y-8">
          {resume.experience.map((job) => (
            <div key={`${job.company}-${job.period}`} className="card rounded-xl p-6">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-foreground">{job.role}</h3>
                <span className="font-mono text-sm text-muted">{job.period}</span>
              </div>
              <p className="mb-3 text-sm text-accent">{job.company}</p>
              <ul className="space-y-2">
                {job.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="section-label mb-6">Technical Skills</h2>
        <div className="space-y-5">
          {resume.skills.map((group) => (
            <div key={group.category}>
              <h3 className="mb-2 text-sm font-semibold text-foreground">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="section-label mb-6">Technical Projects</h2>
        <div className="space-y-6">
          {resume.technicalProjects.map((project) => (
            <div key={project.title} className="card rounded-xl p-6">
              <h3 className="mb-3 font-semibold text-foreground">
                {project.title}
              </h3>
              <ul className="space-y-2">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-muted"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-label mb-6">Education</h2>
        <div className="space-y-4">
          {resume.education.map((edu) => (
            <div key={edu.school} className="card rounded-xl p-5">
              <h3 className="font-semibold text-foreground">{edu.degree}</h3>
              <p className="text-sm text-muted">{edu.school}</p>
            </div>
          ))}
        </div>
      </section>
        </div>

        <aside className="hidden lg:block lg:sticky lg:top-24">
          <RecruiterConnect />
        </aside>
      </div>
    </div>
  );
}
