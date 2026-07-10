export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  github: string;
  demo?: string;
  featured?: boolean;
};

export const expertise = [
  {
    title: "Scalable Systems",
    description:
      "Designing applications that grow gracefully — from architecture decisions to operational patterns that hold under load.",
    icon: "⬡",
  },
  {
    title: "Agentic Applications",
    description:
      "Building autonomous software that reasons, plans, and acts — from single agents to coordinated multi-agent workflows.",
    icon: "◎",
  },
  {
    title: "Agentic Microservices",
    description:
      "Decomposing intelligence into independently deployable services with clear boundaries, contracts, and observability.",
    icon: "◈",
  },
  {
    title: "Distributed Computation",
    description:
      "Parallel and fault-tolerant processing across nodes — task orchestration, stream processing, and workload scheduling.",
    icon: "⇄",
  },
  {
    title: "Distributed Storage",
    description:
      "Data systems built for consistency, partition tolerance, and horizontal scale — from replication to sharding strategies.",
    icon: "▤",
  },
];

export const projects: Project[] = [
  {
    slug: "ui-navigator-agent",
    title: "UI-Navigator Agent",
    description:
      "Autonomous browser agent that accepts a target platform, operational goal, and task intent, then plans and executes multi-step UI workflows end to end. Designed to translate natural-language objectives into reliable, platform-specific interaction sequences without manual navigation.",
    tags: ["Agentic AI", "LangGraph", "Browser Automation", "LLM"],
    github: "https://github.com/mpaydar/ui-navigator-agent-v2",
    demo: "https://agent-ui-weld.vercel.app/",
    featured: true,
  },
  {
    slug: "resumesnap",
    title: "ResumeSnap",
    description:
      "Career intelligence platform with a companion browser extension. SpaCy NLP resolves contextual semantics from resume content, the Gemini REST API generates stack-aligned project outlines, and Azure Whisper handles voice-to-text ingestion for hands-free input.",
    tags: ["NLP", "SpaCy", "Gemini", "FastAPI", "Azure"],
    github: "https://github.com/mpaydar/CareerLensAI-v2",
    demo: "https://career-lens-ai-v2.vercel.app/",
    featured: true,
  },
  {
    slug: "gandom-bakery-platform",
    title: "Gandom Bakery Platform",
    description:
      "Production e-commerce system for a local bakery with real-time admin notifications, bidirectional inventory sync between back office and storefront, Stripe payment processing, and automated inventory ingestion workflows.",
    tags: ["Next.js", "Stripe", "Real-time", "E-commerce"],
    github: "https://github.com/mpaydar/Official_GandomBakeryPlatform",
    demo: "https://official-gandom-bakery-platform.vercel.app/",
    featured: true,
  },
];

