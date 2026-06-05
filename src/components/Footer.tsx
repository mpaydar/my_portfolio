import { resume } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <p className="font-mono text-xs text-zinc-500">
          © {new Date().getFullYear()} Mohammad Bayat
        </p>
        <div className="flex items-center gap-6">
          <a
            href={resume.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-500 transition hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            GitHub
          </a>
          <a
            href={resume.links.email}
            className="text-sm text-zinc-500 transition hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
