export type PromptEngineTier = "precision" | "compression" | "balanced";

export type PromptEngineMetric = {
  label: string;
  value: string;
  tone: "azure" | "emerald" | "neutral" | "amber";
  highlight?: boolean;
};

export type PromptEngineTierConfig = {
  id: PromptEngineTier;
  label: string;
  tagline: string;
  focus: string;
  profileName: string;
  rawPayload: string;
  optimizedPrompt: string;
  metrics: PromptEngineMetric[];
};

const sharedRawPayload = `{
  "subscriptionId": "a3f8c2e1-9b4d-4f6a-8c2e-1a9b4d4f6a8c",
  "resourceGroup": "rg-prod-aks-eastus",
  "timestamp": "2026-07-10T18:42:11.384Z",
  "correlationId": "8f3a2c1b-9d4e-5f6a-8c2e-1a9b4d4f6a8c",
  "queryKind": "ResourceGraph",
  "data": {
    "totalRecords": 1,
    "count": 1,
    "resultTruncated": false,
    "resources": [
      {
        "id": "/subscriptions/a3f8c2e1-9b4d-4f6a-8c2e-1a9b4d4f6a8c/resourceGroups/rg-prod-aks-eastus/providers/Microsoft.ContainerService/managedClusters/aks-prod-platform",
        "name": "aks-prod-platform",
        "type": "microsoft.containerservice/managedclusters",
        "location": "eastus",
        "tags": {
          "environment": "production",
          "costCenter": "CC-4821",
          "owner": "platform-engineering",
          "dataClassification": "internal",
          "backupPolicy": "daily-geo-redundant",
          "complianceScope": "soc2-type2"
        },
        "properties": {
          "kubernetesVersion": "1.29.7",
          "provisioningState": "Succeeded",
          "powerState": { "code": "Running" },
          "dnsPrefix": "aksprodplatform",
          "fqdn": "aksprodplatform-8f3a2c1b.hcp.eastus.azmk8s.io",
          "agentPoolProfiles": [
            {
              "name": "systempool",
              "count": 3,
              "vmSize": "Standard_D4s_v5",
              "osType": "Linux",
              "mode": "System",
              "enableAutoScaling": true,
              "minCount": 3,
              "maxCount": 6,
              "availabilityZones": ["1", "2", "3"],
              "nodeLabels": { "workload": "system", "tier": "platform" },
              "nodeTaints": ["CriticalAddonsOnly=true:NoSchedule"]
            },
            {
              "name": "workloadpool",
              "count": 8,
              "vmSize": "Standard_D8s_v5",
              "osType": "Linux",
              "mode": "User",
              "enableAutoScaling": true,
              "minCount": 4,
              "maxCount": 20,
              "availabilityZones": ["1", "2", "3"],
              "nodeLabels": { "workload": "application", "tier": "compute" }
            }
          ],
          "networkProfile": {
            "networkPlugin": "azure",
            "networkPolicy": "calico",
            "loadBalancerSku": "standard",
            "serviceCidr": "10.1.0.0/16",
            "dnsServiceIP": "10.1.0.10",
            "outboundType": "loadBalancer",
            "podCidr": "10.244.0.0/16"
          },
          "addonProfiles": {
            "omsagent": {
              "enabled": true,
              "config": {
                "logAnalyticsWorkspaceResourceID": "/subscriptions/a3f8c2e1-9b4d-4f6a-8c2e-1a9b4d4f6a8c/resourcegroups/rg-prod-aks-eastus/providers/microsoft.operationalinsights/workspaces/law-prod-platform"
              }
            },
            "azurepolicy": { "enabled": true },
            "azureKeyvaultSecretsProvider": { "enabled": true, "config": { "enableSecretRotation": "true" } }
          },
          "aadProfile": {
            "managed": true,
            "enableAzureRBAC": true,
            "adminGroupObjectIDs": ["c4d5e6f7-8a9b-0c1d-2e3f-4a5b6c7d8e9f"]
          },
          "securityProfile": {
            "workloadIdentity": { "enabled": true },
            "defender": { "logAnalyticsWorkspaceResourceId": "/subscriptions/a3f8c2e1-9b4d-4f6a-8c2e-1a9b4d4f6a8c/resourcegroups/rg-prod-aks-eastus/providers/microsoft.operationalinsights/workspaces/law-prod-platform" }
          },
          "diagnosticSettings": {
            "logs": ["kube-apiserver", "kube-audit", "kube-controller-manager", "cluster-autoscaler"],
            "metrics": ["AllMetrics"],
            "retentionDays": 90
          }
        },
        "sku": { "name": "Base", "tier": "Standard" }
      }
    ]
  },
  "metadata": {
    "requestRegion": "eastus",
    "apiVersion": "2024-01-01",
    "requestCharge": 2.84,
    "resultSizeBytes": 48392,
    "warnings": [],
    "extensions": {
      "bicepLintState": {
        "filePath": "./infra/aks-platform.bicep",
        "errors": 0,
        "warnings": 3,
        "suppressed": [
          "no-unused-existing-resources",
          "use-recent-api-versions",
          "secure-parameter-defaults"
        ]
      }
    }
  }
}`;

