export const POST_CATEGORIES = [
  {
    value: "linux-docker-kubernetes",
    label: "Linux, Docker & Kubernetes",
    description:
      "Container orchestration, Linux internals, Docker workflows, and Kubernetes operations.",
  },
  {
    value: "cloud-exploration",
    label: "Cloud Exploration",
    description:
      "Cloud platforms, managed services, infrastructure patterns, and deployment strategies.",
  },
  {
    value: "agent-development-tools",
    label: "Agent Development Tools",
    description:
      "Agentic frameworks, LLM tooling, orchestration patterns, and autonomous system design.",
  },
  {
    value: "core-coding-intuition",
    label: "Core Coding Intuition",
    description:
      "Fundamentals, algorithms, system design reasoning, and language-level engineering depth.",
  },
] as const;

export type KnownPostCategory = (typeof POST_CATEGORIES)[number]["value"];

export function getPostCategoryLabel(value: KnownPostCategory | string | null | undefined) {
  return POST_CATEGORIES.find((c) => c.value === value)?.label ?? null;
}

export function getPostCategoryDescription(
  value: KnownPostCategory | string | null | undefined,
) {
  return POST_CATEGORIES.find((c) => c.value === value)?.description ?? null;
}
