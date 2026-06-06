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

export type PostCategory = (typeof POST_CATEGORIES)[number]["value"];

export const POST_CATEGORY_OPTIONS = POST_CATEGORIES.map(({ value, label }) => ({
  label,
  value,
}));

export function getPostCategoryLabel(value: PostCategory | string | null | undefined) {
  return POST_CATEGORIES.find((c) => c.value === value)?.label ?? null;
}

export function getPostCategoryDescription(value: PostCategory | string | null | undefined) {
  return POST_CATEGORIES.find((c) => c.value === value)?.description ?? null;
}
