import Link from "next/link";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import { expertise, projects, resume } from "@/lib/data";
import { getPublishedReports } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProjects = projects.filter((p) => p.featured);
  const recentPosts = (await getPublishedReports()).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
          <p className="mb-4 font-mono text-sm text-emerald-600 dark:text-emerald-400">
            Systems Engineer · Distributed Systems · Agentic AI
          </p>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-50">
            Building scalable systems and agentic software
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            I design highly scalable applications, develop agentic microservices,
            and work on distributed systems — across both computation and
            storage. This is where I share projects, live demos, and daily
            technical writing.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500"
            >
              View Projects & Demos
            </Link>
            <Link
              href="/posts"
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              Read Technical Posts
            </Link>
            <Link
              href="/resume"
              className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
            >
              Resume
            </Link>
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
            Focus Areas
          </h2>
          <p className="mb-10 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            What I work on
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((area) => (
              <div
                key={area.title}
                className="rounded-xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <span className="mb-3 block font-mono text-lg text-emerald-600 dark:text-emerald-400">
                  {area.icon}
                </span>
                <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
                Open Source & Demos
              </h2>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Projects with source & live demos
              </p>
            </div>
            <Link
              href="/projects"
              className="hidden font-mono text-sm text-emerald-600 transition hover:text-emerald-500 sm:block dark:text-emerald-400"
            >
              View all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <Link
            href="/projects"
            className="mt-6 block font-mono text-sm text-emerald-600 transition hover:text-emerald-500 sm:hidden dark:text-emerald-400"
          >
            View all projects →
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
                Technical Writing
              </h2>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Recent posts
              </p>
            </div>
            <Link
              href="/posts"
              className="hidden font-mono text-sm text-emerald-600 transition hover:text-emerald-500 sm:block dark:text-emerald-400"
            >
              All posts →
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">
              Posts will appear here once you publish technical reports in{" "}
              <Link href="/admin" className="text-emerald-600 underline">
                Payload admin
              </Link>
              .
            </p>
          )}
          <Link
            href="/posts"
            className="mt-6 block font-mono text-sm text-emerald-600 transition hover:text-emerald-500 sm:hidden dark:text-emerald-400"
          >
            All posts →
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Connect
            </h2>
            <p className="mb-6 max-w-lg text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Interested in distributed systems, agentic architecture, or
              collaborating on a project? Reach out or explore my work on
              GitHub.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={resume.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-zinc-900 px-5 py-2.5 font-mono text-sm text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                GitHub
              </a>
              <a
                href={resume.links.email}
                className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
