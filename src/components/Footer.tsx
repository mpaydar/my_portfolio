import SocialIcons from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Moe Bayat
        </p>
        <SocialIcons size="sm" />
      </div>
    </footer>
  );
}
