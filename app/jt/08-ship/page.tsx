"use client";

import { useState, useEffect } from "react";
import { Lock, Unlock, Rocket, ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { areAllTestsPassed, getPassedCount, TEST_ITEMS } from "@/lib/test-checklist";

export default function ShipPage() {
  const [isLocked, setIsLocked] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Check lock status on mount
  useEffect(() => {
    const allPassed = areAllTestsPassed();
    setIsLocked(!allPassed);
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Ship
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Ready for deployment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LOCKED STATE - Show blocking message
  if (isLocked) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
              Ship
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Ready for deployment.
            </p>
          </div>

          {/* Locked Message */}
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-10 text-center">
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-destructive" />
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-3">
                Complete all tests before shipping.
              </h2>

              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                All {TEST_ITEMS.length} checklist items must be verified before you can proceed with deployment.
              </p>

              <div className="flex items-center justify-center gap-2 mb-8">
                <Badge variant="outline" className="text-destructive border-destructive/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {getPassedCount()} / {TEST_ITEMS.length} tests passed
                </Badge>
              </div>

              <Separator className="my-6" />

              <Link href="/jt/07-test">
                <Button size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return to Test Checklist
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // UNLOCKED STATE - Show ship confirmation
  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-10 lg:px-10">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
            Ship
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Ready for deployment.
          </p>
        </div>

        {/* Unlocked Message */}
        <Card className="border-success">
          <CardContent className="p-10 text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <Unlock className="w-10 h-10 text-success" />
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-3">
              All tests passed!
            </h2>

            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your Job Notification Tracker has passed all {TEST_ITEMS.length} verification checks and is ready for deployment.
            </p>

            <div className="flex items-center justify-center gap-2 mb-8">
              <Badge className="bg-success text-success-foreground px-3 py-1">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                {TEST_ITEMS.length} / {TEST_ITEMS.length} tests passed
              </Badge>
            </div>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/jt/07-test">
                <Button variant="outline" size="lg">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tests
                </Button>
              </Link>
              <Button size="lg" className="bg-success hover:bg-success/90">
                <Rocket className="w-4 h-4 mr-2" />
                Deploy to Production
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Notes */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-2">
            Deployment Checklist
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ All features tested and verified</li>
            <li>✓ localStorage persistence working</li>
            <li>✓ No console errors</li>
            <li>✓ Premium design system maintained</li>
            <li>✓ Routes functioning correctly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
