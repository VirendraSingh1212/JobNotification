"use client";

import { useState, useEffect } from "react";
import { Mail, Settings, Copy, Check, ExternalLink, Sparkles, Calendar, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { hasPreferences, loadPreferences } from "@/lib/match-engine";
import type { UserPreferences } from "@/app/settings/page";
import {
  generateDigest,
  loadDigest,
  copyDigestToClipboard,
  createEmailDraft,
  type DailyDigest,
} from "@/lib/digest-engine";
import {
  getRecentStatusUpdates,
  formatRelativeTime,
  type StatusUpdate,
  type JobStatus,
} from "@/lib/status-tracker";

export default function DigestPage() {
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [hasPrefs, setHasPrefs] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);

  // Load preferences, digest, and status updates on mount
  useEffect(() => {
    const prefs = loadPreferences();
    setPreferences(prefs);
    setHasPrefs(hasPreferences());

    // Load existing digest for today
    const existingDigest = loadDigest();
    if (existingDigest) {
      setDigest(existingDigest);
    }

    // Load recent status updates
    setStatusUpdates(getRecentStatusUpdates(5));
  }, []);

  // Refresh status updates periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusUpdates(getRecentStatusUpdates(5));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerateDigest = async () => {
    setIsGenerating(true);
    // Small delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newDigest = generateDigest(preferences);
    setDigest(newDigest);
    setIsGenerating(false);
  };

  const handleCopyToClipboard = async () => {
    if (!digest) return;
    const success = await copyDigestToClipboard(digest);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get match score color
  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-success text-success-foreground";
    if (score >= 60) return "bg-warning text-warning-foreground";
    if (score >= 40) return "bg-muted text-muted-foreground";
    return "bg-muted/50 text-muted-foreground/70";
  };

  // Get status badge color
  const getStatusBadgeColor = (status: JobStatus) => {
    switch (status) {
      case "Not Applied":
        return "bg-muted text-muted-foreground";
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Selected":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // No preferences set - show blocking message
  if (!hasPrefs) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Digest
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your daily 9AM summary of matched opportunities.
            </p>
          </div>

          <Card className="border border-border">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Settings className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Set preferences to generate a personalized digest.
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Configure your job preferences to receive a tailored daily summary of opportunities that match your criteria.
              </p>
              <Link href="/settings">
                <Button size="lg">
                  <Settings className="w-4 h-4 mr-2" />
                  Set Preferences
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No digest generated yet
  if (!digest) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Digest
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your daily 9AM summary of matched opportunities.
            </p>
          </div>

          <Card className="border border-border">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Generate Today's Digest
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Get your personalized top 10 job matches based on your preferences.
              </p>
              <Button
                size="lg"
                onClick={handleGenerateDigest}
                disabled={isGenerating}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Today's 9AM Digest (Simulated)"}
              </Button>
              <p className="mt-4 text-xs text-muted-foreground">
                Demo Mode: Daily 9AM trigger simulated manually.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No matches found
  if (digest.jobs.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Digest
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Your daily 9AM summary of matched opportunities.
            </p>
          </div>

          <Card className="border border-border">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                No matching roles today.
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Check again tomorrow for new opportunities that match your preferences.
              </p>
              <Button variant="outline" onClick={handleGenerateDigest}>
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerate Digest
              </Button>
            </CardContent>
          </Card>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo Mode: Daily 9AM trigger simulated manually.
          </p>
        </div>
      </div>
    );
  }

  // Digest display - Email-style layout
  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10 bg-background">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
            Digest
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Your daily 9AM summary of matched opportunities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <Button
            variant="outline"
            onClick={handleCopyToClipboard}
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy Digest to Clipboard
              </>
            )}
          </Button>
          <a href={createEmailDraft(digest)}>
            <Button variant="outline">
              <Mail className="w-4 h-4 mr-2" />
              Create Email Draft
            </Button>
          </a>
          <Button variant="outline" onClick={handleGenerateDigest}>
            <Sparkles className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        </div>

        {/* Email-Style Digest Card */}
        <Card className="border border-border shadow-sm bg-card">
          <CardHeader className="pb-4">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "Georgia, serif" }}>
                Top 10 Jobs For You — 9AM Digest
              </h2>
              <p className="mt-2 text-muted-foreground">
                {formatDate(digest.date)}
              </p>
            </div>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            {/* Job List */}
            <div className="space-y-6">
              {digest.jobs.map((item, index) => (
                <div
                  key={item.job.id}
                  className="pb-6 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {index + 1}. {item.job.title}
                      </h3>
                      <p className="mt-1 text-muted-foreground">
                        {item.job.company}
                      </p>
                    </div>
                    <Badge className={`${getMatchColor(item.matchScore)} shrink-0`}>
                      {item.matchScore}% match
                    </Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="text-foreground font-medium">Location:</span>{" "}
                      {item.job.location} ({item.job.mode})
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Experience:</span>{" "}
                      {item.job.experience} years
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Salary:</span>{" "}
                      {item.job.salaryRange}
                    </div>
                    <div>
                      <span className="text-foreground font-medium">Posted:</span>{" "}
                      {item.job.postedDaysAgo === 0
                        ? "Today"
                        : item.job.postedDaysAgo === 1
                        ? "Yesterday"
                        : `${item.job.postedDaysAgo} days ago`}
                    </div>
                  </div>

                  <div className="mt-3">
                    <a
                      href={item.job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Apply Now
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <Separator className="my-6" />
            <p className="text-center text-sm text-muted-foreground">
              This digest was generated based on your preferences.
            </p>
          </CardContent>
        </Card>

        {/* Demo Mode Note */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo Mode: Daily 9AM trigger simulated manually.
        </p>

        {/* Recent Status Updates Section */}
        {statusUpdates.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">
                Recent Status Updates
              </h3>
            </div>

            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {statusUpdates.map((update, index) => (
                    <div
                      key={`${update.jobId}-${index}`}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {update.jobTitle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {update.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <Badge className={getStatusBadgeColor(update.status)}>
                          {update.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatRelativeTime(update.updatedAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
