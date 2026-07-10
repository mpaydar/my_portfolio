import Link from "next/link";
import SocialIcons from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Moe Bayat
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <nav aria-label="Footer" className="flex flex-wrap gap-4 font-mono text-xs">
            <Link href="/about" className="text-muted transition hover:text-foreground">
              About
            </Link>
          </nav>
          <SocialIcons size="sm" />
        </div>
      </div>
    </footer>
  );
}
