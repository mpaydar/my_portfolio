import Link from "next/link";
import PostCard from "@/components/PostCard";
import ProjectCard from "@/components/ProjectCard";
import RecruiterConnect from "@/components/RecruiterConnect";
import SocialIcons from "@/components/SocialIcons";
import { expertise, projects, resume } from "@/lib/data";
import { getPublishedReports } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProjects = projects.filter((p) => p.featured);
  const recentPosts = (await getPublishedReports()).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <p className="section-label mb-6">
            DevOps · Distributed Systems · Agentic AI
          </p>
          <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Building systems that{" "}
            <span className="text-accent">scale</span> and agents that{" "}
            <span className="text-accent">reason</span>
          </h1>
          <p className="mb-10 max-w-2xl text-lg leading-relaxed text-muted">
            I design highly scalable applications, develop agentic microservices,
            and work on distributed systems — across both computation and
            storage. Projects, live demos, and daily technical writing live here.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary rounded-lg px-5 py-2.5 text-sm">
              Projects & Demos
            </Link>
            <Link href="/posts" className="btn-ghost rounded-lg px-5 py-2.5 text-sm">
              Technical Posts
            </Link>
            <Link href="/resume" className="btn-ghost rounded-lg px-5 py-2.5 text-sm">
              Resume
            </Link>
          </div>
          <div className="mt-8 flex items-center gap-4">
            <span className="font-mono text-xs text-muted">Find me</span>
            <SocialIcons />
          </div>
        </div>
      </section>

      {/* Expertise */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="section-label mb-2">Focus Areas</p>
          <h2 className="mb-10 text-2xl font-semibold text-foreground">
            What I work on
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {expertise.map((area) => (
              <div key={area.title} className="card rounded-xl p-5">
                <span className="mb-3 block font-mono text-lg text-accent">
                  {area.icon}
                </span>
                <h3 className="mb-2 font-semibold text-foreground">
                  {area.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {area.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="section-label mb-2">Open Source & Demos</p>
              <h2 className="text-2xl font-semibold text-foreground">
                Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="hidden font-mono text-sm text-accent transition hover:text-foreground sm:block"
            >
              view all →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="section-label mb-2">Technical Writing</p>
              <h2 className="text-2xl font-semibold text-foreground">
                Recent posts
              </h2>
            </div>
            <Link
              href="/posts"
              className="hidden font-mono text-sm text-accent transition hover:text-foreground sm:block"
            >
              all posts →
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted">
              Posts will appear here once you publish in{" "}
              <Link href="/admin" className="text-accent underline">
                Payload admin
              </Link>
              .
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="card rounded-xl p-8">
              <h2 className="mb-2 text-xl font-semibold text-foreground">
                Connect
              </h2>
              <p className="mb-6 max-w-lg text-sm leading-relaxed text-muted">
                Interested in distributed systems, agentic architecture, or
                collaborating on a project? Find me on GitHub, LinkedIn, or
                NotebookLM — or book a quick intro call.
              </p>
              <SocialIcons className="mb-6" />
              <div className="flex flex-wrap gap-3">
                <a
                  href={resume.links.email}
                  className="btn-ghost rounded-lg px-5 py-2.5 text-sm"
                >
                  Email
                </a>
                <Link
                  href="/resume"
                  className="btn-primary rounded-lg px-5 py-2.5 text-sm"
                >
                  View resume
                </Link>
              </div>
            </div>
            <RecruiterConnect compact />
          </div>
        </div>
      </section>
    </div>
  );
}
