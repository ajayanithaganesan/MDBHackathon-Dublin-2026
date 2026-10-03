import { connectToDatabase, closeDatabase } from "../backend/src/db/connection.js";
import { setIncidentCounter } from "../backend/src/services/counterService.js";

/**
 * 12 Curated Synthetic IT Incidents for OpsMemory Search Engine Seed Dataset
 * Covering VMware Horizon, Windows GPO, Azure Cloud, and Networking (DNS/VPN).
 * Includes both keyword matches and semantically paraphrased incidents to test Hybrid Search.
 */
export const seedIncidents = [
  // --- VMware Horizon Cluster ---
  {
    incidentNumber: "INC-2026-0001",
    title: "Horizon VDI login failure with black screen after desktop assignment",
    description: "Users successfully authenticate through VMware Horizon Client, but are stuck at a persistent black screen and disconnected after 60 seconds.",
    service: "VMware Horizon",
    environment: "Production",
    severity: "High",
    symptoms: ["black screen after login", "session disconnect timeout", "Horizon Client handshake drop", "VDI desktop unreachable"],
    errorMessage: "The connection to the remote computer ended. (Error code: 0x8007000e)",
    rootCause: "FSLogix profile container VHD lock caused by an ungracefully terminated session holding an active lease on the SMB file share.",
    resolution: "Released open file handles on the storage scale-out file server (SOFS) cluster for the user's profile VHDX and applied the 'FSLogix cleanup stale locks' registry key.",
    resolutionSummary: "Cleared locked FSLogix VHDX profile handle on SMB share and restarted FSLogix service.",
    status: "resolved",
    createdAt: new Date("2026-01-10T08:15:00Z"),
    resolvedAt: new Date("2026-01-10T09:05:00Z")
  },
  {
    incidentNumber: "INC-2026-0002",
    title: "VDI users experience blank desktop after login following image update",
    description: "Multiple remote developers report that after the latest golden image rollout, logging into virtual desktops produces an empty screen with no desktop icons or taskbar.",
    service: "VMware Horizon",
    environment: "Production",
    severity: "High",
    symptoms: ["blank desktop", "missing explorer taskbar", "golden image update regression", "delayed shell initialization"],
    errorMessage: "Event 1000: Application Error - explorer.exe failed to start in session",
    rootCause: "A conflicting GPO logon script introduced in the latest patch was waiting synchronously on an unreachable mapped network drive before launching Windows Explorer.",
    resolution: "Reverted the GPO logon script setting to asynchronous execution and redeployed the instant clone pool using the previous snapshot.",
    resolutionSummary: "Changed logon script to asynchronous in Group Policy and repointed pool to stable golden image snapshot.",
    status: "resolved",
    createdAt: new Date("2026-01-14T11:30:00Z"),
    resolvedAt: new Date("2026-01-14T12:45:00Z")
  },
  {
    incidentNumber: "INC-2026-0003",
    title: "Horizon instant clone desktop pool provisioning stuck in customizing state",
    description: "New virtual desktops created in the Horizon management console fail to finish provisioning and display 'Error: Customization operation timed out'.",
    service: "VMware Horizon",
    environment: "Staging",
    severity: "Medium",
    symptoms: ["instant clone provisioning error", "customizing state timeout", "pool expansion failure"],
    errorMessage: "View Composer agent initialization state error (18): Timed out waiting for sysprep customization",
    rootCause: "DNS suffix configuration mismatch on the vCenter template prevented newly cloned VMs from registering hostnames with the Active Directory domain controllers.",
    resolution: "Updated the guest customization specification in vCenter with the correct domain suffix and restarted the Horizon connection broker services.",
    resolutionSummary: "Fixed DNS domain suffix in template specification and republished instant clone pool.",
    status: "resolved",
    createdAt: new Date("2026-01-18T14:20:00Z"),
    resolvedAt: new Date("2026-01-18T15:10:00Z")
  },

  // --- Windows & Active Directory GPO Cluster ---
  {
    incidentNumber: "INC-2026-0004",
    title: "Group Policy failing to apply to domain workstations after patch Tuesday",
    description: "Enterprise workstations are unable to process computer and user group policies. Running gpupdate /force returns processing errors.",
    service: "Windows GPO",
    environment: "Production",
    severity: "High",
    symptoms: ["gpupdate force fails", "security baseline not applying", "Event ID 1058 GroupPolicy error"],
    errorMessage: "The processing of Group Policy failed. Windows could not read the file \\\\domain.com\\sysvol\\...\\gpt.ini",
    rootCause: "Kerberos ticket hardening update required specific encryption types (AES-256) which caused fallback failure on older domain controller replicas.",
    resolution: "Synchronized SYSVOL replication across all Domain Controllers using DFS-R and updated Domain Controller Kerberos encryption types in Default Domain Controllers Policy.",
    resolutionSummary: "Forced DFSR SYSVOL synchronization and harmonized Kerberos encryption algorithms across DCs.",
    status: "resolved",
    createdAt: new Date("2026-01-22T09:00:00Z"),
    resolvedAt: new Date("2026-01-22T10:30:00Z")
  },
  {
    incidentNumber: "INC-2026-0005",
    title: "Windows Server Print Spooler service crashing continuously across print cluster",
    description: "Print Spooler service stops unexpectedly every 5 to 10 minutes on production print servers, halting printing for all branch offices.",
    service: "Windows GPO",
    environment: "Production",
    severity: "Critical",
    symptoms: ["spoolsv.exe crash", "printers disappearing", "print queue offline", "service termination 7034"],
    errorMessage: "Faulting application name: spoolsv.exe, exception code: 0xc0000005 in ntprint.dll",
    rootCause: "A legacy Type 3 third-party printer driver corrupted memory during rendering of PDF color separation queues.",
    resolution: "Isolated the offending driver using Print Driver Isolation mode (Set-PrinterDriver -Isolation Isolated), purged corrupted .spl temporary files in C:\\Windows\\System32\\spool\\PRINTERS, and upgraded driver to V4 universal driver.",
    resolutionSummary: "Purged corrupt spool files, enabled Driver Isolation, and replaced driver with V4 Universal print driver.",
    status: "resolved",
    createdAt: new Date("2026-01-25T13:45:00Z"),
    resolvedAt: new Date("2026-01-25T14:35:00Z")
  },
  {
    incidentNumber: "INC-2026-0006",
    title: "Local security policy preventing non-admin smart card certificate login",
    description: "Engineers and operators cannot authenticate to jump boxes using PIV/CAC smart cards after an automated baseline hardening push.",
    service: "Windows GPO",
    environment: "Production",
    severity: "High",
    symptoms: ["smartcard PIN accepted then login rejected", "an untrusted certificate authority was detected", "jumpbox access failure"],
    errorMessage: "Status: 0xC0000320 - The certificate chain was issued by an untrusted authority.",
    rootCause: "Intermediate CA certificate expired on the enterprise NTAuth store in Active Directory, preventing validation of the smart card certificate chain.",
    resolution: "Published the updated subordinate CA certificate to the NTAuth store using 'certutil -dspublish -f subca.cer NTAuthCA' and ran 'gpupdate /force'.",
    resolutionSummary: "Republished renewed subordinate CA cert into AD NTAuth store and verified CRL distribution point.",
    status: "resolved",
    createdAt: new Date("2026-02-02T16:10:00Z"),
    resolvedAt: new Date("2026-02-02T17:00:00Z")
  },

  // --- Azure Cloud & Infrastructure Cluster ---
  {
    incidentNumber: "INC-2026-0007",
    title: "Azure VM extension installation failing during automated scaling event",
    description: "Virtual machine scale set (VMSS) nodes fail to complete boot sequence when executing the Azure Network Watcher and Monitoring extensions.",
    service: "Azure",
    environment: "Production",
    severity: "High",
    symptoms: ["VMSS deployment failed", "extension provisioning timeout", "scale out stuck at 30%"],
    errorMessage: "VMExtensionProvisioningError: VM has reported a failure when processing extension 'AzureNetworkWatcher'. Error: [50] Connection timed out.",
    rootCause: "Outbound Network Security Group (NSG) rule mistakenly blocked port 443 access to the Azure regional service tag (AzureCloud.northeurope).",
    resolution: "Modified the Network Security Group outbound security rules to allow traffic to AzureCloud service tag on port 443 with Priority 200.",
    resolutionSummary: "Added NSG outbound allow rule for AzureCloud service tag on HTTPS 443.",
    status: "resolved",
    createdAt: new Date("2026-02-08T07:20:00Z"),
    resolvedAt: new Date("2026-02-08T08:10:00Z")
  },
  {
    incidentNumber: "INC-2026-0008",
    title: "Azure Key Vault secret retrieval returning HTTP 403 Forbidden for AKS workloads",
    description: "Microservices running in Azure Kubernetes Service (AKS) cannot fetch database credentials and fail on startup crashloop.",
    service: "Azure",
    environment: "Production",
    severity: "Critical",
    symptoms: ["CrashLoopBackOff in AKS pods", "Key Vault 403 forbidden", "managed identity authentication failed"],
    errorMessage: "StatusCode: 403, SubCode: ForbiddenByFirewall, Message: Client address is not authorized and caller's IP is not allowed.",
    rootCause: "The AKS egress NAT Gateway public IP had changed following a maintenance migration and was missing from the Key Vault allowed IP whitelist.",
    resolution: "Added the new AKS outbound NAT public IP to Key Vault Networking firewall exceptions and configured Azure Virtual Network Service Endpoints for private routing.",
    resolutionSummary: "Whitelisted new egress IP in Azure Key Vault and enabled VNet Service Endpoint for internal routing.",
    status: "resolved",
    createdAt: new Date("2026-02-12T10:05:00Z"),
    resolvedAt: new Date("2026-02-12T10:45:00Z")
  },
  {
    incidentNumber: "INC-2026-0009",
    title: "Azure Blob Storage latency spikes causing application timeout errors",
    description: "Application file download queries are timing out after 30 seconds when retrieving diagnostic dumps from cold tier storage.",
    service: "Azure",
    environment: "Staging",
    severity: "Medium",
    symptoms: ["storage request timeouts", "HTTP 503 ServerBusy", "client read timeouts"],
    errorMessage: "StorageException: The server is busy (ServerBusy, 503).",
    rootCause: "Storage account request rates exceeded default partition key throughput limits because files were using a static prefix partition pattern.",
    resolution: "Implemented hashed prefix naming for blob paths to distribute partition load across Azure Storage scale targets and enabled retry policies with exponential backoff.",
    resolutionSummary: "Added randomized prefix to blob keys and enabled exponential backoff in application SDK.",
    status: "resolved",
    createdAt: new Date("2026-02-15T14:15:00Z"),
    resolvedAt: new Date("2026-02-15T15:00:00Z")
  },

  // --- Networking: DNS & VPN Cluster ---
  {
    incidentNumber: "INC-2026-0010",
    title: "Internal DNS resolution failure for corporate intranet and database endpoints",
    description: "Employees across all offices cannot resolve internal '.corp.local' domain names. Public internet websites remain accessible.",
    service: "DNS/VPN",
    environment: "Production",
    severity: "Critical",
    symptoms: ["DNS Server Failure (SERVFAIL)", "cannot ping internal hosts", "database host not found error"],
    errorMessage: "nslookup db-prod.corp.local returns: *** UnKnown can't find db-prod.corp.local: Server failed",
    rootCause: "The DNS forwarder service crashed on primary Windows DNS server due to an out-of-memory condition caused by DNS debug logging left enabled on the volume.",
    resolution: "Disabled verbose DNS debug file logging, restarted Microsoft DNS Server service (net stop dns && net start dns), and verified replication with secondary DNS server.",
    resolutionSummary: "Turned off verbose DNS debug logging to free disk and memory, restarted DNS service on primary server.",
    status: "resolved",
    createdAt: new Date("2026-02-20T08:00:00Z"),
    resolvedAt: new Date("2026-02-20T08:35:00Z")
  },
  {
    incidentNumber: "INC-2026-0011",
    title: "GlobalProtect remote VPN clients disconnecting intermittently every 60 minutes",
    description: "Remote staff connected via IPsec/SSL VPN drop connection consistently on the hour mark and must re-enter credentials.",
    service: "DNS/VPN",
    environment: "Production",
    severity: "High",
    symptoms: ["VPN disconnects every 60 mins", "session renegotiation fails", "tunnel dropped during video calls"],
    errorMessage: "VPN Gateway Error: IPSec SA lifetime expired; negotiation for replacement SA timed out.",
    rootCause: "Phase 2 IPsec security association (SA) lifetime on the firewall was configured to 3600 seconds with Perfect Forward Secrecy (PFS) DH Group 14, which the client client-side profile did not support during rekey.",
    resolution: "Standardized IPsec Phase 2 lifetime to 28800s (8 hours) and aligned DH Group 19 with ECDH across both GlobalProtect gateway portal and firewall configurations.",
    resolutionSummary: "Aligned Phase 2 IPsec SA lifetime and Diffie-Hellman groups between VPN gateway and client profile.",
    status: "resolved",
    createdAt: new Date("2026-02-24T12:00:00Z"),
    resolvedAt: new Date("2026-02-24T12:50:00Z")
  },
  {
    incidentNumber: "INC-2026-0012",
    title: "Split-tunneling routing failure causing internal SaaS traffic to route over public WAN",
    description: "After updating VPN routing policies, traffic destined for internal cloud proxies bypassed the encrypted tunnel and was rejected by cloud IP security controls.",
    service: "DNS/VPN",
    environment: "Production",
    severity: "Medium",
    symptoms: ["SaaS security alert: unauthorized source IP", "split tunnel route table missing internal subnets", "VPN bypass"],
    errorMessage: "HTTP 403: Access Denied. Your source IP 82.165.xx.xx is not in the approved corporate egress range.",
    rootCause: "A typo in the split-tunnel route inclusion list (CIDR /16 entered as /24) omitted secondary data center subnets from the client routing table.",
    resolution: "Corrected CIDR mask to /16 in the VPN gateway routing table and pushed policy refresh to active client connections.",
    resolutionSummary: "Fixed subnet CIDR notation in split-tunnel policy and refreshed active client routes.",
    status: "resolved",
    createdAt: new Date("2026-03-01T09:15:00Z"),
    resolvedAt: new Date("2026-03-01T09:40:00Z")
  }
];

