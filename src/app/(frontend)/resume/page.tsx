import type { Metadata } from "next";
import { resume } from "@/lib/data";

export const metadata: Metadata = {
  title: "Resume · Moe Bayat",
  description:
    "DevOps & Platform Engineer specializing in agentic AI systems, scalable infrastructure, and distributed systems.",
};

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="mb-12 border-b border-border pb-10">
        <p className="section-label mb-3">Resume</p>
        <h1 className="mb-1 text-3xl font-bold text-foreground">
          {resume.name}
        </h1>
        <p className="mb-4 font-mono text-sm text-accent">{resume.title}</p>
        <p className="mb-6 text-lg leading-relaxed text-muted">
          {resume.summary}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-muted">
          <a href={resume.links.email} className="transition hover:text-accent">
            {resume.links.email.replace("mailto:", "")}
          </a>
          <span>{resume.phone}</span>
          <span>{resume.location}</span>
          <a
            href={resume.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-accent"
          >
            {resume.links.github.replace("https://", "")}
          </a>
          <a
            href={resume.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-accent"
          >
            {resume.links.linkedin.replace("https://", "")}
          </a>
        </div>
      </header>

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
  );
}