export const resume = {
  name: "Moe Bayat",
  title: "AI Data Engineer & Cloud Engineer",
  location: "New York, NY",
  phone: "917-434-3777",
  summary:
    "Systems Architect and DevOps/Platform Engineer with 4+ years of experience designing high-scale, fault-tolerant infrastructure and high-velocity data pipelines. Proven expertise in architecting resilient cloud infrastructure (Azure/AWS), building automated CI/CD deployment workflows, and implementing state-driven AI agents (LangGraph) to optimize internal operations and microservices. Expert in containerized environments, infrastructure as code, and performance optimization for mission-critical platform scaling.",
  skills: [
    {
      category: "Languages",
      items: ["Python", "Go (channels, goroutines, concurrency)", "SQL"],
    },
    {
      category: "Backend & APIs",
      items: [
        "FastAPI",
        "Node.js",
        "Django",
        "REST API Design",
        "WebSocket",
        "Next.js",
      ],
    },
    {
      category: "Data & Analytics",
      items: [
        "PostgreSQL (index tuning, partitioning)",
        "Snowflake",
        "Delta Lake",
        "Databricks",
        "Airflow DAGs",
      ],
    },
    {
      category: "Cloud",
      items: [
        "AWS S3",
        "AWS Lambda",
        "AWS CloudWatch",
        "Azure Blob/Container",
        "Azure Synapse",
        "Azure Databricks",
        "Azure Data Factory",
        "Azure Server",
      ],
    },
    {
      category: "ETL / Pipeline Migration",
      items: [
        "ELT/ETL workflow design",
        "Alteryx-to-AWS migration",
        "Event-driven pipelines",
        "Azure Service Bus & Event Hubs",
      ],
    },
    {
      category: "Dashboards & Forecasting",
      items: [
        "Data modeling for incentive structures",
        "KPI reporting",
        "Sales channel analytics",
        "Real-time visualization",
      ],
    },
    {
      category: "DevOps & IaC",
      items: [
        "CI/CD pipelines (GitHub Actions)",
        "Docker",
        "Kubernetes (AKS)",
        "Terraform",
        "Makefile",
        "Prometheus",
        "Grafana",
      ],
    },
    {
      category: "AI Tooling",
      items: [
        "LangGraph (agent workflows, DAG execution)",
        "Cursor",
        "Claude",
        "ChatGPT",
      ],
    },
  ],
  experience: [
    {
      role: "Founder & Full-Stack/ML Infrastructure Engineer",
      company: "CareerLens AI",
      period: "Jan 2026 — Present",
      highlights: [
        "Built a high-performance NLP parsing microservice using FastAPI, SpaCy, and Redis to classify high-velocity text processing streams.",
        "Containerized Python microservices using Docker and deployed to Azure Kubernetes Service (AKS) with Horizontal Pod Autoscaling (HPA) and Helm charts for traffic elasticity.",
        "Provisioned the complete Azure stack (AKS, App Service, Key Vault, Container Registry) via Terraform with remote state management in Blob Storage across multi-stage environments.",
        "Owned GitHub Actions workflows featuring automated lint, test, and Docker build gates on PRs; instrumented microservices with Prometheus metrics and Grafana sidecars to monitor real-time inference latency.",
        "Enforced robust API gateway security and per-user AI call quotas using Upstash rate-limiting and Next.js middleware.",
      ],
    },
    {
      role: "Data Systems Researcher",
      company: "NJIT — Secure Data Processing Lab",
      period: "Sep 2023 — May 2025",
      highlights: [
        "Architected privacy-preserving pipelines with Fully Homomorphic Encryption (FHE) for secure computation on encrypted datasets.",
        "Designed advanced partitioning and indexing algorithms for PostgreSQL, optimizing scan performance on billion-row datasets.",
      ],
    },
  ],
  technicalProjects: [
    {
      title: "UI-Navigator Agent",
      highlights: [
        "Built an autonomous UI agent that maps user-defined platform targets and task goals into executable browser workflows using LangGraph-orchestrated reasoning and LLM-driven action planning.",
        "Deployed as a production web application with live demo infrastructure on Vercel, enabling end-to-end task execution across target platforms from a single intent-based interface.",
      ],
    },
    {
      title: "ResumeSnap (CareerLens AI)",
      highlights: [
        "Architected a FastAPI microservice stack with SpaCy NLP for contextual resume parsing, Gemini API integration for stack-aware project generation, and Azure Whisper for voice input pipelines.",
        "Shipped a browser companion extension and full-stack platform with containerized deployment, rate-limited API gateways, and observability across inference and ingestion paths.",
      ],
    },
    {
      title: "Gandom Bakery Platform",
      highlights: [
        "Delivered a production e-commerce platform with Stripe checkout, real-time admin notifications, automated inventory entry, and synchronized stock levels between admin tooling and the public storefront.",
      ],
    },
  ],
  education: [
    {
      degree: "M.S. in Computer Science",
      school: "New Jersey Institute of Technology",
    },
    {
      degree: "B.A. in Computer Science",
      school: "Queens College, CUNY",
    },
  ],
  links: {
    github: "https://github.com/mpaydar",
    linkedin: "https://linkedin.com/in/bayattheanalyst",
    notebooklm:
      process.env.NEXT_PUBLIC_NOTEBOOKLM_URL ?? "https://notebooklm.google.com/",
    email: "mailto:mbny30@gmail.com",
    schedule: process.env.NEXT_PUBLIC_SCHEDULE_URL ?? "",
  },
};

export const recruiter = {
  timezone: "America/New_York",
  timezoneLabel: "Eastern Time (ET)",
  slotMinutes: 20,
  /** Weekday indices (0 = Sun) when intro calls are available */
  availableDays: [1, 2, 3, 4, 5],
  hoursLabel: "Weekdays · 4:00 PM – 5:00 PM ET",
  /** 20-min slots within the 4–5 PM window */
  slotTimes: [
    { hour: 16, minute: 0 },
    { hour: 16, minute: 20 },
    { hour: 16, minute: 40 },
  ],
};

