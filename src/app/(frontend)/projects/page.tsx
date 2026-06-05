import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects · Mohammad Bayat",
  description:
    "Open source projects with GitHub source code and live demos — distributed systems, agentic applications, and scalable infrastructure.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="mb-3 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Projects
        </h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          A map of my work — each project links directly to its GitHub
          repository, with live demos where available. Focused on scalable
          systems, agentic software, and distributed infrastructure.
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
