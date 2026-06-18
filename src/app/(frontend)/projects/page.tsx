import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Projects",
  description:
    "Open source projects with GitHub source code and live demos — background work referenced from the technical blog.",
  path: "/projects",
  keywords: [
    "open source projects",
    "distributed systems",
    "agentic applications",
    "serverless ML",
  ],
});

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <Link
        href="/"
        className="mb-8 inline-block font-mono text-sm text-accent transition hover:text-foreground"
      >
        ← articles
      </Link>
      <header className="mb-12">
        <p className="section-label mb-3">Background</p>
        <h1 className="mb-3 text-3xl font-bold text-foreground">Projects</h1>
        <p className="max-w-2xl text-muted">
          Open source work and live demos — kept here for reference, separate
          from the technical writing on the main site.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