export type CertificationStatus = "earned" | "in-progress" | "planned";

export type Certification = {
  id: string;
  title: string;
  issuer: string;
  status: CertificationStatus;
  earnedDate?: string;
  image?: string;
  imageAlt?: string;
  credentialUrl?: string;
  skills: string[];
  accent: string;
};

export const certificationTrack = {
  title: "Azure Databricks Data Engineer Associate",
  subtitle: "Databricks Certified Data Engineer Associate",
  description:
    "Documenting the certifications and badges I earn while preparing for the associate exam — Azure data services, lakehouse patterns, and production-grade pipeline engineering.",
  status: "in-progress" as const,
};

export const certifications: Certification[] = [
  {
    id: "azure-adls-gen2",
    title: "Introduction to Azure Data Lake Storage Gen2",
    issuer: "Microsoft",
    status: "earned",
    earnedDate: "2026-06-24",
    image: "/images/certifications/azure-adls-gen2.png",
    imageAlt:
      "Microsoft certificate of completion for Introduction to Azure Data Lake Storage Gen2, awarded to M Bayat",
    skills: ["Azure Storage", "Data Lake Gen2", "Hierarchical namespace"],
    accent: "#0078d4",
  },
  {
    id: "databricks-de-associate",
    title: "Databricks Certified Data Engineer Associate",
    issuer: "Databricks",
    status: "in-progress",
    skills: ["Delta Lake", "Apache Spark", "Lakehouse", "Medallion architecture"],
    accent: "#ff3621",
  },
];

export type PromptPackageLevel = "engineer" | "senior" | "architect";

export type PromptPackage = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  useCase: string;
  level: PromptPackageLevel;
  tags: string[];
  accent: string;
  prompt: string;
};

export const promptPackagingTrack = {
  title: "Prompt Packaging",
  subtitle: "Engineer-leveled prompts for cloud architecture & Azure SDK",
  description:
    "Structured prompt systems for designing and implementing complex cloud architectures faster. Each package combines robust cloud engineering context with prompt engineering patterns — focused on Azure, the Python SDK, and production-grade data platform work.",
  focusAreas: ["Cloud Engineering", "Azure Python SDK", "Data Factory", "Prompt Engineering"],
};

