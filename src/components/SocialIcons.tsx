import { resume } from "@/lib/data";

type IconProps = { className?: string };

const links = [
  {
    name: "GitHub",
    href: resume.links.github,
    Icon: GitHubIcon,
  },
  {
    name: "LinkedIn",
    href: resume.links.linkedin,
    Icon: LinkedInIcon,
  },
  {
    name: "NotebookLM",
    href: resume.links.notebooklm,
    Icon: NotebookLMIcon,
  },
] as const;

export default function SocialIcons({
  size = "md",
  className = "",
  hideNotebookLM = false,
}: {
  size?: "sm" | "md";
  className?: string;
  hideNotebookLM?: boolean;
}) {
  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";
  const visibleLinks = hideNotebookLM
    ? links.filter((link) => link.name !== "NotebookLM")
    : links;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {visibleLinks.map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={name}
          title={name}
          className={`group inline-flex ${box} items-center justify-center rounded-lg border border-border bg-surface text-muted transition hover:border-accent/50 hover:bg-surface-hover hover:text-accent hover:shadow-[0_0_16px_var(--glow)]`}
        >
          <Icon className={`${icon} transition group-hover:scale-110`} />
        </a>
      ))}
    </div>
  );
}

function GitHubIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function NotebookLMIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 4.5h9.5L18 7v12.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-13a1 1 0 011-1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 4.5V7H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8 11h8M8 14.5h5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17.5" cy="6.5" r="2.75" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M16.6 6.5l.55.55 1.35-1.35"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
