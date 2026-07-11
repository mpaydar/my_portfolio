export const POST_CATEGORIES = [
  {
    value: "data-engineering",
    label: "Data Engineering",
    description:
      "Pipelines, lakehouse and medallion architecture, Azure Data Factory/Databricks, and large-scale data systems.",
  },
  {
    value: "azure-cloud-architecture",
    label: "Azure Cloud Architecture",
    description:
      "Azure services, infrastructure-as-code, networking, and production-grade cloud system design.",
  },
  {
    value: "agent-development-tools",
    label: "LLM & Agentic Systems on Azure",
    description:
      "Applying large language models and agentic frameworks on Azure — model hosting, orchestration, and cloud-native AI architecture.",
  },
  {
    value: "linux-docker-kubernetes",
    label: "Linux, Docker & Kubernetes",
    description:
      "Container orchestration, Linux internals, Docker workflows, and Kubernetes operations.",
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
