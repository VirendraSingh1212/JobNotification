import type { Job } from "./data/jobs";
import type { UserPreferences } from "@/app/settings/page";

export interface MatchResult {
  score: number;
  color: "green" | "amber" | "neutral" | "grey";
}

/**
 * Calculate match score based on exact specification:
 * 
 * +25 if any roleKeyword appears in job.title (case-insensitive)
 * +15 if any roleKeyword appears in job.description
 * +15 if job.location matches preferredLocations
 * +10 if job.mode matches preferredMode
 * +10 if job.experience matches experienceLevel
 * +15 if overlap between job.skills and user.skills (any match)
 * +5 if postedDaysAgo <= 2
 * +5 if source is LinkedIn
 * 
 * Cap score at 100.
 */
export function calculateMatchScore(
  job: Job,
  preferences: UserPreferences | null
): MatchResult {
  if (!preferences) {
    return { score: 0, color: "grey" };
  }

  let score = 0;

  // Parse role keywords
  const roleKeywords = preferences.roleKeywords
    .split(",")
    .map((k) => k.trim().toLowerCase())
    .filter((k) => k.length > 0);

  // Parse user skills
  const userSkills = preferences.skills
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.length > 0);

  // +25 if any roleKeyword appears in job.title (case-insensitive)
  if (roleKeywords.length > 0) {
    const titleLower = job.title.toLowerCase();
    const hasKeywordInTitle = roleKeywords.some((keyword) =>
      titleLower.includes(keyword)
    );
    if (hasKeywordInTitle) {
      score += 25;
    }
  }

  // +15 if any roleKeyword appears in job.description
  if (roleKeywords.length > 0) {
    const descLower = job.description.toLowerCase();
    const hasKeywordInDesc = roleKeywords.some((keyword) =>
      descLower.includes(keyword)
    );
    if (hasKeywordInDesc) {
      score += 15;
    }
  }

  // +15 if job.location matches preferredLocations
  if (
    preferences.preferredLocations.length > 0 &&
    preferences.preferredLocations.includes(job.location)
  ) {
    score += 15;
  }

  // +10 if job.mode matches preferredMode
  if (
    preferences.preferredMode.length > 0 &&
    preferences.preferredMode.includes(job.mode)
  ) {
    score += 10;
  }

  // +10 if job.experience matches experienceLevel
  if (
    preferences.experienceLevel &&
    job.experience === preferences.experienceLevel
  ) {
    score += 10;
  }

  // +15 if overlap between job.skills and user.skills (any match)
  if (userSkills.length > 0) {
    const jobSkillsLower = job.skills.map((s) => s.toLowerCase());
    const hasSkillOverlap = userSkills.some((skill) =>
      jobSkillsLower.includes(skill)
    );
    if (hasSkillOverlap) {
      score += 15;
    }
  }

  // +5 if postedDaysAgo <= 2
  if (job.postedDaysAgo <= 2) {
    score += 5;
  }

  // +5 if source is LinkedIn
  if (job.source === "LinkedIn") {
    score += 5;
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine color based on score
  let color: MatchResult["color"];
  if (score >= 80) {
    color = "green";
  } else if (score >= 60) {
    color = "amber";
  } else if (score >= 40) {
    color = "neutral";
  } else {
    color = "grey";
  }

  return { score, color };
}

/**
 * Get badge class based on match color
 */
export function getMatchBadgeClass(color: MatchResult["color"]): string {
  switch (color) {
    case "green":
      return "bg-success text-success-foreground";
    case "amber":
      return "bg-warning text-warning-foreground";
    case "neutral":
      return "bg-muted text-muted-foreground";
    case "grey":
      return "bg-muted/50 text-muted-foreground/70";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/**
 * Load preferences from localStorage
 */
export function loadPreferences(): UserPreferences | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem("jobTrackerPreferences");
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * Check if preferences are set
 */
export function hasPreferences(): boolean {
  const prefs = loadPreferences();
  if (!prefs) return false;
  
  // Check if at least one preference field has value
  return (
    prefs.roleKeywords.trim().length > 0 ||
    prefs.preferredLocations.length > 0 ||
    prefs.preferredMode.length > 0 ||
    prefs.experienceLevel.length > 0 ||
    prefs.skills.trim().length > 0
  );
}
