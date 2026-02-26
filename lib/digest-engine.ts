import { jobs, type Job } from "./data/jobs";
import { calculateMatchScore, loadPreferences } from "./match-engine";
import type { UserPreferences } from "@/app/settings/page";

export interface DigestJob {
  job: Job;
  matchScore: number;
}

export interface DailyDigest {
  date: string;
  jobs: DigestJob[];
  generatedAt: string;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayKey(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

/**
 * Get localStorage key for today's digest
 */
export function getDigestStorageKey(date: string = getTodayKey()): string {
  return `jobTrackerDigest_${date}`;
}

/**
 * Generate digest for today
 * - Select top 10 jobs sorted by:
 *   1) matchScore descending
 *   2) postedDaysAgo ascending
 */
export function generateDigest(preferences: UserPreferences | null): DailyDigest {
  const today = getTodayKey();
  
  // Calculate match scores for all jobs
  const jobsWithScores = jobs.map((job) => ({
    job,
    matchScore: calculateMatchScore(job, preferences).score,
  }));

  // Sort by: 1) matchScore descending, 2) postedDaysAgo ascending
  jobsWithScores.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.job.postedDaysAgo - b.job.postedDaysAgo;
  });

  // Take top 10
  const topJobs = jobsWithScores.slice(0, 10);

  const digest: DailyDigest = {
    date: today,
    jobs: topJobs,
    generatedAt: new Date().toISOString(),
  };

  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(getDigestStorageKey(today), JSON.stringify(digest));
  }

  return digest;
}

/**
 * Load existing digest for a date (or today)
 */
export function loadDigest(date: string = getTodayKey()): DailyDigest | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(getDigestStorageKey(date));
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if digest exists for a date
 */
export function hasDigest(date: string = getTodayKey()): boolean {
  return loadDigest(date) !== null;
}

/**
 * Get or generate digest for today
 * If digest already exists, load existing instead of regenerating
 */
export function getOrGenerateDigest(
  preferences: UserPreferences | null
): DailyDigest {
  const existing = loadDigest();
  if (existing) {
    return existing;
  }
  return generateDigest(preferences);
}

/**
 * Format digest as plain text for clipboard
 */
export function formatDigestAsPlainText(digest: DailyDigest): string {
  const date = new Date(digest.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let text = `Top 10 Jobs For You — 9AM Digest\n`;
  text += `${date}\n`;
  text += `="=".repeat(50)}\n\n`;

  digest.jobs.forEach((item, index) => {
    text += `${index + 1}. ${item.job.title}\n`;
    text += `   Company: ${item.job.company}\n`;
    text += `   Location: ${item.job.location} (${item.job.mode})\n`;
    text += `   Experience: ${item.job.experience} years\n`;
    text += `   Salary: ${item.job.salaryRange}\n`;
    text += `   Match Score: ${item.matchScore}%\n`;
    text += `   Apply: ${item.job.applyUrl}\n\n`;
  });

  text += `---\n`;
  text += `This digest was generated based on your preferences.\n`;
  text += `Job Notification Tracker`;

  return text;
}

/**
 * Format digest as HTML for email
 */
export function formatDigestAsHtml(digest: DailyDigest): string {
  const date = new Date(digest.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let html = `<h2>Top 10 Jobs For You — 9AM Digest</h2>`;
  html += `<p><strong>${date}</strong></p>`;
  html += `<hr style="margin: 20px 0;" />`;

  digest.jobs.forEach((item, index) => {
    html += `<div style="margin-bottom: 20px;">`;
    html += `<h3>${index + 1}. ${item.job.title}</h3>`;
    html += `<p><strong>Company:</strong> ${item.job.company}<br />`;
    html += `<strong>Location:</strong> ${item.job.location} (${item.job.mode})<br />`;
    html += `<strong>Experience:</strong> ${item.job.experience} years<br />`;
    html += `<strong>Salary:</strong> ${item.job.salaryRange}<br />`;
    html += `<strong>Match Score:</strong> ${item.matchScore}%</p>`;
    html += `<p><a href="${item.job.applyUrl}" style="color: #8B0000;">Apply Now</a></p>`;
    html += `</div>`;
  });

  html += `<hr style="margin: 20px 0;" />`;
  html += `<p><em>This digest was generated based on your preferences.</em></p>`;
  html += `<p>Job Notification Tracker</p>`;

  return html;
}

/**
 * Create mailto URL for email draft
 */
export function createEmailDraft(digest: DailyDigest): string {
  const subject = encodeURIComponent("My 9AM Job Digest");
  const body = encodeURIComponent(formatDigestAsPlainText(digest));
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Copy digest to clipboard
 */
export async function copyDigestToClipboard(digest: DailyDigest): Promise<boolean> {
  try {
    const text = formatDigestAsPlainText(digest);
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
