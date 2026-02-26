"use client";

import { useState, useEffect, useMemo } from "react";
import { Briefcase, Settings, Filter } from "lucide-react";
import Link from "next/link";
import { JobCard, JobDetailModal, FilterBar, type FilterState } from "@/components/jobs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToastProvider, useToast } from "@/components/ui/toast";
import { jobs, type Job } from "@/lib/data/jobs";
import { calculateMatchScore, loadPreferences, hasPreferences, type MatchResult } from "@/lib/match-engine";
import type { UserPreferences } from "@/app/settings/page";
import { getJobStatus, type JobStatus } from "@/lib/status-tracker";

const SAVED_JOBS_KEY = "savedJobs";

function DashboardContent() {
  const { toast } = useToast();
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showOnlyMatches, setShowOnlyMatches] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    keyword: "",
    location: "all",
    mode: "all",
    experience: "all",
    source: "all",
    status: "all",
    sort: "latest",
  });

  // Load saved jobs and preferences from localStorage
  useEffect(() => {
    // Load saved jobs
    const storedSaved = localStorage.getItem(SAVED_JOBS_KEY);
    if (storedSaved) {
      try {
        setSavedJobs(JSON.parse(storedSaved));
      } catch {
        setSavedJobs([]);
      }
    }

    // Load preferences
    const loadedPrefs = loadPreferences();
    setPreferences(loadedPrefs);
  }, []);

  // Save to localStorage
  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSaved = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };

  // Calculate match scores for all jobs
  const jobMatchResults = useMemo(() => {
    const results = new Map<string, MatchResult>();
    jobs.forEach((job) => {
      results.set(job.id, calculateMatchScore(job, preferences));
    });
    return results;
  }, [preferences]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Apply "Show only matches" filter first
    if (showOnlyMatches && preferences) {
      const minScore = preferences.minMatchScore;
      result = result.filter((job) => {
        const matchResult = jobMatchResults.get(job.id);
        return matchResult && matchResult.score >= minScore;
      });
    }

    // Keyword filter (AND logic)
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(keyword) ||
          job.company.toLowerCase().includes(keyword)
      );
    }

    // Location filter (AND logic)
    if (filters.location && filters.location !== "all") {
      result = result.filter((job) => job.location === filters.location);
    }

    // Mode filter (AND logic)
    if (filters.mode && filters.mode !== "all") {
      result = result.filter((job) => job.mode === filters.mode);
    }

    // Experience filter (AND logic)
    if (filters.experience && filters.experience !== "all") {
      result = result.filter((job) => job.experience === filters.experience);
    }

    // Source filter (AND logic)
    if (filters.source && filters.source !== "all") {
      result = result.filter((job) => job.source === filters.source);
    }

    // Status filter (AND logic)
    if (filters.status && filters.status !== "all") {
      result = result.filter((job) => getJobStatus(job.id) === filters.status);
    }

    // Sort
    switch (filters.sort) {
      case "latest":
        result.sort((a, b) => a.postedDaysAgo - b.postedDaysAgo);
        break;
      case "oldest":
        result.sort((a, b) => b.postedDaysAgo - a.postedDaysAgo);
        break;
      case "match-score":
        result.sort((a, b) => {
          const aScore = jobMatchResults.get(a.id)?.score || 0;
          const bScore = jobMatchResults.get(b.id)?.score || 0;
          return bScore - aScore;
        });
        break;
      case "salary-high":
        result.sort((a, b) => {
          const aMatch = a.salaryRange.match(/(\d+)/);
          const bMatch = b.salaryRange.match(/(\d+)/);
          const aVal = aMatch ? parseInt(aMatch[1]) : 0;
          const bVal = bMatch ? parseInt(bMatch[1]) : 0;
          return bVal - aVal;
        });
        break;
      case "salary-low":
        result.sort((a, b) => {
          const aMatch = a.salaryRange.match(/(\d+)/);
          const bMatch = b.salaryRange.match(/(\d+)/);
          const aVal = aMatch ? parseInt(aMatch[1]) : 0;
          const bVal = bMatch ? parseInt(bMatch[1]) : 0;
          return aVal - bVal;
        });
        break;
    }

    return result;
  }, [filters, showOnlyMatches, preferences, jobMatchResults]);

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleStatusChange = (job: Job, status: JobStatus) => {
    toast(`Status updated: ${status}`, "success");
  };

  const prefsSet = hasPreferences();

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
      <div className="max-w-7xl">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Your personalized job matches and recommendations.
        </p>

        {/* Preferences Banner */}
        {!prefsSet && (
          <div className="mt-6 p-4 bg-muted border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Set your preferences to activate intelligent matching.
              </p>
            </div>
            <Link href="/settings">
              <Button variant="outline" size="sm">
                Set Preferences
              </Button>
            </Link>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mt-8">
          <FilterBar filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results Count and Match Toggle */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
          {prefsSet && (
            <div className="flex items-center gap-2">
              <Checkbox
                id="show-only-matches"
                checked={showOnlyMatches}
                onCheckedChange={(checked) => setShowOnlyMatches(checked === true)}
              />
              <Label htmlFor="show-only-matches" className="text-sm font-normal cursor-pointer">
                Show only jobs above my threshold ({preferences?.minMatchScore}%)
              </Label>
            </div>
          )}
        </div>

        {/* Job Grid */}
        {filteredJobs.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobs.includes(job.id)}
                matchResult={jobMatchResults.get(job.id)}
                onView={handleViewJob}
                onSave={toggleSaveJob}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="mt-10 flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-border rounded-lg bg-card">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Filter className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No roles match your criteria
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              {showOnlyMatches
                ? "No jobs meet your minimum match score. Try adjusting filters or lowering your threshold in settings."
                : "Try adjusting your filters to see more results."}
            </p>
            {showOnlyMatches && (
              <Button variant="outline" onClick={() => setShowOnlyMatches(false)}>
                Show All Jobs
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        isSaved={selectedJob ? savedJobs.includes(selectedJob.id) : false}
        onClose={() => setIsModalOpen(false)}
        onSave={toggleSaveJob}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}
