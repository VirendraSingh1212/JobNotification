"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations, modes, experiences, sources } from "@/lib/data/jobs";
import { STATUS_OPTIONS, type JobStatus } from "@/lib/status-tracker";

export interface FilterState {
  keyword: string;
  location: string;
  mode: string;
  experience: string;
  source: string;
  status: JobStatus | "all";
  sort: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium">Filters</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search title or company"
            value={filters.keyword}
            onChange={(e) => updateFilter("keyword", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Location */}
        <Select
          value={filters.location}
          onValueChange={(value) => updateFilter("location", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mode */}
        <Select
          value={filters.mode}
          onValueChange={(value) => updateFilter("mode", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Modes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Modes</SelectItem>
            {modes.map((mode) => (
              <SelectItem key={mode} value={mode}>
                {mode}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Experience */}
        <Select
          value={filters.experience}
          onValueChange={(value) => updateFilter("experience", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Experience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Experience</SelectItem>
            {experiences.map((exp) => (
              <SelectItem key={exp} value={exp}>
                {exp} years
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Source */}
        <Select
          value={filters.source}
          onValueChange={(value) => updateFilter("source", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Sources" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sources.map((source) => (
              <SelectItem key={source} value={source}>
                {source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status */}
        <Select
          value={filters.status}
          onValueChange={(value) =>
            updateFilter("status", value as JobStatus | "all")
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="match-score">Match Score</SelectItem>
            <SelectItem value="salary-high">Salary: High to Low</SelectItem>
            <SelectItem value="salary-low">Salary: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
