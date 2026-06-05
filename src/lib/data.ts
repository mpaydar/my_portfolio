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
    slug: "agent-orchestrator",
    title: "Agent Orchestrator",
    description:
      "A distributed runtime for coordinating autonomous agents across microservices with event-driven handoffs and state recovery.",
    tags: ["Agents", "Microservices", "Event-Driven"],
    github: "https://github.com/mohammadbayat/agent-orchestrator",
    demo: "https://demo.example.com/agent-orchestrator",
    featured: true,
  },
  {
    slug: "shard-store",
    title: "ShardStore",
    description:
      "Experimental distributed key-value store exploring consistent hashing, replication, and partition-aware routing.",
    tags: ["Distributed Storage", "Systems Design"],
    github: "https://github.com/mohammadbayat/shard-store",
    featured: true,
  },
  {
    slug: "compute-mesh",
    title: "Compute Mesh",
    description:
      "Fault-tolerant task execution framework for spreading computation across a cluster with automatic retry and backpressure.",
    tags: ["Distributed Computation", "Go"],
    github: "https://github.com/mohammadbayat/compute-mesh",
    demo: "https://demo.example.com/compute-mesh",
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
      title: "Autonomous Documentation & UI Agent",
      highlights: [
        "Engineered a cross-platform AI Agent using LangGraph DAGs to navigate software interfaces, execute multi-step microservice tasks, and interpret ambiguous user intent using OpenAI LLMs.",
        "Optimized token usage and compute efficiency via intelligent state-saving within LangGraph, achieving cost-effective and responsive agent execution.",
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
    email: "mailto:mbny30@gmail.com",
  },
};
