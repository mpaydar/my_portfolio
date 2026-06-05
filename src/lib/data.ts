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
  summary:
    "Systems engineer focused on designing highly scalable applications, agentic software, and distributed infrastructure — across both computation and storage layers.",
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Your Company",
      period: "2023 — Present",
      highlights: [
        "Architected agentic microservice platform serving production workloads",
        "Designed horizontally scalable storage layer with partition-aware routing",
        "Led distributed computation pipeline handling high-throughput event streams",
      ],
    },
    {
      role: "Software Engineer",
      company: "Previous Company",
      period: "2020 — 2023",
      highlights: [
        "Built fault-tolerant services with emphasis on observability and SLOs",
        "Contributed to internal frameworks for distributed task execution",
      ],
    },
  ],
  skills: [
    "Distributed Systems",
    "Agentic AI / LLM Orchestration",
    "Microservices Architecture",
    "System Design",
    "Kubernetes / Cloud Native",
    "Event-Driven Architecture",
    "Database Internals",
    "Go / TypeScript / Python",
  ],
  education: [
    {
      degree: "B.S. Computer Science",
      school: "Your University",
      period: "2016 — 2020",
    },
  ],
  links: {
    github: "https://github.com/mohammadbayat",
    email: "mailto:hello@mohammadbayat.dev",
  },
};
