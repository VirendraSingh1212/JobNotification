"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, HelpCircle, RotateCcw, AlertTriangle, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import {
  TEST_ITEMS,
  getTestStatus,
  setTestStatus,
  getPassedCount,
  getTestProgress,
  areAllTestsPassed,
  resetAllTests,
  type TestStatus,
} from "@/lib/test-checklist";

export default function TestChecklistPage() {
  const [testStatus, setTestStatusState] = useState<TestStatus>({});
  const [mounted, setMounted] = useState(false);

  // Load test status on mount
  useEffect(() => {
    setTestStatusState(getTestStatus());
    setMounted(true);
  }, []);

  const handleToggle = (testId: string) => {
    const current = testStatus[testId] || false;
    const newStatus = !current;
    setTestStatus(testId, newStatus);
    setTestStatusState((prev) => ({ ...prev, [testId]: newStatus }));
  };

  const handleReset = () => {
    resetAllTests();
    setTestStatusState({});
  };

  const passedCount = getPassedCount();
  const progress = getTestProgress();
  const allPassed = areAllTestsPassed();

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Test Checklist
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              QA verification before shipping.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Test Checklist
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              QA verification before shipping.
            </p>
          </div>

          {/* Test Result Summary */}
          <Card className={`border ${allPassed ? "border-success" : "border-border"} mb-8`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Tests Passed: {passedCount} / {TEST_ITEMS.length}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {progress}% complete
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {allPassed ? (
                    <Badge className="bg-success text-success-foreground px-3 py-1">
                      <CheckCheck className="w-4 h-4 mr-1" />
                      Ready to Ship
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground px-3 py-1">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      In Progress
                    </Badge>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    allPassed ? "bg-success" : "bg-primary"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Warning Message */}
              {!allPassed && (
                <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <p className="text-sm text-warning flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Resolve all issues before shipping.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  Verification Items
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Test Status
                </Button>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {TEST_ITEMS.map((item, index) => {
                  const isChecked = testStatus[item.id] || false;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-start gap-4 p-4 transition-colors ${
                        isChecked ? "bg-success/5" : "hover:bg-muted/50"
                      }`}
                    >
                      <div className="pt-0.5">
                        <Checkbox
                          id={item.id}
                          checked={isChecked}
                          onCheckedChange={() => handleToggle(item.id)}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <label
                          htmlFor={item.id}
                          className={`flex items-center gap-2 cursor-pointer ${
                            isChecked
                              ? "text-foreground line-through opacity-60"
                              : "text-foreground"
                          }`}
                        >
                          <span className="font-medium">
                            {index + 1}. {item.label}
                          </span>
                        </label>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground hover:text-foreground transition-colors">
                            <HelpCircle className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs">
                          <p className="text-sm">{item.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Ship Button */}
          <div className="mt-8 text-center">
            <Link href="/jt/08-ship">
              <Button
                size="lg"
                disabled={!allPassed}
                className={allPassed ? "" : "opacity-50 cursor-not-allowed"}
              >
                {allPassed ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Proceed to Ship
                  </>
                ) : (
                  <>
                    <Circle className="w-5 h-5 mr-2" />
                    Complete All Tests First
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