export const promptPackages: PromptPackage[] = [
  {
    id: "azure-architecture-blueprint",
    title: "Azure Architecture Blueprint",
    subtitle: "Design complex cloud systems before writing code",
    description:
      "Frames a full architecture pass — requirements, constraints, service selection, failure modes, and implementation sequencing for Azure workloads.",
    useCase: "Greenfield platform design, migration planning, or architecture review before sprint work.",
    level: "architect",
    tags: ["Azure", "Architecture", "IaC", "Reliability"],
    accent: "#0078d4",
    prompt: `You are a senior Azure cloud architect. Design a production-grade architecture for the following workload.

## Context
- Workload: [describe the system — e.g. batch ETL, real-time ingestion, ML inference API]
- Scale: [users, events/sec, data volume, regions]
- Compliance: [e.g. PII, HIPAA, SOC2, data residency]
- Team constraints: [team size, IaC maturity, existing services]

## Deliverables
1. **Reference architecture** — diagram in Mermaid, with clear data/control planes
2. **Azure service map** — justify each service (compute, storage, messaging, identity, observability)
3. **Network & security** — VNet layout, private endpoints, Key Vault usage, RBAC model
4. **Failure modes** — single points of failure, retry/idempotency strategy, DR approach
5. **Implementation phases** — ordered build plan with milestones and rollback points
6. **Cost & ops** — rough cost drivers and monitoring/alerting essentials

Be specific to Azure. Prefer managed services. Flag trade-offs explicitly. Do not hand-wave — every recommendation must tie to a requirement.`,
  },
  {
    id: "azure-python-sdk-scaffold",
    title: "Azure Python SDK Scaffold",
    subtitle: "Generate typed, production-ready SDK integration code",
    description:
      "Produces Azure SDK Python modules with auth, error handling, retries, logging, and test hooks — not tutorial snippets.",
    useCase: "Bootstrapping service integrations for Blob, Data Factory, Key Vault, or Resource Manager.",
    level: "engineer",
    tags: ["Azure SDK", "Python", "DefaultAzureCredential", "Error handling"],
    accent: "#0078d4",
    prompt: `You are a senior Python engineer specializing in the Azure SDK for Python.

## Task
Implement a production-ready integration for: [Azure service — e.g. Blob Storage, Data Factory, Key Vault]

## Requirements
- Use \`azure-identity\` (\`DefaultAzureCredential\`) — no hardcoded secrets
- Async where the SDK supports it; explain sync fallback if needed
- Typed function signatures with docstrings
- Retry policy for transient errors (429, 5xx, timeouts)
- Structured logging (no print statements)
- Configuration via environment variables with sensible defaults
- Idempotent operations where applicable
- Unit test stubs with \`unittest.mock\` or \`pytest\` fixtures

## Output format
1. \`requirements.txt\` additions
2. Module code (\`services/<name>.py\`)
3. Example usage script
4. Brief README section: auth setup, local dev, common pitfalls

Target Python 3.11+. Follow Azure SDK best practices from official docs. No placeholder TODOs — ship complete, runnable code.`,
  },
  {
    id: "adf-pipeline-designer",
    title: "ADF Pipeline Designer",
    subtitle: "Design Azure Data Factory pipelines with operational rigor",
    description:
      "Packages prompts for linked services, datasets, pipeline DAGs, triggers, and observability for ADF-centric data engineering.",
    useCase: "Building or refactoring ADF pipelines for batch ingestion, transformation, or lakehouse loads.",
    level: "engineer",
    tags: ["Azure Data Factory", "ETL", "Linked Services", "Medallion"],
    accent: "#0078d4",
    prompt: `You are an Azure Data Factory specialist designing a production ETL/ELT pipeline.

## Pipeline context
- Source(s): [e.g. REST API, on-prem SQL, Blob CSV, Event Hub]
- Destination: [e.g. ADLS Gen2 bronze/silver/gold, Synapse, Databricks]
- Schedule: [tumbling window, event-driven, daily batch]
- SLA: [freshness, max runtime, retry budget]

## Deliverables
1. **Linked services & datasets** — naming conventions, parameterization strategy
2. **Pipeline DAG** — activities, dependencies, fan-out/fan-in patterns
3. **Data flow or mapping** — transformation logic, schema drift handling
4. **Error handling** — failure paths, dead-letter storage, alerting hooks
5. **ARM/Bicep or Terraform sketch** — key resources to provision alongside ADF
6. **Operational runbook** — what to check when a run fails, common root causes

Use medallion/lakehouse terminology where appropriate. Prefer parameterized pipelines over copy-paste. Include monitoring integration (Log Analytics / App Insights).`,
  },
  {
    id: "cloud-prompt-engineering-kit",
    title: "Cloud Prompt Engineering Kit",
    subtitle: "Meta-prompts that improve your architecture prompts",
    description:
      "Engineer-leveled templates for refining, decomposing, and stress-testing cloud design prompts before handing them to an LLM.",
    useCase: "Improving prompt quality, splitting large architecture asks, or adding verification loops.",
    level: "senior",
    tags: ["Prompt Engineering", "Chain-of-thought", "Verification", "Cloud"],
    accent: "#7c3aed",
    prompt: `You are a prompt engineering specialist for cloud architecture workflows.

## Input
I will provide a draft prompt used for cloud engineering tasks. Your job is to upgrade it.

## Upgrade checklist
1. **Role & expertise** — Is the persona specific enough (Azure architect vs generic cloud expert)?
2. **Context slots** — Are all variable inputs clearly marked with \`[brackets]\`?
3. **Output structure** — Does it request numbered deliverables, not prose walls?
4. **Constraints** — Are non-goals, compliance, and scale limits explicit?
5. **Verification** — Add a self-check step: "Before finalizing, list assumptions and risks"
6. **Anti-patterns** — Instruct the model to avoid vague recommendations and missing trade-offs

## Output
1. Revised prompt (copy-paste ready)
2. Changelog — what you improved and why
3. Optional **decomposition** — if the prompt is too large, split into Phase 1 (design) and Phase 2 (implementation) prompts

Draft prompt to upgrade:
---
[paste your draft prompt here]
---`,
  },
];
