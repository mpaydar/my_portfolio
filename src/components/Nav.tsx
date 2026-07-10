import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Articles" },
  { href: "/prompt-packaging", label: "Prompts" },
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
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-md px-2.5 py-1.5 text-sm text-muted transition hover:bg-surface-hover hover:text-foreground sm:px-3"
                >
                  {label}
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