/**
 * Seeds synthetic incidents and synchronizes the atomic counter.
 */
export async function seedDatabase() {
  const { client, db } = await connectToDatabase();

  try {
    console.log("Seeding OpsMemory database with curated IT incident memory dataset...\n");

    const incidentsCollection = db.collection("incidents");

    // Upsert incidents so script is safe to rerun repeatedly
    let insertedCount = 0;
    let updatedCount = 0;

    for (const incident of seedIncidents) {
      const res = await incidentsCollection.updateOne(
        { incidentNumber: incident.incidentNumber },
        { $set: incident },
        { upsert: true }
      );

      if (res.upsertedCount > 0) {
        insertedCount++;
        console.log(` [INSERTED] ${incident.incidentNumber} - ${incident.service}: "${incident.title.slice(0, 45)}..."`);
      } else {
        updatedCount++;
        console.log(` [UPDATED]  ${incident.incidentNumber} - ${incident.service}: "${incident.title.slice(0, 45)}..."`);
      }
    }

    // Initialize atomic sequence counter to the highest seed number
    const maxSeqNumber = seedIncidents.length;
    await setIncidentCounter(db, maxSeqNumber, 2026);
    console.log(`\n Atomic counter initialized to sequence: ${maxSeqNumber} (Next will be: INC-2026-00${maxSeqNumber + 1})`);

    // Add initial feedback samples to demonstrate analytics
    const feedbackCollection = db.collection("feedback");
    const sampleFeedback = [
      {
        incidentNumber: "INC-2026-0002",
        rating: "helpful",
        comment: "Reverting GPO logon script directly matched the solution in INC-2026-0001.",
        retrievedIncidents: ["INC-2026-0001"],
        createdAt: new Date("2026-01-14T12:50:00Z")
      },
      {
        incidentNumber: "INC-2026-0008",
        rating: "helpful",
        comment: "Identified Key Vault IP firewall restriction immediately.",
        retrievedIncidents: ["INC-2026-0007"],
        createdAt: new Date("2026-02-12T10:50:00Z")
      }
    ];

    for (const fb of sampleFeedback) {
      await feedbackCollection.updateOne(
        { incidentNumber: fb.incidentNumber },
        { $set: fb },
        { upsert: true }
      );
    }
    console.log(" Initial feedback samples seeded for analytics aggregation.");

    console.log(`\nData seeding complete! (Total incidents ready for search: ${seedIncidents.length})`);
  } catch (error) {
    console.error("Data seeding failed:", error);
    throw error;
  } finally {
    await closeDatabase();
  }
}

// Auto-run when executed directly
if (process.argv[1]?.endsWith("seed.js")) {
  seedDatabase().catch(() => process.exit(1));
}

export default seedDatabase;
