"use client";

import { MapPin, Briefcase, Clock, ExternalLink, Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Job } from "@/lib/data/jobs";

interface JobDetailModalProps {
  job: Job | null;
  isOpen: boolean;
  isSaved: boolean;
  onClose: () => void;
  onSave: (jobId: string) => void;
}

export function JobDetailModal({
  job,
  isOpen,
  isSaved,
  onClose,
  onSave,
}: JobDetailModalProps) {
  if (!job) return null;

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-semibold text-foreground">
                {job.title}
              </DialogTitle>
              <p className="mt-1 text-lg text-muted-foreground">
                {job.company}
              </p>
            </div>
            <Badge className={`${getSourceColor(job.source)} shrink-0`}>
              {job.source}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium text-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {job.location} ({job.mode})
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Experience</p>
              <p className="font-medium text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {job.experience} years
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Salary</p>
              <p className="font-medium text-foreground">{job.salaryRange}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Posted</p>
              <p className="font-medium text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {getPostedText(job.postedDaysAgo)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Description
            </h4>
            <p className="text-muted-foreground leading-relaxed">
              {job.description}
            </p>
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 text-sm bg-muted text-muted-foreground rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              variant={isSaved ? "default" : "outline"}
              className="flex-1"
              onClick={() => onSave(job.id)}
            >
              <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "Saved" : "Save Job"}
            </Button>
            <Button
              className="flex-1"
              onClick={() => window.open(job.applyUrl, "_blank", "noopener,noreferrer")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Apply Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
