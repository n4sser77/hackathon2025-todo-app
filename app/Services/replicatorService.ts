import { SYNC_GATEWAY_URL, SYNC_PASSWORD, SYNC_USERNAME } from "@env";
import {
  BasicAuthenticator,
  Database,
  Replicator,
  ReplicatorConfiguration,
  ReplicatorType,
  URLEndpoint,
} from "cbl-reactnative";

console.log("SYNC_GATEWAY_URL:", SYNC_GATEWAY_URL);
console.log("SYNC_USERNAME:", SYNC_USERNAME);
console.log("SYNC_PASSWORD:", SYNC_PASSWORD);

// Call this with your db instance, e.g. from DatabaseService
export async function startReplication(database: Database) {
  if (!SYNC_GATEWAY_URL || !SYNC_USERNAME || !SYNC_PASSWORD) {
    throw new Error("Sync config missing in .env");
  }
  // 1. Configure the endpoint and authentication
  const target = new URLEndpoint(SYNC_GATEWAY_URL);
  const auth = new BasicAuthenticator(SYNC_USERNAME, SYNC_PASSWORD);

  // 2. Create the replicator config
  const config = new ReplicatorConfiguration(target);

  // Add the default collection
  const collection = await database.defaultCollection();
  config.addCollection(collection);
  config.setAuthenticator(auth);
  config.setReplicatorType(ReplicatorType.PUSH_AND_PULL); // or PULL, PUSH
  config.setContinuous(true); // true for live sync, false for one-shot
  config.setAcceptOnlySelfSignedCerts(false); // For Capella: ensure we do NOT accept only self-signed certs (default is false)
  // For Capella: ensure we do NOT accept only self-signed certs (default is false)

  // (Optional) Advanced config
  // config.setHeartbeat(150);
  // config.setMaxAttempts(20);
  // config.setMaxAttemptWaitTime(600);

  // 3. Create and start the replicator
  const replicator = await Replicator.create(config);

  // 4. Listen for status changes
  const token = await replicator.addChangeListener((change) => {
    const error = change.status.getError();
    if (error) {
      console.error("Replication error:", error);
    }
    console.log("Replicator status:", change.status.getActivityLevel());
    // You can use ReplicatorActivityLevel.{STOPPED, OFFLINE, CONNECTING, IDLE, BUSY}
  });

  // --- Document Change Listener ---
  // This listener will be called for every document that is pushed or pulled by the replicator.
  // It helps you debug which documents are actually being synced (received or sent).
  // You can use this to update UI, trigger notifications, or just log for troubleshooting.
  const docToken = await replicator.addDocumentChangeListener((replication) => {
    console.log(`Replication type :: ${replication.isPush ? "Push" : "Pull"}`);
    for (const document of replication.documents) {
      if (document.error === undefined) {
        console.log(`Doc ID :: ${document.id}`);
        if (document.flags && document.flags.includes("DELETED")) {
          console.log("Successfully replicated a deleted document");
        }
      } else {
        console.error("Error replicating document:", document.error);
      }
    }
  });
  // --- End Document Change Listener ---

  await replicator.start(true); // false = don't reset checkpoint

  // 5. Return replicator and tokens for cleanup (now includes docToken)
  return { replicator, token, docToken };
}

// To stop and clean up:
export async function stopReplication(
  replicator: Replicator,
  token: any,
  docToken?: any
) {
  await replicator.removeChangeListener(token);
  // Remove document change listener if present
  if (docToken) {
    await replicator.removeChangeListener(docToken);
  }
  await replicator.stop();
}
