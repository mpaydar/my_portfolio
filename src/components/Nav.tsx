import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import PromptLockIcon from "@/components/PromptLockIcon";

const links = [
  { href: "/", label: "Articles" },
  { href: "/prompt-packaging", label: "Prompts", locked: true },
  { href: "/about", label: "About" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition hover:text-accent"
        >
          Moe Bayat
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            {links.map(({ href, label, locked }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={
                    locked
                      ? "nav-prompts-link rounded-md px-2.5 py-1.5 text-sm sm:px-3"
                      : "rounded-md px-2.5 py-1.5 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground sm:px-3"
                  }
                >
                  {locked ? (
                    <>
                      <span className="nav-prompts-lock" aria-hidden>
                        <PromptLockIcon className="h-3.5 w-3.5" />
                      </span>
                      <span>{label}</span>
                      <span className="nav-prompts-new">New</span>
                    </>
                  ) : (
                    label
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
