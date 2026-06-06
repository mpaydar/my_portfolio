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
  title: "DevOps & Platform Engineer | Agentic AI Systems",
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
  hoursLabel: "9:00 AM – 6:00 PM ET",
  slotHours: [10, 14, 16],
};
