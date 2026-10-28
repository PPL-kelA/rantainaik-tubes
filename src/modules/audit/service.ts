import { createAuditLog, CreateAuditLogParams } from "./repo";

/**
 * Global audit logging helper for all critical status and entity modifications.
 * Keeps payloads lightweight to conserve storage on Neon.
 */
export async function audit(params: CreateAuditLogParams) {
  try {
    return await createAuditLog(params);
  } catch (error) {
    console.error("[AUDIT_ERROR] Failed to record audit log:", error);
    // Non-blocking so operation can still proceed, but logged for monitoring
    return null;
  }
}
