"use client";

import { MapPin, Briefcase, Clock, ExternalLink, Bookmark, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import type { Job } from "@/lib/data/jobs";
import type { MatchResult } from "@/lib/match-engine";
import { getMatchBadgeClass } from "@/lib/match-engine";

interface JobCardProps {
  job: Job;
  isSaved: boolean;
  matchResult?: MatchResult;
  onView: (job: Job) => void;
  onSave: (jobId: string) => void;
}

export function JobCard({ job, isSaved, matchResult, onView, onSave }: JobCardProps) {
  const getSourceColor = (source: string) => {
    switch (source) {
      case "LinkedIn":
        return "bg-[#0077B5] text-white";
      case "Naukri":
        return "bg-[#FF6B6B] text-white";
      case "Indeed":
        return "bg-[#2557A7] text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPostedText = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  return (
    <Card className="border border-border bg-card hover:border-primary/30 transition-colors duration-150">
      <CardContent className="p-5">
        {/* Header: Company, Source, and Match Score */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {job.title}
            </h3>
            <p className="mt-1 text-sm font-medium text-muted-foreground">
              {job.company}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Badge className={`${getSourceColor(job.source)} text-xs`}>
              {job.source}
            </Badge>
            {matchResult && matchResult.score > 0 && (
              <Badge className={`${getMatchBadgeClass(matchResult.color)} text-xs`}>
                {matchResult.score}% match
              </Badge>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>{job.location}</span>
            <span className="text-border">|</span>
            <span>{job.mode}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 shrink-0" />
            <span>{job.experience} years</span>
            <span className="text-border">|</span>
            <span className="font-medium text-foreground">{job.salaryRange}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{getPostedText(job.postedDaysAgo)}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {job.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span className="px-2 py-1 text-xs text-muted-foreground">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-5 py-4 border-t border-border flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onView(job)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          variant={isSaved ? "default" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => onSave(job.id)}
        >
          <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={() => window.open(job.applyUrl, "_blank", "noopener,noreferrer")}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Apply
        </Button>
      </CardFooter>
    </Card>
  );
}
