"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { locations } from "@/lib/data/jobs";

const PREFERENCES_KEY = "jobTrackerPreferences";

export interface UserPreferences {
  roleKeywords: string;
  preferredLocations: string[];
  preferredMode: string[];
  experienceLevel: string;
  skills: string;
  minMatchScore: number;
}

const defaultPreferences: UserPreferences = {
  roleKeywords: "",
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: "",
  skills: "",
  minMatchScore: 40,
};

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isSaved, setIsSaved] = useState(false);

  // Load preferences on mount
  useEffect(() => {
    const stored = localStorage.getItem(PREFERENCES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch {
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    setIsSaved(false);
  };

  const toggleLocation = (location: string) => {
    setPreferences((prev) => {
      const newLocations = prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter((l) => l !== location)
        : [...prev.preferredLocations, location];
      return { ...prev, preferredLocations: newLocations };
    });
    setIsSaved(false);
  };

  const toggleMode = (mode: string) => {
    setPreferences((prev) => {
      const newModes = prev.preferredMode.includes(mode)
        ? prev.preferredMode.filter((m) => m !== mode)
        : [...prev.preferredMode, mode];
      return { ...prev, preferredMode: newModes };
    });
    setIsSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
          Settings
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Configure your job preferences to receive personalized matches.
        </p>

        <div className="mt-10 space-y-6">
          {/* Role Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="roleKeywords">
                  Keywords (comma separated)
                </Label>
                <Input
                  id="roleKeywords"
                  placeholder="e.g. SDE, Frontend, Backend, Full Stack"
                  value={preferences.roleKeywords}
                  onChange={(e) => updatePreference("roleKeywords", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter job titles or roles you are looking for
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferred Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferred Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Select one or more locations</Label>
                <div className="grid grid-cols-2 gap-3">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox
                        id={`location-${location}`}
                        checked={preferences.preferredLocations.includes(location)}
                        onCheckedChange={() => toggleLocation(location)}
                      />
                      <Label
                        htmlFor={`location-${location}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferred Mode */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preferred Work Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>Select preferred work modes</Label>
                <div className="flex flex-wrap gap-4">
                  {["Remote", "Hybrid", "Onsite"].map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mode-${mode}`}
                        checked={preferences.preferredMode.includes(mode)}
                        onCheckedChange={() => toggleMode(mode)}
                      />
                      <Label
                        htmlFor={`mode-${mode}`}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {mode}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Experience Level */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Experience Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="experienceLevel">Select your experience level</Label>
                <Select
                  value={preferences.experienceLevel}
                  onValueChange={(value) => updatePreference("experienceLevel", value)}
                >
                  <SelectTrigger id="experienceLevel">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fresher">Fresher</SelectItem>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Your Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="skills">
                  Skills (comma separated)
                </Label>
                <Input
                  id="skills"
                  placeholder="e.g. React, Node.js, Python, Java"
                  value={preferences.skills}
                  onChange={(e) => updatePreference("skills", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter skills you have to match with job requirements
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Minimum Match Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Minimum Match Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="minMatchScore">
                    Only show jobs above this score
                  </Label>
                  <span className="text-sm font-medium text-primary">
                    {preferences.minMatchScore}
                  </span>
                </div>
                <Slider
                  id="minMatchScore"
                  value={[preferences.minMatchScore]}
                  onValueChange={(value) => updatePreference("minMatchScore", value[0])}
                  min={0}
                  max={100}
                  step={5}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="pt-4 flex items-center gap-4">
            <Button className="w-full sm:w-auto px-8" onClick={handleSave}>
              Save Preferences
            </Button>
            {isSaved && (
              <span className="text-sm text-success">Preferences saved!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
