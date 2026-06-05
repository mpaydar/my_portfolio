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
      <header className="mb-12 border-b border-zinc-200 pb-10 dark:border-zinc-800">
        <h1 className="mb-1 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {resume.name}
        </h1>
        <p className="mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
          {resume.title}
        </p>
        <p className="mb-6 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
          {resume.summary}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-sm text-zinc-600 dark:text-zinc-400">
          <a
            href={resume.links.email}
            className="transition hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {resume.links.email.replace("mailto:", "")}
          </a>
          <span>{resume.phone}</span>
          <span>{resume.location}</span>
          <a
            href={resume.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {resume.links.github.replace("https://", "")}
          </a>
          <a
            href={resume.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            {resume.links.linkedin.replace("https://", "")}
          </a>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Experience
        </h2>
        <div className="space-y-8">
          {resume.experience.map((job) => (
            <div key={`${job.company}-${job.period}`}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {job.role}
                </h3>
                <span className="font-mono text-sm text-zinc-500">
                  {job.period}
                </span>
              </div>
              <p className="mb-3 text-sm text-emerald-700 dark:text-emerald-400">
                {job.company}
              </p>
              <ul className="space-y-2">
                {job.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Technical Skills
        </h2>
        <div className="space-y-5">
          {resume.skills.map((group) => (
            <div key={group.category}>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-zinc-200 px-3 py-1 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
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
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Technical Projects
        </h2>
        <div className="space-y-6">
          {resume.technicalProjects.map((project) => (
            <div key={project.title}>
              <h3 className="mb-3 font-semibold text-zinc-900 dark:text-zinc-100">
                {project.title}
              </h3>
              <ul className="space-y-2">
                {project.highlights.map((item) => (
                  <li
                    key={item}
                    className="flex gap-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">
          Education
        </h2>
        <div className="space-y-4">
          {resume.education.map((edu) => (
            <div key={edu.school}>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                {edu.degree}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {edu.school}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
