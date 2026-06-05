import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects · Moe Bayat",
  description:
    "Open source projects with GitHub source code and live demos — distributed systems, agentic applications, and scalable infrastructure.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="section-label mb-3">Work</p>
        <h1 className="mb-3 text-3xl font-bold text-foreground">Projects</h1>
        <p className="max-w-2xl text-muted">
          A map of my work — each project links to its GitHub repository, with
          live demos where available. Focused on scalable systems, agentic
          software, and distributed infrastructure.
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
