"use client";

import { useState, useEffect, useMemo } from "react";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { JobCard, JobDetailModal } from "@/components/jobs";
import { Button } from "@/components/ui/button";
import { jobs, type Job } from "@/lib/data/jobs";

const SAVED_JOBS_KEY = "savedJobs";

export default function SavedPage() {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load saved jobs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SAVED_JOBS_KEY);
    if (stored) {
      try {
        setSavedJobIds(JSON.parse(stored));
      } catch {
        setSavedJobIds([]);
      }
    }
  }, []);

  // Get saved job objects
  const savedJobs = useMemo(() => {
    return jobs.filter((job) => savedJobIds.includes(job.id));
  }, [savedJobIds]);

  // Toggle save (unsave)
  const toggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const newSaved = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handleViewJob = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
      <div className="max-w-7xl">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
          Saved
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Jobs you have bookmarked for later review.
        </p>

        {savedJobs.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mt-6">
              <p className="text-sm text-muted-foreground">
                {savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Job Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={true}
                  onView={handleViewJob}
                  onSave={toggleSaveJob}
                />
              ))}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="mt-16 flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-border rounded-lg bg-card">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bookmark className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No saved jobs
            </h3>
            <p className="text-muted-foreground max-w-md mb-6">
              Save jobs from your dashboard to review them later. Your saved opportunities will appear here.
            </p>
            <Link href="/dashboard">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Job Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        isOpen={isModalOpen}
        isSaved={selectedJob ? savedJobIds.includes(selectedJob.id) : false}
        onClose={() => setIsModalOpen(false)}
        onSave={toggleSaveJob}
      />
    </div>
  );
}
