import { resume } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Moe Bayat
        </p>
        <div className="flex items-center gap-6">
          <a
            href="https://github.com/mpaydar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={resume.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted transition hover:text-accent"
          >
            LinkedIn
          </a>
          <a
            href={resume.links.email}
            className="text-sm text-muted transition hover:text-accent"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