export const promptEngineTiers: PromptEngineTierConfig[] = [
  {
    id: "precision",
    label: "Precision",
    tagline: "High precision / schema anchoring",
    focus: "Strict schema anchoring, chain-of-logic forcing, minimizing hallucinations.",
    profileName: "Precision profile",
    rawPayload: sharedRawPayload,
    optimizedPrompt: `SYSTEM — Azure AKS Platform Review (Prompt Engine · Precision)

ROLE
You are a senior Azure platform engineer. Answer ONLY from the anchored payload below.
Do not infer resources, SKUs, regions, or policies not explicitly present.

ANCHORED FACTS
- Cluster: aks-prod-platform (Microsoft.ContainerService/managedClusters)
- Region: eastus | K8s: 1.29.7 | State: Running / Succeeded
- Pools: systempool (3–6× D4s_v5, System, taint CriticalAddonsOnly) + workloadpool (4–20× D8s_v5, User)
- Network: Azure CNI + Calico | serviceCidr 10.1.0.0/16 | podCidr 10.244.0.0/16
- Identity: AAD-managed RBAC | Workload Identity ON | Key Vault CSI + rotation ON
- Observability: Log Analytics wired | Defender enabled | 90-day diagnostic retention
- Tags: production, SOC2 scope, owner platform-engineering

CHAIN-OF-LOGIC (required before recommendations)
1. List explicit constraints from payload (HA zones, autoscale bounds, taints).
2. Map each recommendation → anchored field reference.
3. Flag any unknowns as UNVERIFIED — never fabricate.

OUTPUT SCHEMA
{
  "risk_findings": [{ "severity", "evidence_field", "recommendation" }],
  "topology_summary": string,
  "unverified_gaps": string[]
}

HALLUCINATION GUARD: If a field is absent, respond "NOT IN PAYLOAD" — do not guess.`,
    metrics: [
      {
        label: "Hallucination Risk",
        value: "Target: Strictly anchored",
        tone: "emerald",
        highlight: true,
      },
      { label: "Context Validity", value: "Target: 100%", tone: "emerald" },
      { label: "Tokens", value: "Baseline (illustrative)", tone: "neutral" },
      { label: "Schema Enforcement", value: "Structured output", tone: "azure" },
    ],
  },
  {
    id: "compression",
    label: "Compression",
    tagline: "Token reduction / cost focus",
    focus: "Aggressive context compression, stripping JSON noise, syntax abbreviation.",
    profileName: "Compression profile",
    rawPayload: sharedRawPayload,
    optimizedPrompt: `SYS|AKS-REVIEW|compression-profile

CTX:
sub=a3f8c2e1|rG=rg-prod-aks-eastus|cls=aks-prod-platform|reg=eastus|k8s=1.29.7|st=Run/OK
pools: sys=3-6@D4s_v5[taint:CriticalAddonsOnly] usr=4-20@D8s_v5|az=1,2,3
net: azure+calico|svc=10.1.0.0/16|pod=10.244.0.0/16|lb=std
sec: aad-rbac|wi=on|kv-csi+rot=on|defender=on|diag=90d
tags: prod|soc2|owner=platform-eng

TASK: compress review → bullet findings w/ field refs only
OUT: {risks:[sev+evidence+fix], topology:1ln, gaps:[]}
RULE: no expand beyond CTX | abbrev OK | skip null/verbose metadata`,
    metrics: [
      { label: "Tokens Saved", value: "Target: ~42%", tone: "emerald", highlight: true },
      { label: "Est. Cost Reduction", value: "Target: 40%+", tone: "emerald" },
      { label: "Data Density", value: "Ultra-compressed", tone: "azure" },
      { label: "Payload Stripped", value: "Metadata + noise removed", tone: "neutral" },
    ],
  },
  {
    id: "balanced",
    label: "Balanced",
    tagline: "Adaptive routing",
    focus: "Dynamic routing based on payload complexity, selective compression.",
    profileName: "Balanced profile",
    rawPayload: sharedRawPayload,
    optimizedPrompt: `SYSTEM — Azure AKS Platform Review (Prompt Engine · Balanced)

ROUTING: complexity=HIGH → precision anchors for security/network; compression=MODERATE for tags/metadata

ANCHORED CORE
cluster=aks-prod-platform | region=eastus | k8s=1.29.7 | prov=Succeeded
pools: system(3-6,D4s_v5,taint) + workload(4-20,D8s_v5) | zones=1,2,3
network: azureCNI+calico | svcCidr=10.1.0.0/16
security: aadRBAC | workloadIdentity | kvCSI+rotation | defender+law

ADAPTIVE RULES
- Preserve exact IDs for identity, network, and compliance fields
- Compress repetitive agentPool keys and diagnostic enumerations
- Route ambiguous fields to UNVERIFIED bucket

OUTPUT
{ risks[], topology_summary, compression_profile: "balanced-25%", routing: "adaptive" }

GUARDRAILS: hallucination checks ACTIVE on security + identity sections`,
    metrics: [
      { label: "Tokens Saved", value: "Target: ~25%", tone: "emerald", highlight: true },
      { label: "Hallucination Guardrails", value: "Active", tone: "azure" },
      { label: "Routing Mode", value: "Adaptive", tone: "azure" },
      { label: "Compression Profile", value: "Selective", tone: "neutral" },
    ],
  },
];
