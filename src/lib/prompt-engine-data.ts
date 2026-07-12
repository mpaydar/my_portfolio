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

// Shape matches the Azure SDK's resources.get_by_id() response for ONE resource —
// no query wrapper, no correlation/billing metadata. This is what a local, read-only
// ARM lookup actually returns.
const sharedRawPayload = `{
  "id": "/subscriptions/a3f8c2e1-9b4d-4f6a-8c2e-1a9b4d4f6a8c/resourceGroups/rg-prod-data-eastus/providers/Microsoft.Storage/storageAccounts/stprodingestblob",
  "name": "stprodingestblob",
  "type": "Microsoft.Storage/storageAccounts",
  "location": "eastus",
  "tags": {
    "environment": "production",
    "costCenter": "CC-4821",
    "owner": "data-engineering",
    "dataClassification": "confidential",
    "pipeline": "databricks-blob-ingestion"
  },
  "sku": { "name": "Standard_ZRS", "tier": "Standard" },
  "kind": "StorageV2",
  "properties": {
    "provisioningState": "Succeeded",
    "primaryEndpoints": {
      "blob": "https://stprodingestblob.blob.core.windows.net/",
      "dfs": "https://stprodingestblob.dfs.core.windows.net/"
    },
    "isHnsEnabled": true,
    "accessTier": "Hot",
    "minimumTlsVersion": "TLS1_2",
    "allowBlobPublicAccess": false,
    "allowSharedKeyAccess": false,
    "networkAcls": {
      "defaultAction": "Deny",
      "bypass": "AzureServices",
      "virtualNetworkRules": [
        {
          "id": "/subscriptions/a3f8c2e1-9b4d-4f6a-8c2e-1a9b4d4f6a8c/resourceGroups/rg-prod-data-eastus/providers/Microsoft.Network/virtualNetworks/vnet-prod-data/subnets/snet-databricks",
          "action": "Allow"
        }
      ]
    },
    "encryption": {
      "keySource": "Microsoft.Keyvault",
      "keyvaultproperties": {
        "keyvaulturi": "https://kv-prod-data.vault.azure.net/",
        "keyname": "storage-cmk"
      },
      "services": {
        "blob": { "enabled": true, "keyType": "Account" }
      }
    },
    "primaryLocation": "eastus",
    "statusOfPrimary": "available"
  }
}`;

// The only input the local script needs — a direct ARM resource path,
// mirroring resources.get_by_id(resource_group_name, resource_provider_namespace,
// parent_resource_path, resource_type, resource_name, api_version).
export const minimalConfigSchema = `{
  "resource_group_name": "",
  "resource_provider_namespace": "",
  "parent_resource_path": "",
  "resource_type": "",
  "resource_name": ""
}`;

export const promptEngineTiers: PromptEngineTierConfig[] = [
  {
    id: "precision",
    label: "Precision",
    tagline: "High precision / schema anchoring",
    focus: "Strict schema anchoring, chain-of-logic forcing, minimizing hallucinations.",
    profileName: "Precision profile",
    rawPayload: sharedRawPayload,
    optimizedPrompt: `SYSTEM — Databricks Ingestion from Blob Storage (Prompt Engine · Precision)

ROLE
You are a senior Azure data engineer. Answer ONLY from the anchored resource facts below.
Do not infer regions, endpoints, or security settings not explicitly present.

ANCHORED FACTS
- Source: stprodingestblob (Microsoft.Storage/storageAccounts) | SKU: Standard_ZRS | Kind: StorageV2
- Region: eastus | HNS (ADLS Gen2): enabled | Access tier: Hot
- Endpoints: blob=https://stprodingestblob.blob.core.windows.net/ | dfs=https://stprodingestblob.dfs.core.windows.net/
- Network: defaultAction=Deny | bypass=AzureServices | VNet rule → snet-databricks allowed
- Security: TLS 1.2 min | shared key access DISABLED | public blob access DISABLED
- Encryption: CMK via Key Vault (kv-prod-data) | blob service encryption ON
- Tags: production, confidential, pipeline=databricks-blob-ingestion

CHAIN-OF-LOGIC (required before recommendations)
1. Confirm Databricks can reach this account only via the allowed VNet rule (snet-databricks) — no public path exists.
2. Map the ingestion auth method to the shared-key-disabled + CMK constraints (must use Entra ID / managed identity, not account keys).
3. Flag any unknowns (e.g. container names, path-level ACLs) as UNVERIFIED — never fabricate.

OUTPUT SCHEMA
{
  "ingestion_auth_method": string,
  "network_path": { "allowed": boolean, "via": string },
  "risk_findings": [{ "severity", "evidence_field", "recommendation" }],
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
    optimizedPrompt: `SYS|DATABRICKS-BLOB-INGEST|compression-profile

CTX:
src=stprodingestblob|sku=Std_ZRS|kind=StorageV2|reg=eastus|hns=on|tier=Hot
ep: blob=stprodingestblob.blob.core.windows.net dfs=stprodingestblob.dfs.core.windows.net
net: default=Deny|bypass=AzureServices|vnet=snet-databricks:Allow
sec: tls>=1.2|sharedKey=OFF|publicBlob=OFF|cmk=kv-prod-data
tags: prod|confidential|pipeline=databricks-blob-ingestion

TASK: compress ingestion-readiness review → bullet findings w/ field refs only
OUT: {auth_method, network_path:1ln, risks:[sev+evidence+fix], gaps:[]}
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
    optimizedPrompt: `SYSTEM — Databricks Ingestion from Blob Storage (Prompt Engine · Balanced)

ROUTING: complexity=HIGH → precision anchors for network/security/encryption; compression=MODERATE for tags/endpoints

ANCHORED CORE
source=stprodingestblob | region=eastus | kind=StorageV2 | hns=on | tier=Hot
network: default=Deny | bypass=AzureServices | vnetRule=snet-databricks:Allow
security: tls>=1.2 | sharedKeyAccess=OFF | publicBlobAccess=OFF | cmk=kv-prod-data

ADAPTIVE RULES
- Preserve exact IDs for network, encryption, and auth fields
- Compress repetitive endpoint and tag metadata
- Route ambiguous fields (container ACLs, lifecycle policy) to UNVERIFIED bucket

OUTPUT
{ auth_method, network_path, risks[], compression_profile: "balanced-25%", routing: "adaptive" }

GUARDRAILS: hallucination checks ACTIVE on network + security + encryption sections`,
    metrics: [
      { label: "Tokens Saved", value: "Target: ~25%", tone: "emerald", highlight: true },
      { label: "Hallucination Guardrails", value: "Active", tone: "azure" },
      { label: "Routing Mode", value: "Adaptive", tone: "azure" },
      { label: "Compression Profile", value: "Selective", tone: "neutral" },
    ],
  },
];
