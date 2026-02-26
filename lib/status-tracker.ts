import type { Job } from "./data/jobs";

export type JobStatus = "Not Applied" | "Applied" | "Rejected" | "Selected";

export interface StatusUpdate {
  jobId: string;
  jobTitle: string;
  company: string;
  status: JobStatus;
  updatedAt: string;
}

const STATUS_STORAGE_KEY = "jobTrackerStatus";
const STATUS_HISTORY_KEY = "jobTrackerStatusHistory";

/**
 * Get status for a specific job
 * Returns "Not Applied" if no status exists
 */
export function getJobStatus(jobId: string): JobStatus {
  if (typeof window === "undefined") return "Not Applied";

  try {
    const stored = localStorage.getItem(STATUS_STORAGE_KEY);
    if (!stored) return "Not Applied";

    const statuses: Record<string, JobStatus> = JSON.parse(stored);
    return statuses[jobId] || "Not Applied";
  } catch {
    return "Not Applied";
  }
}

/**
 * Set status for a specific job
 * Also records the update in history
 */
export function setJobStatus(
  job: Job,
  status: JobStatus
): void {
  if (typeof window === "undefined") return;

  try {
    // Get existing statuses
    const stored = localStorage.getItem(STATUS_STORAGE_KEY);
    const statuses: Record<string, JobStatus> = stored
      ? JSON.parse(stored)
      : {};

    // Update status
    statuses[job.id] = status;
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(statuses));

    // Record in history
    recordStatusUpdate(job, status);
  } catch {
    // Silently fail - no crashes
  }
}

/**
 * Record a status update in history
 */
function recordStatusUpdate(job: Job, status: JobStatus): void {
  if (typeof window === "undefined") return;

  try {
    const stored = localStorage.getItem(STATUS_HISTORY_KEY);
    const history: StatusUpdate[] = stored ? JSON.parse(stored) : [];

    const update: StatusUpdate = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      status,
      updatedAt: new Date().toISOString(),
    };

    // Add to beginning of array
    history.unshift(update);

    // Keep only last 50 updates
    const trimmedHistory = history.slice(0, 50);

    localStorage.setItem(STATUS_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch {
    // Silently fail - no crashes
  }
}

/**
 * Get all status updates history
 */
export function getStatusHistory(): StatusUpdate[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STATUS_HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Get recent status updates (last N updates)
 */
export function getRecentStatusUpdates(count: number = 10): StatusUpdate[] {
  const history = getStatusHistory();
  return history.slice(0, count);
}

/**
 * Get all statuses as a map
 */
export function getAllStatuses(): Record<string, JobStatus> {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(STATUS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Get badge color class for a status
 */
export function getStatusBadgeClass(status: JobStatus): string {
  switch (status) {
    case "Not Applied":
      return "bg-muted text-muted-foreground hover:bg-muted/80";
    case "Applied":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "Selected":
      return "bg-success text-success-foreground hover:bg-success/90";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/**
 * Get status options for dropdown/filter
 */
export const STATUS_OPTIONS: JobStatus[] = [
  "Not Applied",
  "Applied",
  "Rejected",
  "Selected",
];

/**
 * Format relative time for status updates
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
