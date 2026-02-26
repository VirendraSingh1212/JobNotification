import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-background">
      <div className="text-center max-w-[720px]">
        <h1 className="text-5xl lg:text-6xl font-semibold text-foreground tracking-tight">
          Stop Missing The Right Jobs.
        </h1>
        <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
          Precision-matched job discovery delivered daily at 9AM.
        </p>
        <div className="mt-10">
          <Link href="/settings">
            <Button size="lg" className="px-8 py-6 text-base">
              Start Tracking
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
