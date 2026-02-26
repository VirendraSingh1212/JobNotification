/**
 * Test Checklist Engine for Job Notification Tracker
 * Manages the 10-point QA checklist with localStorage persistence
 */

export const TEST_STORAGE_KEY = "jobTrackerTestStatus";

export interface TestItem {
  id: string;
  label: string;
  tooltip: string;
}

export interface TestStatus {
  [testId: string]: boolean;
}

// The 10 test checklist items
export const TEST_ITEMS: TestItem[] = [
  {
    id: "preferences-persist",
    label: "Preferences persist after refresh",
    tooltip: "Set preferences in /settings, refresh page, verify values remain",
  },
  {
    id: "match-score",
    label: "Match score calculates correctly",
    tooltip: "Set role keywords and skills, verify jobs show correct match percentages",
  },
  {
    id: "show-matches-toggle",
    label: '"Show only matches" toggle works',
    tooltip: "Enable toggle on /dashboard, verify only jobs above threshold are shown",
  },
  {
    id: "save-job-persist",
    label: "Save job persists after refresh",
    tooltip: "Save a job on /dashboard, refresh page, verify it remains saved",
  },
  {
    id: "apply-new-tab",
    label: "Apply opens in new tab",
    tooltip: "Click Apply button on any job card, verify it opens in new tab",
  },
  {
    id: "status-persist",
    label: "Status update persists after refresh",
    tooltip: "Change job status to Applied/Rejected/Selected, refresh, verify status remains",
  },
  {
    id: "status-filter",
    label: "Status filter works correctly",
    tooltip: "Use status filter dropdown, verify only jobs with selected status appear",
  },
  {
    id: "digest-top-10",
    label: "Digest generates top 10 by score",
    tooltip: "Generate digest on /digest, verify top 10 jobs sorted by match score",
  },
  {
    id: "digest-persist",
    label: "Digest persists for the day",
    tooltip: "Generate digest, refresh /digest, verify same digest loads without regenerate",
  },
  {
    id: "no-console-errors",
    label: "No console errors on main pages",
    tooltip: "Open browser console, navigate through all pages, verify no errors",
  },
];

/**
 * Get current test status from localStorage
 * Returns empty object if none exists
 */
export function getTestStatus(): TestStatus {
  if (typeof window === "undefined") return {};

  try {
    const stored = localStorage.getItem(TEST_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch {
    return {};
  }
}

/**
 * Set a specific test item status
 */
export function setTestStatus(testId: string, checked: boolean): void {
  if (typeof window === "undefined") return;

  try {
    const current = getTestStatus();
    current[testId] = checked;
    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(current));
  } catch {
    // Silently fail - no crashes
  }
}

/**
 * Toggle a test item status
 */
export function toggleTestStatus(testId: string): boolean {
  const current = getTestStatus();
  const newStatus = !current[testId];
  setTestStatus(testId, newStatus);
  return newStatus;
}

/**
 * Check if a specific test is passed
 */
export function isTestPassed(testId: string): boolean {
  return getTestStatus()[testId] || false;
}

/**
 * Get count of passed tests
 */
export function getPassedCount(): number {
  const status = getTestStatus();
  return TEST_ITEMS.filter((item) => status[item.id]).length;
}

/**
 * Check if all tests are passed
 */
export function areAllTestsPassed(): boolean {
  return getPassedCount() === TEST_ITEMS.length;
}

/**
 * Reset all tests to unchecked
 */
export function resetAllTests(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(TEST_STORAGE_KEY);
  } catch {
    // Silently fail - no crashes
  }
}

/**
 * Calculate progress percentage
 */
export function getTestProgress(): number {
  return Math.round((getPassedCount() / TEST_ITEMS.length) * 100);
}
